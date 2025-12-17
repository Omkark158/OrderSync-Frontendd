// ============================================
// 6. storage.js - localStorage Utilities
// ============================================

// Get item from localStorage
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return defaultValue;
  }
};

// Set item in localStorage
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
    return false;
  }
};

// Remove item from localStorage
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
    return false;
  }
};

// Clear all localStorage
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

// Check if key exists
export const hasItem = (key) => {
  return localStorage.getItem(key) !== null;
};

// Get cart from localStorage
export const getCart = () => {
  return getItem('cart', []);
};

// Save cart to localStorage
export const saveCart = (cart) => {
  return setItem('cart', cart);
};

// Clear cart
export const clearCart = () => {
  return removeItem('cart');
};

// Get cart count
export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// Storage event listener
export const onStorageChange = (callback) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};