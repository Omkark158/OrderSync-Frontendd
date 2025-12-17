// ============================================
// 1. auth.js - Authentication Utilities
// ============================================

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Get admin token
export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

// Set token
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Set admin token
export const setAdminToken = (token) => {
  localStorage.setItem('adminToken', token);
};

// Remove token
export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Remove admin token
export const removeAdminToken = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

// Get user from localStorage
export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Get admin user
export const getAdminUser = () => {
  try {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing admin data:', error);
    return null;
  }
};

// Set user
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Set admin user
export const setAdminUser = (user) => {
  localStorage.setItem('adminUser', JSON.stringify(user));
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

// Check if admin is authenticated
export const isAdminAuthenticated = () => {
  const token = getAdminToken();
  const user = getAdminUser();
  return !!(token && user && user.role === 'admin');
};

// Logout user
export const logout = () => {
  removeToken();
  window.location.href = '/login';
};

// Logout admin
export const logoutAdmin = () => {
  removeAdminToken();
  window.location.href = '/admin/login';
};