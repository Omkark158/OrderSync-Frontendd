// ============================================
// 2. authService.js - Authentication APIs
// ============================================
import api from './api';

export const authService = {
  // Signup
  signup: async (name, phone) => {
    const response = await api.post('/auth/signup', { name, phone });
    return response.data;
  },

  // Verify Signup OTP
  verifySignupOTP: async (phone, otp) => {
    const response = await api.post('/auth/verify-signup', { phone, otp });
    return response.data;
  },

  // Resend Signup OTP
  resendSignupOTP: async (phone) => {
    const response = await api.post('/auth/resend-signup', { phone });
    return response.data;
  },

  // Login
  login: async (phone) => {
    const response = await api.post('/auth/login', { phone });
    return response.data;
  },

  // Verify Login OTP
  verifyLoginOTP: async (phone, otp) => {
    const response = await api.post('/auth/verify-login', { phone, otp });
    return response.data;
  },

  // Resend Login OTP
  resendLoginOTP: async (phone) => {
    const response = await api.post('/auth/resend-login', { phone });
    return response.data;
  },

  // Get Current User
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Admin Login
  adminLogin: async (email, password, adminKey) => {
    const response = await api.post('/auth/admin-login', { email, password, adminKey });
    return response.data;
  },
};