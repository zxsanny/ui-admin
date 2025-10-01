export const getApiBaseUrl = (): string => {
  return process.env.NODE_ENV === 'production' ? 'https://api.azaion.com' : '/proxy';
};

export const getDefaultFetchOptions = (): RequestInit => ({
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
  } as Record<string, string>
});

export const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  return headers;
};
