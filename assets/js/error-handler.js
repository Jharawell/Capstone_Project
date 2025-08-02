// Comprehensive Error Handling and Validation System
class ErrorHandler {
  static validateInput(data, rules) {
    const errors = [];
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field];
      
      if (rule.required && (!value || value.trim() === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      
      if (value && rule.minLength && value.length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters`);
      }
      
      if (value && rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${field} must be less than ${rule.maxLength} characters`);
      }
      
      if (value && rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
      
      if (value && rule.type === 'email' && !this.isValidEmail(value)) {
        errors.push(`${field} must be a valid email address`);
      }
      
      if (value && rule.type === 'date' && !this.isValidDate(value)) {
        errors.push(`${field} must be a valid date`);
      }
    }
    
    return errors;
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  static async safeFirebaseOperation(operation, errorMessage = 'Operation failed') {
    try {
      if (!firebaseManager.isInitialized) {
        throw new Error('Database not initialized');
      }
      return await operation();
    } catch (error) {
      console.error('Firebase operation failed:', error);
      firebaseManager.showErrorAlert(errorMessage);
      throw error;
    }
  }

  static safeDOMOperation(operation, elementId = null) {
    try {
      return operation();
    } catch (error) {
      console.error('DOM operation failed:', error);
      const message = elementId ? 
        `Failed to access element: ${elementId}` : 
        'Failed to perform DOM operation';
      firebaseManager.showErrorAlert(message);
      return null;
    }
  }

  static handleAsyncError(promise, errorMessage = 'Operation failed') {
    return promise.catch(error => {
      console.error('Async operation failed:', error);
      firebaseManager.showErrorAlert(errorMessage);
      throw error;
    });
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  static validateControlNumber(controlNumber) {
    // Validate control number format: YYMMDD-XX/100
    const pattern = /^\d{6}-\d+\/100$/;
    return pattern.test(controlNumber);
  }

  static validateDateRange(date, minDate = '2020-01-01', maxDate = '2030-12-31') {
    const inputDate = new Date(date);
    const min = new Date(minDate);
    const max = new Date(maxDate);
    
    return inputDate >= min && inputDate <= max;
  }

  static rateLimit(operation, maxCalls = 10, timeWindow = 60000) {
    const now = Date.now();
    const key = `rate_limit_${operation}`;
    
    let calls = JSON.parse(localStorage.getItem(key) || '[]');
    calls = calls.filter(timestamp => now - timestamp < timeWindow);
    
    if (calls.length >= maxCalls) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    calls.push(now);
    localStorage.setItem(key, JSON.stringify(calls));
  }
}

// Form validation rules
const VALIDATION_RULES = {
  entry: {
    type: { required: true },
    dateReceived: { required: true, type: 'date' },
    timeReceived: { required: true },
    from: { required: true, minLength: 2, maxLength: 100 },
    office: { required: true, minLength: 2, maxLength: 100 },
    subject: { required: true, minLength: 5, maxLength: 500 },
    endorsedTo: { required: true, minLength: 2, maxLength: 100 }
  },
  user: {
    firstName: { required: true, minLength: 2, maxLength: 50 },
    lastName: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true, type: 'email' },
    phone: { required: true, pattern: /^[\+]?[1-9][\d]{0,15}$/ }
  }
};

// Utility functions for safe DOM operations
function getElementSafely(elementId, operation = 'get') {
  return ErrorHandler.safeDOMOperation(() => {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }
    return element;
  }, elementId);
}

function showSuccessAlert(message) {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#2e7d32',
      timer: 2000,
      timerProgressBar: true
    });
  } else {
    alert('Success: ' + message);
  }
}

function showConfirmDialog(title, text, confirmButtonText) {
  if (typeof Swal !== 'undefined') {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#dc3545',
      confirmButtonText: confirmButtonText
    });
  } else {
    return confirm(text) ? Promise.resolve({ isConfirmed: true }) : Promise.resolve({ isConfirmed: false });
  }
}

// Export for use in other files
window.ErrorHandler = ErrorHandler;
window.VALIDATION_RULES = VALIDATION_RULES;
window.getElementSafely = getElementSafely;
window.showSuccessAlert = showSuccessAlert;
window.showConfirmDialog = showConfirmDialog; 