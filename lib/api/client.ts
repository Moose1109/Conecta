export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";

export function hasApiBaseUrl() {
  return API_BASE_URL.length > 0;
}

export type ApiFetchOptions = RequestInit & {
  token?: string;
};

export async function apiFetch<T>(
  path: string,
  { token, headers, ...options }: ApiFetchOptions = {},
): Promise<T> {
  if (!hasApiBaseUrl()) {
    throw new Error("API base URL is not configured");
  }

  const url = `${API_BASE_URL}${path}`;
  const method = options.method?.toString().toUpperCase() ?? "GET";
  console.log(`API ${method}:`, url);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("API response is not valid JSON");
  }
}
