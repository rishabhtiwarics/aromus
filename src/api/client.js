const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');

export const getToken = () => localStorage.getItem('aromus-token');

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || payload.error || 'The request could not be completed.');
  return payload;
}

export const api = {
  get: (path) => apiRequest(path),
  post: (path, data) => apiRequest(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path, data) => apiRequest(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (path) => apiRequest(path, { method: 'DELETE' }),
};
