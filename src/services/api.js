// ============================================
// src/services/api.js - FULLY FIXED WITH PROPER ROUTING
// ============================================
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Determine if this is an admin request
    const isAdminRoute = config.url?.includes('/admin') || 
                         window.location.pathname.startsWith('/admin');
    
    // Get appropriate token
    const token = isAdminRoute 
      ? localStorage.getItem('adminToken')
      : localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔑 Using ${isAdminRoute ? 'admin' : 'user'} token for:`, config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // If response contains a new token, update localStorage
    if (response.data.token) {
      const isAdminRoute = response.config.url?.includes('/admin') || 
                           window.location.pathname.startsWith('/admin');
      
      const tokenKey = isAdminRoute ? 'adminToken' : 'token';
      localStorage.setItem(tokenKey, response.data.token);
      console.log(`✅ Updated ${tokenKey}`);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔐 401 Unauthorized - Session expired');
      
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      
      // Clear appropriate auth data
      if (isAdminRoute) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        toast.error('Admin session expired. Please login again.', {
          duration: 4000,
          icon: '🔒',
        });
        window.location.href = '/admin/secure-access';
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        toast.error('Session expired. Please login again.', {
          duration: 3000,
        });
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.', {
        duration: 3000,
      });
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.', {
        duration: 3000,
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;