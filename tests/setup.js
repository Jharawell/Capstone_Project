// Test setup file for Jest

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
};

// Mock Firebase
global.firebase = {
  apps: [],
  initializeApp: jest.fn(),
  database: jest.fn(() => ({
    ref: jest.fn(() => ({
      child: jest.fn(() => ({
        once: jest.fn(() => Promise.resolve({ val: () => 0 })),
        set: jest.fn(() => Promise.resolve()),
        push: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve()),
        remove: jest.fn(() => Promise.resolve())
      })),
      push: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
      remove: jest.fn(() => Promise.resolve()),
      on: jest.fn(() => Promise.resolve()),
      off: jest.fn()
    })),
    ServerValue: {
      TIMESTAMP: 'timestamp'
    }
  }))
};

// Mock SweetAlert
global.Swal = {
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
  close: jest.fn(),
  showLoading: jest.fn(),
  update: jest.fn()
};

// Mock Bootstrap
global.bootstrap = {
  Modal: {
    getInstance: jest.fn(() => ({
      hide: jest.fn(),
      show: jest.fn()
    }))
  }
};

// Mock jQuery
global.$ = jest.fn(() => ({
  DataTable: jest.fn(() => ({
    destroy: jest.fn()
  })),
  on: jest.fn(),
  off: jest.fn()
}));

global.jQuery = global.$;

// Load our modules
require('../assets/js/firebase-config.js');
require('../assets/js/error-handler.js'); 