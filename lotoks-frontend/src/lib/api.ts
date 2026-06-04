/**
 * Central API fetch helper.
 * Prepends /api to every path and always sends cookies.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const { headers = {}, ...rest } = options;

  const response = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    },
    ...rest,
  });

  return response;
}

/**
 * Safely parse a JSON response, falling back to a meaningful error
 * when the server returns HTML (e.g. backend not running) or non-JSON.
 */
export async function apiJson<T = any>(
  response: Response,
): Promise<T> {
  // 502 / 503 almost always means Vite proxy can't reach the backend
  if (!response.ok && (response.status === 502 || response.status === 503)) {
    throw new Error(
      `Backend server is not running. Please start the backend and try again.\n` +
      `(${response.url} returned ${response.status})`
    );
  }

  const text = await response.text();
  if (!text) {
    throw new Error(response.ok ? 'Empty response' : `Request failed (${response.status})`);
  }
  // Check if the response is HTML (backend offline / proxy fallback)
  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    throw new Error(
      `Backend server is not running. Please start the backend and try again. (${response.url})`
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      `Invalid response from server (expected JSON, got ${response.headers.get('content-type') || 'unknown'})`
    );
  }
}
