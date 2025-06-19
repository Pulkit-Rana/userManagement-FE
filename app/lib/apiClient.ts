// lib/apiClient.ts
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});

  // 🧼 Never set Authorization manually (no token in memory)
  // Cookies (HttpOnly) will be sent automatically

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  let errorBody: any = {};
  try {
    errorBody = await response.clone().json();
  } catch (_) {}

  if (!response.ok) {
    throw new Error(errorBody.message || 'API Error');
  }

  return response.json() as Promise<T>;
}
