// ============================================
// 2. constants.js - App Constants
// ============================================

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// App Info
export const APP_NAME = 'Sachin Foods';
export const APP_TAGLINE = 'Authentic Kerala Cuisine';

// Company Info
export const COMPANY_INFO = {
  name: 'Sachin Foods',
  tagline: 'Manufacturing & Marketing of Chappathy, Appam, Veesappam, Pathiri, Arippathiri & Bakery Items',
  address: 'Kundara, Kollam, Kerala',
  phone: ['9539387240', '9388808825', '8547828825'],
  email: 'info@sachinfoods.com',
  gstin: '32BMDPB7722C1ZR',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  ready: 'bg-green-100 text-green-700',
  delivered: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Menu Categories
export const MENU_CATEGORIES = [
  { value: 'starters', label: 'Starters' },
  { value: 'main-course', label: 'Main Course' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'special', label: 'Special' },
];

// GST Rate
export const GST_RATE = 5; // 5%

// Minimum Advance Payment
export const MIN_ADVANCE_PERCENTAGE = 20; // 20%

// OTP Expiry Time (in seconds)
export const OTP_EXPIRY = 600; // 10 minutes

// Validation Patterns
export const REGEX_PATTERNS = {
  PHONE: /^[6-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PINCODE: /^\d{6}$/,
  GSTIN: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[Z]{1}[A-Z\d]{1}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_PHONE: 'Please enter a valid 10-digit phone number',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PINCODE: 'Please enter a valid 6-digit pincode',
  INVALID_OTP: 'Invalid OTP. Please try again',
  EXPIRED_OTP: 'OTP has expired. Please request a new one',
  NETWORK_ERROR: 'Network error. Please check your connection',
  GENERIC_ERROR: 'Something went wrong. Please try again',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Order created successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
  OTP_SENT: 'OTP sent to your phone',
  PROFILE_UPDATED: 'Profile updated successfully',
};