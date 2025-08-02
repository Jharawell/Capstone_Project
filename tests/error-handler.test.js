// Comprehensive Test Suite for Error Handling

// Mock Firebase for testing
const mockFirebase = {
  apps: [],
  initializeApp: jest.fn(),
  database: jest.fn(() => ({
    ref: jest.fn(() => ({
      child: jest.fn(() => ({
        once: jest.fn(() => Promise.resolve({ val: () => 0 })),
        set: jest.fn(() => Promise.resolve()),
        push: jest.fn(() => Promise.resolve())
      })),
      push: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
      remove: jest.fn(() => Promise.resolve())
    }))
  }))
};

// Mock DOM elements
const mockElements = {
  'testElement': { value: 'test', reset: jest.fn() },
  'nonExistentElement': null
};

// Mock document.getElementById
document.getElementById = jest.fn((id) => mockElements[id]);

// Mock SweetAlert
global.Swal = {
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
  close: jest.fn()
};

// Mock bootstrap
global.bootstrap = {
  Modal: {
    getInstance: jest.fn(() => ({
      hide: jest.fn()
    }))
  }
};

describe('ErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateInput', () => {
    test('should validate required fields', () => {
      const data = { name: '', email: 'test@test.com' };
      const rules = { name: { required: true }, email: { required: true } };
      
      const errors = ErrorHandler.validateInput(data, rules);
      expect(errors).toContain('name is required');
    });

    test('should validate email format', () => {
      const data = { email: 'invalid-email' };
      const rules = { email: { type: 'email' } };
      
      const errors = ErrorHandler.validateInput(data, rules);
      expect(errors).toContain('email must be a valid email address');
    });

    test('should validate date format', () => {
      const data = { date: 'invalid-date' };
      const rules = { date: { type: 'date' } };
      
      const errors = ErrorHandler.validateInput(data, rules);
      expect(errors).toContain('date must be a valid date');
    });

    test('should validate min length', () => {
      const data = { name: 'a' };
      const rules = { name: { minLength: 2 } };
      
      const errors = ErrorHandler.validateInput(data, rules);
      expect(errors).toContain('name must be at least 2 characters');
    });

    test('should validate max length', () => {
      const data = { name: 'very long name that exceeds the limit' };
      const rules = { name: { maxLength: 10 } };
      
      const errors = ErrorHandler.validateInput(data, rules);
      expect(errors).toContain('name must be less than 10 characters');
    });

    test('should validate pattern', () => {
      const data = { phone: 'invalid' };
      const rules = { phone: { pattern: /^\d{10}$/ } };
      
      const errors = ErrorHandler.validateInput(data, rules);
      expect(errors).toContain('phone format is invalid');
    });
  });

  describe('isValidEmail', () => {
    test('should validate correct email formats', () => {
      expect(ErrorHandler.isValidEmail('test@example.com')).toBe(true);
      expect(ErrorHandler.isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email formats', () => {
      expect(ErrorHandler.isValidEmail('invalid-email')).toBe(false);
      expect(ErrorHandler.isValidEmail('test@')).toBe(false);
      expect(ErrorHandler.isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isValidDate', () => {
    test('should validate correct date formats', () => {
      expect(ErrorHandler.isValidDate('2024-01-01')).toBe(true);
      expect(ErrorHandler.isValidDate('2024/01/01')).toBe(true);
    });

    test('should reject invalid date formats', () => {
      expect(ErrorHandler.isValidDate('invalid-date')).toBe(false);
      expect(ErrorHandler.isValidDate('2024-13-01')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    test('should remove dangerous characters', () => {
      expect(ErrorHandler.sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(ErrorHandler.sanitizeInput('javascript:alert("xss")')).toBe('alert("xss")');
      expect(ErrorHandler.sanitizeInput('onclick=alert("xss")')).toBe('alert("xss")');
    });

    test('should handle non-string input', () => {
      expect(ErrorHandler.sanitizeInput(123)).toBe(123);
      expect(ErrorHandler.sanitizeInput(null)).toBe(null);
    });
  });

  describe('validateControlNumber', () => {
    test('should validate correct control number format', () => {
      expect(ErrorHandler.validateControlNumber('240101-001/100')).toBe(true);
      expect(ErrorHandler.validateControlNumber('241231-999/100')).toBe(true);
    });

    test('should reject invalid control number format', () => {
      expect(ErrorHandler.validateControlNumber('invalid')).toBe(false);
      expect(ErrorHandler.validateControlNumber('240101-001')).toBe(false);
      expect(ErrorHandler.validateControlNumber('240101-001/200')).toBe(false);
    });
  });

  describe('validateDateRange', () => {
    test('should validate date within range', () => {
      expect(ErrorHandler.validateDateRange('2024-06-15')).toBe(true);
    });

    test('should reject date outside range', () => {
      expect(ErrorHandler.validateDateRange('2019-01-01')).toBe(false);
      expect(ErrorHandler.validateDateRange('2031-01-01')).toBe(false);
    });
  });

  describe('rateLimit', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('should allow operations within rate limit', () => {
      expect(() => {
        ErrorHandler.rateLimit('test', 5, 60000);
      }).not.toThrow();
    });

    test('should throw error when rate limit exceeded', () => {
      // Add multiple calls to exceed limit
      for (let i = 0; i < 5; i++) {
        ErrorHandler.rateLimit('test', 5, 60000);
      }
      
      expect(() => {
        ErrorHandler.rateLimit('test', 5, 60000);
      }).toThrow('Rate limit exceeded');
    });
  });
});

describe('FirebaseManager', () => {
  let firebaseManager;

  beforeEach(() => {
    firebaseManager = new FirebaseManager();
  });

  test('should initialize Firebase successfully', () => {
    global.firebase = mockFirebase;
    const result = firebaseManager.initialize();
    expect(result).toBe(true);
    expect(firebaseManager.isInitialized).toBe(true);
  });

  test('should handle initialization errors', () => {
    global.firebase = null;
    const result = firebaseManager.initialize();
    expect(result).toBe(false);
  });

  test('should throw error when accessing database before initialization', () => {
    expect(() => firebaseManager.getDatabase()).toThrow('Firebase not initialized');
  });
});

describe('Utility Functions', () => {
  describe('getElementSafely', () => {
    test('should return element when it exists', () => {
      const element = getElementSafely('testElement');
      expect(element).toBe(mockElements['testElement']);
    });

    test('should handle non-existent element', () => {
      const element = getElementSafely('nonExistentElement');
      expect(element).toBeNull();
    });
  });

  describe('showSuccessAlert', () => {
    test('should show SweetAlert when available', () => {
      showSuccessAlert('Test message');
      expect(Swal.fire).toHaveBeenCalledWith({
        title: 'Success!',
        text: 'Test message',
        icon: 'success',
        confirmButtonColor: '#2e7d32',
        timer: 2000,
        timerProgressBar: true
      });
    });
  });

  describe('showConfirmDialog', () => {
    test('should show SweetAlert confirmation when available', () => {
      showConfirmDialog('Title', 'Message', 'Confirm');
      expect(Swal.fire).toHaveBeenCalledWith({
        title: 'Title',
        text: 'Message',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2e7d32',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Confirm'
      });
    });
  });
});

describe('Form Validation Rules', () => {
  test('should have correct entry validation rules', () => {
    expect(VALIDATION_RULES.entry).toBeDefined();
    expect(VALIDATION_RULES.entry.type.required).toBe(true);
    expect(VALIDATION_RULES.entry.dateReceived.type).toBe('date');
    expect(VALIDATION_RULES.entry.subject.minLength).toBe(5);
  });

  test('should have correct user validation rules', () => {
    expect(VALIDATION_RULES.user).toBeDefined();
    expect(VALIDATION_RULES.user.email.type).toBe('email');
    expect(VALIDATION_RULES.user.firstName.minLength).toBe(2);
  });
}); 