import { NextRequest } from 'next/server';

const BASE_URL =
  'https://clubepaineiras.com.br/AliveTeste/Alive.app';

async function handler(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> } // 🔥 tipagem correta
) {
  // 🔥 Next 15 exige await
  const { path } = await context.params;

  const fullPath = path.join('/');
  const url = `${BASE_URL}/${fullPath}`;

  console.log('➡️ Proxy:', req.method, url);

  const headers: HeadersInit = {};
  let body: BodyInit | undefined;

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const json = await req.json();
      body = JSON.stringify(json);
      headers['Content-Type'] = 'application/json';
    } else {
      body = await req.text();
      headers['Content-Type'] = contentType;
    }
  }

  const response = await fetch(url, {
    method: req.method,
    headers,
    body,
  });

  const text = await response.text();

  return new Response(text, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') || 'text/plain',
    },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
