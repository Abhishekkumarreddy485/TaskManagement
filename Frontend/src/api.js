const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');

  // Make sure headers are properly merged
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Throw a proper error object
    const error = new Error(data.msg || 'Request failed');
    error.status = res.status;
    throw error;
  }

  return data;
}

export function register(payload) {
  return request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export function login(payload) {
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

export function getTasks() {
  return request('/api/tasks', { method: 'GET' });
}

export function createTask(payload) {
  return request('/api/tasks', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateTask(id, payload) {
  return request(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, { method: 'DELETE' });
}

export function toggleTask(id) {
  return request(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
}
