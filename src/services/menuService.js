// ============================================
// 5. menuService.js - Menu Management
// ============================================
import api from './api';

export const menuService = {
  // Get All Menu Items
  getAllMenuItems: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `/menu?${params}` : '/menu';
    const response = await api.get(url);
    return response.data;
  },

  // Get Menu Item by ID
  getMenuItemById: async (itemId) => {
    const response = await api.get(`/menu/${itemId}`);
    return response.data;
  },

  // Get Menu by Category
  getMenuByCategory: async (category) => {
    const response = await api.get(`/menu/category/${category}`);
    return response.data;
  },

  // Create Menu Item (Admin)
  createMenuItem: async (itemData) => {
    const response = await api.post('/menu', itemData);
    return response.data;
  },

  // Update Menu Item (Admin)
  updateMenuItem: async (itemId, itemData) => {
    const response = await api.put(`/menu/${itemId}`, itemData);
    return response.data;
  },

  // Delete Menu Item (Admin)
  deleteMenuItem: async (itemId) => {
    const response = await api.delete(`/menu/${itemId}`);
    return response.data;
  },

  // Toggle Availability (Admin)
  toggleAvailability: async (itemId) => {
    const response = await api.patch(`/menu/${itemId}/availability`);
    return response.data;
  },
};
