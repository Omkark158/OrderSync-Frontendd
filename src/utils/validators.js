//============================================
// 7. validators.js - Validation Functions
// ============================================

// Validate phone number
export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Validate email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate pincode
export const validatePincode = (pincode) => {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
};

// Validate GSTIN
export const validateGSTIN = (gstin) => {
  const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[Z]{1}[A-Z\d]{1}$/;
  return gstinRegex.test(gstin);
};

// Validate OTP
export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

// Validate name
export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

// Validate password
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password && password.length >= 8;
};

// Validate amount
export const validateAmount = (amount) => {
  return !isNaN(amount) && parseFloat(amount) > 0;
};

// Validate required field
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Validate min length
export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

// Validate max length
export const validateMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

// Validate number range
export const validateRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

// Validate form data
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = data[field];
    
    if (rule.required && !validateRequired(value)) {
      errors[field] = rule.message || `${field} is required`;
    }
    
    if (rule.minLength && !validateMinLength(value, rule.minLength)) {
      errors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`;
    }
    
    if (rule.maxLength && !validateMaxLength(value, rule.maxLength)) {
      errors[field] = rule.message || `${field} must not exceed ${rule.maxLength} characters`;
    }
    
    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} is invalid`;
    }
    
    if (rule.custom && !rule.custom(value)) {
      errors[field] = rule.message || `${field} is invalid`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Get error message
export const getErrorMessage = (field, errors) => {
  return errors[field] || '';
};