export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ??
  process.env.NEXT_PUBLIC_API_URL?.trim() ??
  "";

export function hasApiBaseUrl() {
  return API_BASE_URL.length > 0;
}

export type ApiFetchOptions = RequestInit & {
  token?: string;
};

export class ApiError extends Error {
  status: number;
  statusText: string;
  detail?: unknown;

  constructor({
    status,
    statusText,
    detail,
  }: {
    status: number;
    statusText: string;
    detail?: unknown;
  }) {
    super(`API request failed: ${status} ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.detail = detail;
  }
}

export function isUnauthorizedError(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

export async function apiFetch<T>(
  path: string,
  { token, headers, ...options }: ApiFetchOptions = {},
): Promise<T> {
  if (!hasApiBaseUrl()) {
    throw new Error("API base URL is not configured");
  }

  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let detail: unknown;

    try {
      detail = await response.json();
    } catch {
      detail = undefined;
    }

    throw new ApiError({
      status: response.status,
      statusText: response.statusText,
      detail,
    });
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("API response is not valid JSON");
  }
}
