// Reusable API client for the Express backend.
import { API_BASE_URL } from '../config';

function isNetworkError(error) {
  return (
    error instanceof TypeError &&
    (error.message === 'Network request failed' || /Network request failed/.test(error.message))
  );
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error('Cannot reach the server. Check your network and API URL.');
    }
    throw error;
  }

  let data = null;
  try {
    data = await response.json();
  } catch (_e) {
    // Non-JSON response (e.g. 502 from proxy) — fall through to status handling.
  }

  if (!response.ok) {
    const message = (data && data.error) || `Request failed (${response.status}).`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: { name, email, password } }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),

  me: (token) => request('/auth/me', { token }),

  updateProfile: (token, { name, email }) =>
    request('/auth/me', { method: 'PATCH', body: { name, email }, token }),

  listCommunities: (token, { search, location } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/communities${qs}`, { token });
  },

  getCommunity: (token, id) => request(`/communities/${id}`, { token }),

  joinCommunity: (token, id) =>
    request(`/communities/${id}/join`, { method: 'POST', token }),

  leaveCommunity: (token, id) =>
    request(`/communities/${id}/leave`, { method: 'DELETE', token }),
};