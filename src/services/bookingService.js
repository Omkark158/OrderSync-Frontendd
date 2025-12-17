// ============================================
// 3. bookingService.js - Booking Management
// ============================================
import api from './api';

export const bookingService = {
  // Create Booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get All Bookings
  getAllBookings: async (status) => {
    const url = status ? `/bookings?status=${status}` : '/bookings';
    const response = await api.get(url);
    return response.data;
  },

  // Get Upcoming Bookings
  getUpcomingBookings: async () => {
    const response = await api.get('/bookings/upcoming');
    return response.data;
  },

  // Get Booking by ID
  getBookingById: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Update Booking
  updateBooking: async (bookingId, updateData) => {
    const response = await api.put(`/bookings/${bookingId}`, updateData);
    return response.data;
  },

  // Cancel Booking
  cancelBooking: async (bookingId, reason) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`, { reason });
    return response.data;
  },

  // Complete Booking (Admin)
  completeBooking: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/complete`);
    return response.data;
  },

  // Add Feedback
  addFeedback: async (bookingId, rating, comment) => {
    const response = await api.post(`/bookings/${bookingId}/feedback`, { rating, comment });
    return response.data;
  },
};