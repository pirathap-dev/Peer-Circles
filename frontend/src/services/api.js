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

  updateProfile: (token, { name, email, avatar_url }) =>
    request('/auth/me', {
      method: 'PATCH',
      body: { name, email, avatar_url },
      token,
    }),

  // Uploads a base64 data URI (or remote URL) to Cloudinary via the backend.
  uploadAsset: (token, dataUri) =>
    request('/upload', { method: 'POST', body: { file: dataUri }, token }),

  listCommunities: (token, { search, location } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/communities${qs}`, { token });
  },

  getCommunity: (token, id) => request(`/communities/${id}`, { token }),

  joinCommunity: (token, id, { anonymous = false } = {}) =>
    request(`/communities/${id}/join`, {
      method: 'POST',
      body: { anonymous },
      token,
    }),

  leaveCommunity: (token, id) =>
    request(`/communities/${id}/leave`, { method: 'DELETE', token }),

  // Update the anonymous preference for an existing membership
  setMembershipAnonymous: (token, id, anonymous) =>
    request(`/communities/${id}/anonymous`, {
      method: 'PATCH',
      body: { anonymous },
      token,
    }),

  // Group discussion (post) endpoints
  listDiscussions: (token, communityId) =>
    request(`/groups/${communityId}/posts`, { token }),

  getDiscussion: (token, communityId, discussionId) =>
    request(`/groups/${communityId}/posts/${discussionId}`, { token }),

  createDiscussion: (token, communityId, { title, content, is_anonymous = false }) =>
    request(`/groups/${communityId}/posts`, {
      method: 'POST',
      body: { title, content, is_anonymous },
      token,
    }),

  // Post/comment (discussion reply) endpoints
  addComment: (token, postId, content, { is_anonymous = false } = {}) =>
    request(`/groups/${postId}/comments`, {
      method: 'POST',
      body: { content, is_anonymous },
      token,
    }),

  deleteComment: (token, postId, commentId) =>
    request(`/groups/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      token,
    }),
};