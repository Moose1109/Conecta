#!/usr/bin/env node

/**
 * ConectaPueblos backend smoke test.
 *
 * Safe default:
 *   npm run smoke:backend -- --base-url http://localhost:8000
 *
 * Disposable local QA database only (creates and removes QA resources):
 *   QA_ALLOW_MUTATIONS=true npm run smoke:backend -- --base-url http://localhost:8000 --mutations
 *
 * The mutating mode refuses non-loopback hosts and never prints credentials or tokens.
 */

import { randomUUID } from "node:crypto";

const args = process.argv.slice(2);
const baseUrlIndex = args.indexOf("--base-url");
const baseUrl = (
  baseUrlIndex >= 0 ? args[baseUrlIndex + 1] : process.env.NEXT_PUBLIC_API_BASE_URL
)?.replace(/\/$/, "");
const mutationsRequested = args.includes("--mutations");
const mutationsAllowed = process.env.QA_ALLOW_MUTATIONS === "true";

if (!baseUrl) {
  console.error(
    "Falta --base-url o NEXT_PUBLIC_API_BASE_URL. Ejemplo: --base-url http://localhost:8000",
  );
  process.exit(2);
}

let parsedBaseUrl;
try {
  parsedBaseUrl = new URL(baseUrl);
} catch {
  console.error("La URL base de la API no es válida.");
  process.exit(2);
}

if (mutationsRequested) {
  const loopbackHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);

  if (!loopbackHosts.has(parsedBaseUrl.hostname)) {
    console.error("El modo con mutaciones solo se permite contra localhost.");
    process.exit(2);
  }

  if (!mutationsAllowed) {
    console.error(
      "El modo con mutaciones requiere QA_ALLOW_MUTATIONS=true y una base local descartable.",
    );
    process.exit(2);
  }
}

const results = [];

function record(name, status, detail = "") {
  results.push({ name, status, detail });
  const suffix = detail ? ` — ${detail}` : "";
  console.log(`${status === "PASS" ? "✓" : status === "SKIP" ? "○" : "✗"} ${name}${suffix}`);
}

async function request(path, { expected = [200], token, ...options } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    signal: AbortSignal.timeout(15_000),
  });

  const text = await response.text();
  let body;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!expected.includes(response.status)) {
    throw new Error(`HTTP ${response.status}; esperado ${expected.join("/")}`);
  }

  return { body, headers: response.headers, status: response.status };
}

async function check(name, callback) {
  try {
    const detail = await callback();
    record(name, "PASS", detail);
    return true;
  } catch (error) {
    record(name, "FAIL", error instanceof Error ? error.message : "Error desconocido");
    return false;
  }
}

function collection(body) {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object" && Array.isArray(body.items)) return body.items;
  throw new Error("La respuesta no es una colección reconocible");
}

function requireString(value, label) {
  if (typeof value !== "string" || !value) throw new Error(`Falta ${label}`);
  return value;
}

async function runReadOnlySmoke() {
  await check("GET /health", async () => {
    const { body } = await request("/health");
    return body?.status ? `status=${body.status}` : "200";
  });

  await check("GET /openapi.json", async () => {
    const { body } = await request("/openapi.json");
    const paths = body?.paths && typeof body.paths === "object"
      ? Object.keys(body.paths).length
      : 0;
    if (!paths) throw new Error("OpenAPI sin paths");
    return `${paths} paths`;
  });

  const collections = [
    ["pueblos", "/api/v1/villages?limit=20"],
    ["actividades", "/api/v1/activities?limit=20"],
    ["publicaciones", "/api/v1/posts?limit=20"],
  ];

  for (const [label, path] of collections) {
    await check(`Listar ${label}`, async () => {
      const { body } = await request(path);
      return `${collection(body).length} elementos en la primera página`;
    });
  }

  await check("Validación limit=0", async () => {
    await request("/api/v1/villages?limit=0", { expected: [422] });
    return "422 esperado";
  });

  await check("Token inválido en ruta protegida", async () => {
    await request("/api/v1/users/me", {
      expected: [401],
      token: "qa.invalid.token",
    });
    return "401 esperado";
  });

  await check("Credenciales incorrectas", async () => {
    await request("/api/v1/auth/login", {
      body: JSON.stringify({
        email: `qa_missing_${Date.now()}@example.com`,
        password: "not-a-real-password",
      }),
      expected: [401],
      method: "POST",
    });
    return "401 esperado";
  });
}

