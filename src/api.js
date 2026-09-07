// src/api.js - Frontend API Client for Express & MongoDB
const API_BASE_URL = 'http://localhost:5000/api';

const TOKEN_KEY = 'lab_token';
const USER_KEY = 'lab_current_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getStoredUser() {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Internal helper for HTTP requests
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// Authentication API
export async function apiLogin(username, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });

  if (data.token && data.user) {
    setToken(data.token);
    setStoredUser(data.user);
  }

  return data;
}

export async function apiRegister(username, password, fullName, email) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, fullName, email })
  });

  return data;
}

// User Profile API
export async function apiGetProfile() {
  const data = await request('/users/me');
  if (data.user) {
    setStoredUser(data.user);
  }
  return data;
}

export async function apiUpdateProfile(fullName, email, username) {
  const data = await request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify({ fullName, email, username })
  });

  if (data.user) {
    setStoredUser(data.user);
  }

  return data;
}

export async function apiChangePassword(currentPassword, newPassword) {
  const data = await request('/users/change-password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword })
  });

  if (data.user) {
    setStoredUser(data.user);
  }

  return data;
}

export async function apiDeleteAccount() {
  const data = await request('/users/me', {
    method: 'DELETE'
  });

  clearAuth();
  return data;
}

// Admin API
export async function apiGetAdminUsers() {
  return request('/admin/users');
}

export async function apiAdminResetPassword(targetUsername, newPassword) {
  return request('/admin/reset-password', {
    method: 'PUT',
    body: JSON.stringify({ targetUsername, newPassword })
  });
}

export async function apiAdminDeleteUser(targetUsername) {
  return request(`/admin/users/${encodeURIComponent(targetUsername)}`, {
    method: 'DELETE'
  });
}
