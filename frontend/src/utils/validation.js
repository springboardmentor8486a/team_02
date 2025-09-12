// Validation utilities for forms

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

export const validateFileSize = (file, maxSizeMB) => {
  if (!file) return true;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file, allowedTypes) => {
  if (!file) return true;
  return allowedTypes.includes(file.type);
};

// Form validation functions
export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!validateRequired(formData.username)) {
    errors.username = 'Username is required';
  }
  
  if (!validateRequired(formData.password)) {
    errors.password = 'Password is required';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegisterForm = (formData) => {
  const errors = {};
  
  if (!validateRequired(formData.fullName)) {
    errors.fullName = 'Full name is required';
  } else if (!validateMinLength(formData.fullName, 2)) {
    errors.fullName = 'Full name must be at least 2 characters';
  }
  
  if (!validateRequired(formData.username)) {
    errors.username = 'Username is required';
  } else if (!validateMinLength(formData.username, 3)) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number';
  }
  
  if (!validateRequired(formData.password)) {
    errors.password = 'Password is required';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (!validateRequired(formData.confirmPassword)) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateReportForm = (formData) => {
  const errors = {};
  
  if (!validateRequired(formData.title)) {
    errors.title = 'Issue title is required';
  } else if (!validateMinLength(formData.title, 5)) {
    errors.title = 'Title must be at least 5 characters';
  }
  
  if (!validateRequired(formData.category)) {
    errors.category = 'Please select a category';
  }
  
  if (!validateRequired(formData.location)) {
    errors.location = 'Location is required';
  } else if (!validateMinLength(formData.location, 5)) {
    errors.location = 'Please provide a more specific location';
  }
  
  if (!validateRequired(formData.priority)) {
    errors.priority = 'Please select a priority level';
  }
  
  if (!validateRequired(formData.description)) {
    errors.description = 'Description is required';
  } else if (!validateMinLength(formData.description, 10)) {
    errors.description = 'Description must be at least 10 characters';
  }
  
  if (formData.photo) {
    if (!validateFileType(formData.photo, ['image/jpeg', 'image/png'])) {
      errors.photo = 'Please upload a JPG or PNG image';
    } else if (!validateFileSize(formData.photo, 10)) {
      errors.photo = 'File size must be less than 10MB';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
