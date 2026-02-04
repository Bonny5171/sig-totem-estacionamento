type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends RequestInit {
  method?: HttpMethod;
}

export async function httpClient<T = unknown>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  // se não tiver body, evita erro
  if (response.status === 204) return {} as T;

  return response.json() as Promise<T>;
}
