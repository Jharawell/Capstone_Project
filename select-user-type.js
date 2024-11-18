const userTypes = document.querySelectorAll('.user-type');

userTypes.forEach((container) => {
  container.addEventListener('click', () => {
    const selectedUserType = container.querySelector('.staff-desc').textContent;

    // Save the selected user type to local storage
    localStorage.setItem('userType', selectedUserType);

    // Redirect to specific page based on user type
    if (selectedUserType === 'Receiving Section Staff') {
      window.location.href = 'log-in_receiving.html';
    } else if (selectedUserType === 'Admin Staff') {
      window.location.href = 'log-in_admin.html';
    } else if (selectedUserType === 'Endorsed Office Staff') {
      window.location.href = 'log-in_endorsed.html';
    }
  });
});
