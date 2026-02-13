type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends RequestInit {
  method?: HttpMethod;
  data?: unknown;
  forceJson?: boolean;
}

export async function httpClient<T = unknown>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  const { forceJson = false, ...fetchOptions } = options || {};
  
  const headers: HeadersInit = {
    ...(fetchOptions.headers?.['Content-Type'] ? {} : { 'Content-Type': 'application/json' }),
    ...(fetchOptions.headers || {}),
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    body: fetchOptions.data ? JSON.stringify(fetchOptions.data) : fetchOptions.body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorData: any = { status: response.status };
    
    try {
      errorData = { ...errorData, ...JSON.parse(errorText) };
    } catch {
      errorData.message = errorText || response.statusText;
    }
    
    throw new Error(
      errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  if (response.status === 204 || response.status === 205) {
    return {} as T;
  }

  const contentType = response.headers.get('content-type') || '';
  const responseText = await response.text();

  if (!responseText.trim()) {
    return {} as T;
  }

  const shouldParseAsJson = 
    forceJson ||
    contentType.includes('application/json') ||
    (responseText.trim().startsWith('{') && responseText.trim().endsWith('}')) ||
    (responseText.trim().startsWith('[') && responseText.trim().endsWith(']'));

  if (shouldParseAsJson) {
    try {
      return JSON.parse(responseText) as T;
    } catch (parseError) {
      if (forceJson) {
        throw new Error(`Invalid JSON response from ${url}`);
      }
      
      console.warn(`JSON parse failed for ${url}, returning as text`);
      return responseText as unknown as T;
    }
  }

  return responseText as unknown as T;
}