// ============================================
// 9. userService.js - User Management
// ============================================
import api from './api';

export const userService = {
  // Get User Profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update Profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Update Password
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/users/update-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Add Address
  addAddress: async (addressData) => {
    const response = await api.post('/users/address', addressData);
    return response.data;
  },

  // Get All Addresses
  getAddresses: async () => {
    const response = await api.get('/users/addresses');
    return response.data;
  },

  // Update Address
  updateAddress: async (addressId, addressData) => {
    const response = await api.put(`/users/address/${addressId}`, addressData);
    return response.data;
  },

  // Delete Address
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/users/address/${addressId}`);
    return response.data;
  },
};