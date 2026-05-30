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
