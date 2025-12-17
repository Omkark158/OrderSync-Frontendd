// ============================================
// 4. helpers.js - General Helper Functions
// ============================================

// Debounce function
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calculate GST
export const calculateGST = (amount, rate = 5) => {
  return (amount * rate) / 100;
};

// Calculate total with GST
export const calculateTotalWithGST = (amount, rate = 5) => {
  return amount + calculateGST(amount, rate);
};

// Check if date is in past
export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

// Check if date is in future
export const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

// Get minimum datetime (current time + hours)
export const getMinDateTime = (hoursAhead = 2) => {
  const now = new Date();
  now.setHours(now.getHours() + hoursAhead);
  return now.toISOString().slice(0, 16);
};

// Copy to clipboard
export const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
};

// Download file
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Scroll to top
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

// Get query params
export const getQueryParams = (search) => {
  return Object.fromEntries(new URLSearchParams(search));
};

// Build query string
export const buildQueryString = (params) => {
  return new URLSearchParams(params).toString();
};