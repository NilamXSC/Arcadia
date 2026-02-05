const API = '/api';

function getToken() {
  return localStorage.getItem('arcadia_token');
}

export async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const authApi = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  guest: () => request('/auth/guest', { method: 'POST' }),
  me: () => request('/auth/me'),
  refresh: () => request('/auth/refresh', { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` } }),
};

export const patientsApi = {
  list: (params) => request('/patients?' + new URLSearchParams(params || {})),
  get: (id) => request(`/patients/${id}`),
  create: (body) => request('/patients', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/patients/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => request(`/patients/${id}`, { method: 'DELETE' }),
};

export const dashboardApi = {
  analytics: () => request('/dashboard/analytics'),
};

export const aiApi = {
  chat: (message, history) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ message, history }) }),
};
