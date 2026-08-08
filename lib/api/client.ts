import { clearSession } from "@/lib/api/session";

const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "";

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");

const DEFAULT_API_TIMEOUT_MS = 15_000;
const SECRET_QUERY_KEYS = new Set([
  "access_token",
  "authorization",
  "password",
  "refresh_token",
  "token",
]);

export type ApiErrorType =
  | "aborted"
  | "configuration"
  | "http"
  | "network"
  | "parse"
  | "timeout";

export type ApiFieldErrors = Record<string, string[]>;

export function hasApiBaseUrl() {
  return API_BASE_URL.length > 0;
}

export type ApiFetchOptions = RequestInit & {
  token?: string;
  timeoutMs?: number;
};

export class ApiError extends Error {
  status: number;
  statusText: string;
  detail?: unknown;
  code?: string;
  fieldErrors?: ApiFieldErrors;
  path: string;
  type: ApiErrorType;
  isNetworkError: boolean;
  isTimeout: boolean;

  constructor({
    status,
    statusText,
    detail,
    code,
    fieldErrors,
    path,
    type = "http",
    isNetworkError = false,
    isTimeout = type === "timeout",
    cause,
    message,
  }: {
    status: number;
    statusText: string;
    detail?: unknown;
    code?: string;
    fieldErrors?: ApiFieldErrors;
    path: string;
    type?: ApiErrorType;
    isNetworkError?: boolean;
    isTimeout?: boolean;
    cause?: unknown;
    message?: string;
  }) {
    super(message ?? `API request failed: ${status} ${statusText}`, { cause });
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.detail = detail;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.path = path;
    this.type = type;
    this.isNetworkError = isNetworkError;
    this.isTimeout = isTimeout;
  }
}

export class ApiTimeoutError extends ApiError {
  constructor(path: string, cause?: unknown) {
    super({
      cause,
      isNetworkError: true,
      isTimeout: true,
      message: "API request timed out",
      path,
      status: 0,
      statusText: "Timeout",
      type: "timeout",
    });
    this.name = "ApiTimeoutError";
  }
}

export function isUnauthorizedError(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

export function isNotFoundError(error: unknown) {
  return error instanceof ApiError && error.status === 404;
}

function safeRequestPath(path: string) {
  try {
    const url = new URL(path, "https://api.invalid");

    for (const key of [...url.searchParams.keys()]) {
      if (SECRET_QUERY_KEYS.has(key.toLowerCase())) {
        url.searchParams.set(key, "[redacted]");
      }
    }

    const query = url.searchParams.toString();
    return `${url.pathname}${query ? `?${query}` : ""}`;
  } catch {
    return "/";
  }
}

function requestUrl(path: string, safePath: string) {
  if (!hasApiBaseUrl()) {
    throw new ApiError({
      message: "La URL de la API no está configurada.",
      path: safePath,
      status: 0,
      statusText: "API URL not configured",
      type: "configuration",
    });
  }

  let baseUrl: URL;

  try {
    baseUrl = new URL(API_BASE_URL);
  } catch (cause) {
    throw new ApiError({
      cause,
      message: "La URL de la API no está configurada correctamente.",
      path: safePath,
      status: 0,
      statusText: "Invalid API URL",
      type: "configuration",
    });
  }

  if (!["http:", "https:"].includes(baseUrl.protocol)) {
    throw new ApiError({
      message: "La URL de la API no está configurada correctamente.",
      path: safePath,
      status: 0,
      statusText: "Invalid API URL protocol",
      type: "configuration",
    });
  }

  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

function parseErrorPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { detail: payload };
  }

  const body = payload as { code?: unknown; detail?: unknown };
  const detail = body.detail;
  const code = typeof body.code === "string"
    ? body.code
    : detail && typeof detail === "object" && !Array.isArray(detail)
      ? typeof (detail as { code?: unknown }).code === "string"
        ? (detail as { code: string }).code
        : undefined
      : undefined;
  const fieldErrors: ApiFieldErrors = {};

  if (Array.isArray(detail)) {
    for (const issue of detail) {
      if (!issue || typeof issue !== "object") continue;

      const validationIssue = issue as { loc?: unknown; msg?: unknown };
      const location = Array.isArray(validationIssue.loc)
        ? validationIssue.loc.filter((part) => part !== "body").map(String)
        : [];
      const field = location.join(".") || "form";
      const message = typeof validationIssue.msg === "string"
        ? validationIssue.msg
        : "Revisa este valor.";

      fieldErrors[field] = [...(fieldErrors[field] ?? []), message];
    }
  }

  return {
    code,
    detail,
    fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
  };
}

function requestHeaders(headers: HeadersInit | undefined, token: string | undefined, body: BodyInit | null | undefined) {
  const result = new Headers(headers);

  if (!result.has("Accept")) result.set("Accept", "application/json");
  if (body && !result.has("Content-Type") && typeof body === "string") {
    result.set("Content-Type", "application/json");
  }
  if (token) result.set("Authorization", `Bearer ${token}`);

  return result;
}

export async function apiFetch<T>(
  path: string,
  {
    token,
    headers,
    signal: externalSignal,
    timeoutMs = DEFAULT_API_TIMEOUT_MS,
    ...options
  }: ApiFetchOptions = {},
): Promise<T> {
  const safePath = safeRequestPath(path);
  const url = requestUrl(path, safePath);
  const controller = new AbortController();
  let timedOut = false;
  const abortFromExternalSignal = () => controller.abort(externalSignal?.reason);
  const timeoutId = globalThis.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  if (externalSignal?.aborted) {
    abortFromExternalSignal();
  } else {
    externalSignal?.addEventListener("abort", abortFromExternalSignal, {
      once: true,
    });
  }

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: requestHeaders(headers, token, options.body),
    });
  } catch (cause) {
    if (timedOut) {
      throw new ApiTimeoutError(safePath, cause);
    }

    if (externalSignal?.aborted) {
      throw new ApiError({
        cause,
        message: "API request was aborted",
        path: safePath,
        status: 0,
        statusText: "Aborted",
        type: "aborted",
      });
    }

    throw new ApiError({
      cause,
      isNetworkError: true,
      message: "API network request failed",
      path: safePath,
      status: 0,
      statusText: "Network error",
      type: "network",
    });
  } finally {
    globalThis.clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", abortFromExternalSignal);
  }

  const responseText = response.status === 204 ? "" : await response.text();

  if (!response.ok) {
    let payload: unknown;

    if (responseText.trim()) {
      try {
        payload = JSON.parse(responseText);
      } catch {
        payload = undefined;
      }
    }

    const parsedError = parseErrorPayload(payload);

    if (response.status === 401) {
      clearSession();
    }

    throw new ApiError({
      status: response.status,
      statusText: response.statusText,
      path: safePath,
      ...parsedError,
    });
  }

  if (!responseText.trim()) {
    return undefined as T;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch (cause) {
    throw new ApiError({
      cause,
      message: "API response is not valid JSON",
      path: safePath,
      status: response.status,
      statusText: response.statusText,
      type: "parse",
    });
  }
}
