const BASE_URL = "http://localhost:4000/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal; // 👈 added optional signal
};

export async function apiRequest<TResponse>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { method = "GET", body, signal } = options;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal, // 👈 passes the abort signal to fetch
  });

  let data: any;
  try {
    data = await response.json();
  } catch {
    // If response has no body (e.g., 204 No Content), set data to null
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }

  return data as TResponse;
}
