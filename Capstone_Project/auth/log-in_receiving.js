// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
// import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// const firebaseConfig = {
// apiKey: "AIzaSyCaSHRLbIRWW8COl5iwHb19dMDYYLJ2DIk",
// authDomain: "centralcomm-248a9.firebaseapp.com",
// databaseURL: "https://centralcomm-248a9-default-rtdb.firebaseio.com",
// projectId: "centralcomm-248a9",
// storageBucket: "centralcomm-248a9.firebasestorage.app",
// messagingSenderId: "796912003621",
// appId: "1:796912003621:web:0d6fd82e43399871a9edcc",
// measurementId: "G-CN0S9L5YV4"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth();

// const form = document.getElementById("signupForm");

// form.addEventListener("submit", function (event) {
// event.preventDefault();

// const email = document.getElementById("email").value;
// const password = document.getElementById("password").value;

// signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//     // Signed up 
//     const user = userCredential.user;
//     alert("Account Created Successfully");
//     window.location.href = "log-in_receiving.html"; // Redirect to login page
//     })
//     .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     alert(errorMessage);
//     });
// });