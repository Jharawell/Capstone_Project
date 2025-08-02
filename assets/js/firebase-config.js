// Consolidated Firebase Configuration with Error Handling
class FirebaseManager {
  constructor() {
    this.config = {
      apiKey: "AIzaSyCaSHRLbIRWW8COl5iwHb19dMDYYLJ2DIk",
      authDomain: "centralcomm-248a9.firebaseapp.com",
      databaseURL: "https://centralcomm-248a9-default-rtdb.firebaseio.com",
      projectId: "centralcomm-248a9",
      storageBucket: "centralcomm-248a9.firebasestorage.app",
      messagingSenderId: "796912003621",
      appId: "1:796912003621:web:0d6fd82e43399871a9edcc",
      measurementId: "G-CN0S9L5YV4"
    };
    
    this.app = null;
    this.database = null;
    this.entriesRef = null;
    this.isInitialized = false;
  }

  initialize() {
    try {
      if (!firebase.apps.length) {
        this.app = firebase.initializeApp(this.config);
      } else {
        this.app = firebase.apps[0];
      }
      
      this.database = firebase.database();
      this.entriesRef = this.database.ref('entries');
      this.isInitialized = true;
      
      console.log('Firebase initialized successfully');
      return true;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      this.showErrorAlert('Failed to initialize database connection');
      return false;
    }
  }

  // Safe database reference getter
  getDatabase() {
    if (!this.isInitialized) {
      throw new Error('Firebase not initialized');
    }
    return this.database;
  }

  getEntriesRef() {
    if (!this.isInitialized) {
      throw new Error('Firebase not initialized');
    }
    return this.entriesRef;
  }

  // Error handling utility
  showErrorAlert(message) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonColor: '#dc3545'
      });
    } else {
      alert('Error: ' + message);
    }
  }

  // Safe Firebase operation wrapper
  async safeOperation(operation, errorMessage = 'Operation failed') {
    try {
      if (!this.isInitialized) {
        throw new Error('Database not initialized');
      }
      return await operation();
    } catch (error) {
      console.error('Firebase operation failed:', error);
      this.showErrorAlert(errorMessage);
      throw error;
    }
  }
}

// Global Firebase manager instance
const firebaseManager = new FirebaseManager();

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
  firebaseManager.initialize();
});

// Export for use in other files
window.firebaseManager = firebaseManager; 