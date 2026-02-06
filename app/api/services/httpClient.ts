type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends RequestInit {
  method?: HttpMethod;
  data?: unknown;
  // Nova opção para forçar tratamento como JSON
  forceJson?: boolean;
}

export async function httpClient<T = unknown>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  const { forceJson = false, ...fetchOptions } = options || {};
  
  const headers: HeadersInit = {
    // Só adiciona Content-Type padrão se não houver um especificado
    ...(fetchOptions.headers?.['Content-Type'] ? {} : { 'Content-Type': 'application/json' }),
    ...(fetchOptions.headers || {}),
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    body: fetchOptions.data ? JSON.stringify(fetchOptions.data) : fetchOptions.body,
  });

  // Tratamento de erros melhorado
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

  // Resposta vazia (204 No Content)
  if (response.status === 204 || response.status === 205) {
    return {} as T;
  }

  const contentType = response.headers.get('content-type') || '';
  const responseText = await response.text();

  // Se não há conteúdo
  if (!responseText.trim()) {
    return {} as T;
  }

  // Se forçar JSON ou detectar JSON
  const shouldParseAsJson = 
    forceJson ||
    contentType.includes('application/json') ||
    (responseText.trim().startsWith('{') && responseText.trim().endsWith('}')) ||
    (responseText.trim().startsWith('[') && responseText.trim().endsWith(']'));

  if (shouldParseAsJson) {
    try {
      return JSON.parse(responseText) as T;
    } catch (parseError) {
      // Se forçado a ser JSON mas falhou, lança erro
      if (forceJson) {
        throw new Error(`Invalid JSON response from ${url}`);
      }
      
      // Caso contrário, retorna como texto
      console.warn(`JSON parse failed for ${url}, returning as text`);
      return responseText as unknown as T;
    }
  }

  // Para outros tipos de conteúdo
  return responseText as unknown as T;
}