async function runMutationSmoke() {
  const suffix = `${Date.now()}_${randomUUID().slice(0, 8)}`;
  const username = `qa_audit_${suffix}`.slice(0, 80);
  const email = `${username}@example.com`;
  const password = `Qa-${randomUUID()}-9a`;
  const created = { activityId: undefined, postId: undefined };
  let token;

  try {
    await check("Registrar usuario QA", async () => {
      const { body } = await request("/api/v1/auth/register", {
        body: JSON.stringify({ name: "QA Audit", username, email, password }),
        expected: [201],
        method: "POST",
      });
      token = requireString(body?.access_token ?? body?.token, "token de registro");
      return "201 y token recibidos";
    });

    if (!token) throw new Error("No se puede continuar sin token QA");

    await check("Rechazar registro duplicado", async () => {
      await request("/api/v1/auth/register", {
        body: JSON.stringify({ name: "QA Audit", username, email, password }),
        expected: [409],
        method: "POST",
      });
      return "409 esperado";
    });

    await check("Login QA", async () => {
      const { body } = await request("/api/v1/auth/login", {
        body: JSON.stringify({ email, password }),
        method: "POST",
      });
      token = requireString(body?.access_token ?? body?.token, "token de login");
      return "token recibido";
    });

    let userId;
    await check("Obtener usuario actual", async () => {
      const { body } = await request("/api/v1/users/me", { token });
      userId = requireString(body?.id, "id de usuario");
      return "perfil autenticado";
    });

    const { body: villagesBody } = await request("/api/v1/villages?limit=1", { token });
    const village = collection(villagesBody)[0];
    const villageId = requireString(village?.id, "pueblo QA");

    await check("Crear publicación QA", async () => {
      const { body } = await request("/api/v1/posts", {
        body: JSON.stringify({
          content: `Publicación de auditoría ${suffix}`,
          title: `QA audit ${suffix}`.slice(0, 180),
          village_id: villageId,
        }),
        expected: [201],
        method: "POST",
        token,
      });
      created.postId = requireString(body?.id, "id de publicación");
      return "201";
    });

    await check("Comprobar publicación QA", async () => {
      const { body } = await request(
        `/api/v1/posts?author_id=${encodeURIComponent(userId)}&limit=100`,
        { token },
      );
      if (!collection(body).some((post) => post.id === created.postId)) {
        throw new Error("La publicación no aparece en el listado filtrado");
      }
      return "persistencia visible";
    });

    for (const [name, method, path] of [
      ["Dar Me gusta", "POST", `/api/v1/posts/${created.postId}/like`],
      ["Quitar Me gusta", "DELETE", `/api/v1/posts/${created.postId}/like`],
      ["Guardar publicación", "POST", `/api/v1/posts/${created.postId}/save`],
      ["Quitar publicación de guardados", "DELETE", `/api/v1/posts/${created.postId}/save`],
      ["Seguir pueblo", "POST", `/api/v1/villages/${villageId}/follow`],
      ["Dejar de seguir pueblo", "DELETE", `/api/v1/villages/${villageId}/follow`],
    ]) {
      await check(name, async () => {
        await request(path, { method, token });
        return "200";
      });
    }

    const startsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1_000)
      .toISOString()
      .replace(/\.\d{3}Z$/, "");
    const activitySlug = `qa-audit-${suffix}`.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 160);

    await check("Crear actividad QA", async () => {
      const { body } = await request("/api/v1/activities", {
        body: JSON.stringify({
          capacity: 4,
          category: "Cultura",
          description: `Actividad reproducible de auditoría ${suffix}`,
          location: "Punto QA local",
          slug: activitySlug,
          starts_at: startsAt,
          status: "published",
          title: `Actividad QA ${suffix}`.slice(0, 180),
          village_id: villageId,
        }),
        expected: [201],
        method: "POST",
        token,
      });
      created.activityId = requireString(body?.id, "id de actividad");
      return "201";
    });

    for (const [name, method, path] of [
      ["Apuntarse a actividad", "POST", `/api/v1/activities/${created.activityId}/join`],
      ["Cancelar inscripción", "DELETE", `/api/v1/activities/${created.activityId}/join`],
      ["Guardar actividad", "POST", `/api/v1/activities/${created.activityId}/save`],
      ["Quitar actividad de guardados", "DELETE", `/api/v1/activities/${created.activityId}/save`],
    ]) {
      await check(name, async () => {
        await request(path, { method, token });
        return "200";
      });
    }

    record("Comentarios", "SKIP", "el backend no expone endpoint de comentarios");
    record("Logout de servidor", "SKIP", "el backend no expone endpoint de logout");
  } finally {
    if (token && created.postId) {
      await check("Limpiar publicación QA", async () => {
        await request(`/api/v1/posts/${created.postId}`, {
          expected: [204],
          method: "DELETE",
          token,
        });
        return "204";
      });
    }
    if (token && created.activityId) {
      await check("Limpiar actividad QA", async () => {
        await request(`/api/v1/activities/${created.activityId}`, {
          expected: [204],
          method: "DELETE",
          token,
        });
        return "204";
      });
    }
  }
}

console.log(`Smoke backend: ${parsedBaseUrl.origin}`);
console.log(`Modo: ${mutationsRequested ? "QA local con mutaciones" : "solo lectura"}`);

await runReadOnlySmoke();

if (mutationsRequested) {
  await runMutationSmoke();
} else {
  record(
    "Flujos que escriben en PostgreSQL",
    "SKIP",
    "no se solicitaron mutaciones; usa --mutations solo con una base local descartable",
  );
}

const failed = results.filter((result) => result.status === "FAIL");
console.log(`\nResumen: ${results.filter((result) => result.status === "PASS").length} PASS, ${failed.length} FAIL, ${results.filter((result) => result.status === "SKIP").length} SKIP`);
process.exitCode = failed.length ? 1 : 0;
