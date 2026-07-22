import { ApiError } from "@/lib/api/client";

const knownBackendMessages: Record<string, string> = {
  "Activity is full": "La actividad ya no tiene plazas disponibles.",
  "Activity slug already exists": "Ya existe una actividad con un identificador equivalente.",
  "Email already registered": "Ya existe una cuenta con este correo electrónico.",
  "Invalid email or password": "El email o la contraseña no son correctos.",
  "Username already taken": "Ese nombre de usuario ya está en uso.",
  "Village slug already exists": "Ya existe un pueblo con ese identificador.",
};

function knownBackendDetail(error: ApiError) {
  return typeof error.detail === "string"
    ? knownBackendMessages[error.detail]
    : undefined;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Ha ocurrido un problema inesperado. Inténtalo de nuevo.",
) {
  if (!(error instanceof ApiError)) return fallback;

  const knownMessage = knownBackendDetail(error);
  if (knownMessage) return knownMessage;

  if (error.type === "configuration") {
    return "La URL de la API no está configurada.";
  }
  if (error.type === "timeout") {
    return "La solicitud tardó demasiado.";
  }
  if (error.isNetworkError || error.type === "network") {
    return "No pudimos conectar con la API.";
  }
  if (error.status === 400) return "No se pudo completar la solicitud. Revisa los datos enviados.";
  if (error.status === 401) return "Las credenciales no son correctas o tu sesión ha caducado.";
  if (error.status === 403) return "No tienes permiso para realizar esta acción.";
  if (error.status === 404) return "No encontramos el contenido solicitado.";
  if (error.status === 409) return "Esta acción ya fue realizada o entra en conflicto con el estado actual.";
  if (error.status === 422) return "Revisa los campos indicados.";
  if (error.status === 429) return "Has realizado demasiadas solicitudes. Inténtalo más tarde.";
  if (error.status >= 500) return "Ha ocurrido un problema en el servidor.";

  return fallback;
}

export function logApiIssue(context: string, error: unknown) {
  if (process.env.NODE_ENV !== "development") return;

  if (error instanceof ApiError) {
    console.warn(context, {
      code: error.code,
      message: getApiErrorMessage(error),
      path: error.path,
      status: error.status,
      type: error.type,
    });
    return;
  }

  console.warn(context, { type: "unexpected" });
}
