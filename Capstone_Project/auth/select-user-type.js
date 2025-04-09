const userTypes = document.querySelectorAll('.user-type');
const continueButton = document.getElementById('continue-btn');
let selectedUserType = '';

function showCheckmark() {
  document.querySelectorAll('.checkmark').forEach(function(checkmark) {
    checkmark.style.display = 'none';
  });

  if (selectedUserType === 'Receiving Section') {
    document.getElementById('check-receiving').style.display = 'inline';
  } else if (selectedUserType === 'Admin') {
    document.getElementById('check-admin').style.display = 'inline';
  }
}

userTypes.forEach((container) => {
  container.addEventListener('click', () => {
    userTypes.forEach((type) => {
      type.classList.remove('selected');
      type.querySelector('.staff-desc').style.color = ''; // Reset text color
    });

    container.classList.add('selected');
    container.querySelector('.staff-desc').style.color = 'white';

    selectedUserType = container.querySelector('.staff-desc').textContent;

    continueButton.disabled = false;

    showCheckmark();
  });
});

continueButton.addEventListener('click', () => {
  localStorage.setItem('userType', selectedUserType);

  if (selectedUserType === 'Receiving Section') {
    window.location.href = 'log-in_receiving.html';
  } else if (selectedUserType === 'Admin') {
    window.location.href = 'log-in_admin.html';
  }
});
