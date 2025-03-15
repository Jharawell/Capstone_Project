document.addEventListener("DOMContentLoaded", function() {
//	const form = document.querySelector('.log-in-page');
//	const emailInput = document.querySelector('#user-email');
//	const passwordInput = document.querySelector('#user-password');
	
	//this is temporary just to bypass login session
	const nextPageButton = document.getElementById("nextPageButton");
	
	nextPageButton.addEventListener("click", function() {
		window.location.href = "Receiving-Section-Staff.html";
	});
	//delete until this part
	
//	form.addEventListener('submit', function(event) {
//	  event.preventDefault();
//
//	  const email = emailInput.value;
//	  const password = passwordInput.value;
//
//	  if (email === '' || password === '') {
//		alert('Please enter both email and password');
//		return;}

  
//  const userType = localStorage.getItem('userType');
//  if (userType === 'Receiving Section Staff') {
//    // Redirect to the Receiving Section Staff dashboard
//    window.location.href = 'receiving-section-staff-dashboard.html';
//  } else if (userType === 'Admin Staff') {
//    // Redirect to the Admin Staff dashboard
//    window.location.href = 'admin-staff-dashboard.html';
//  } else if (userType === 'Endorsed Office Staff') {
//    // Redirect to the Endorsed Office Staff dashboard
//    window.location.href = 'endorsed-office-staff-dashboard.html';
//  } else {
//    alert('Invalid user type');
//  }

});