// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCaSHRLbIRWW8COl5iwHb19dMDYYLJ2DIk",
    authDomain: "centralcomm-248a9.firebaseapp.com",
    databaseURL: "https://centralcomm-248a9-default-rtdb.firebaseio.com",
    projectId: "centralcomm-248a9",
    storageBucket: "centralcomm-248a9.firebasestorage.app",
    messagingSenderId: "796912003621",
    appId: "1:796912003621:web:0d6fd82e43399871a9edcc",
    measurementId: "G-CN0S9L5YV4",
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export the initialized firebase instance
export { firebase }; 