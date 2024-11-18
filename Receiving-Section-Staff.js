let itemCounter = 1;

document.getElementById('homeButton').addEventListener('click', function(event) {
  event.preventDefault(); 
  const homeSection = document.querySelector('.home-section');
  homeSection.style.display = 'block';
});



function addNewItemTable() {
  const container = document.getElementById('new-item-table-container');

  const newItem = document.createElement('div');
  newItem.classList.add('item-row');
  newItem.innerHTML = `
    <div class="item">
      <input type="checkbox" class="checkbox" onclick="highlightRow(this)">
      <span class="date">11/11/2024</span>
      <button class="Open-button" onclick="toggleDrawer(this)">Open</button>
      <div class="status">
        <span class="status-text">Not Started</span>
        <button class="status-button" onclick="toggleStatusColor(this)">Pick Color</button>
      </div>
    </div>
  `;

  const drawer = document.createElement('div');
  drawer.classList.add('drawer');
  drawer.style.display = 'none';
  drawer.innerHTML = `
    <h4>Receiving</h4>
    <div class="receiving-list-container">
      <table class="receiving-list">
        <thead>
          <tr>
            <th> </th>
            <th>Time Received</th>
            <th>Date Received</th>
            <th>Ctrl No.</th>
            <th>From</th>
            <th>Office</th>
            <th>Subject</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox" onclick="highlightRow(this)"> </td>
            <td><input type="text" placeholder="Enter Time"></td>
            <td><input type="text" placeholder="Enter Date"></td>
            <td><input type="text" placeholder="Enter Ctrl No."></td>
            <td><input type="text" placeholder="Enter From"></td>
            <td><input type="text" placeholder="Enter Office"></td>
            <td><input type="text" placeholder="Enter Subject"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <button class="drawer_New-button" onclick="addNewRow(this)"><strong>New</strong></button>
    <button class="drawer_Undo-button" onclick="removeRow(this)"><strong>Undo</strong></button>
    <button class="drawer_Remove-button" onclick="removeRowFromDrawer(this)"><strong>Remove</strong></button>
    <button class="drawer_Save-button" onclick="removeRow(this)"><strong>Save</strong></button>
  `;

  newItem.appendChild(drawer);
  container.appendChild(newItem);
}


function highlightRow(checkbox) {
  const row = checkbox.closest('tr');
  
  if (checkbox.checked) {
    row.classList.add('selected');
  } else {
    row.classList.remove('selected');
  }

  // Check if there are any selected rows
  const anyChecked = document.querySelectorAll('.item-row input[type="checkbox"]:checked').length > 0;
  const actionBar = document.getElementById('floatingActionBar');
  
  // Show or hide the floating action bar based on checkbox selection
  if (anyChecked) {
    actionBar.style.display = 'flex';
  } else {
    actionBar.style.display = 'none';
  }
}

function deleteSelectedRows() {
  const selectedRows = document.querySelectorAll('.selected');
  selectedRows.forEach(row => {
    row.remove();
  });
}

function toggleDrawer(buttonElement) {
  const itemRow = buttonElement.closest('.item-row');
  let drawer = itemRow.querySelector('.drawer');

  if (!drawer) {
    drawer = document.createElement('div');
    drawer.classList.add('drawer');
    drawer.innerHTML = `
      <h3>Receiving</h3>
      <div class="receiving-list-container">
        <table class="receiving-list">
          <thead>
            <tr>
			  <th> </th>
              <th>#</th>
              <th>Time Received</th>
              <th>Date Received</th>
              <th>Ctrl No.</th>
              <th>From</th>
              <th>Office</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            <tr>
			  <td><input type="checkbox" onclick="highlightRow(this)"> </td>
              <td>1</td>
              <td><input type="text" placeholder="Enter Time"></td>
              <td><input type="text" placeholder="Enter Date"></td>
              <td><input type="text" placeholder="Enter Ctrl No."></td>
              <td><input type="text" placeholder="Enter From"></td>
              <td><input type="text" placeholder="Enter Office"></td>
              <td><input type="text" placeholder="Enter Subject"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="drawer_New-button" onclick="addNewRow(this)"><strong>New</strong></button>
	  <button class="drawer_Undo-button" onclick="removeRow(this)"><strong>Undo</strong></button>
	  <button class="drawer_Remove-button" onclick="deleteSelectedRows()"><strong>Remove</strong></button>
	  <button class="drawer_Save-button" onclick="removeRow(this)"><strong>Save</strong></button>
    `;
    itemRow.appendChild(drawer);
  } else {
    drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
  }

  if (drawer.style.display === 'block') {
    drawer.classList.add('open');
    buttonElement.textContent = 'Close';
    buttonElement.style.backgroundColor = 'red';
  } else {
    drawer.classList.remove('open');
    buttonElement.textContent = 'Open';
    buttonElement.style.backgroundColor = '#4CAF50'; 
  }
}

function addNewRow(buttonElement) {
  const drawer = buttonElement.closest('.drawer');
  const table = drawer.querySelector('.receiving-list');
  const tbody = table.querySelector('tbody');

  const newRow = document.createElement('tr'); 

  newRow.innerHTML = `
	<td><input type="checkbox" onclick="highlightRow(this)"> </td>
    <td><input type="text" placeholder="Enter Time"></td>
    <td><input type="text" placeholder="Enter Date"></td>
    <td><input type="text" placeholder="Enter Ctrl No."></td>
    <td><input type="text" placeholder="Enter From"></td>
    <td><input type="text" placeholder="Enter Office"></td>
    <td><input type="text" placeholder="Enter Subject"></td>
  `;
  
  tbody.appendChild(newRow);
}

function highlightRow(checkbox) {
  const row = checkbox.closest('tr');
  
  if (checkbox.checked) {
    row.classList.add('selected');
  } else {
    row.classList.remove('selected');
  }
}

function removeRowFromDrawer(button) {
  const drawer = button.closest('.drawer');
  const table = drawer.querySelector('.receiving-list');
  const selectedRows = table.querySelectorAll('tr input[type="checkbox"]:checked'); 

  selectedRows.forEach(checkbox => {
    const row = checkbox.closest('tr');
    row.remove(); 
  });
}

function toggleStatusColor(buttonElement) {
  const statusElement = buttonElement.closest('.status');
  const statusText = statusElement.querySelector('.status-text');

  const existingColorPicker = statusElement.querySelector('.color-picker');
  if (existingColorPicker) {
    existingColorPicker.remove();
    buttonElement.style.display = 'inline-block';
    return;
  }

  const colorOptions = ['red', 'yellow', 'green'];
  const colorPicker = document.createElement('div');
  colorPicker.classList.add('color-picker');

  colorOptions.forEach(color => {
    const colorOption = document.createElement('div');
    colorOption.classList.add('color-option');
    colorOption.style.backgroundColor = color;

    colorOption.onclick = function() {
      statusText.textContent = color.charAt(0).toUpperCase() + color.slice(1);
      statusElement.style.backgroundColor = color;
      buttonElement.style.display = 'inline-block';
      colorPicker.remove();
    };
    colorPicker.appendChild(colorOption);
  });

  statusElement.appendChild(colorPicker);

  const buttonRect = buttonElement.getBoundingClientRect();
  colorPicker.style.position = 'absolute';
  colorPicker.style.top = `${buttonElement.offsetHeight + 10}px`;
  colorPicker.style.left = `0px`;

  buttonElement.style.display = 'none';
}
function markAsCompleted() {
  const selectedRows = document.querySelectorAll('.item-row input[type="checkbox"]:checked');
  selectedRows.forEach(checkbox => {
    const row = checkbox.closest('.item-row');
    row.classList.add('completed'); // You can style .completed in CSS if needed
    checkbox.checked = false; // Uncheck the checkbox
  });

  // Hide the action bar after marking as completed
  document.getElementById('floatingActionBar').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const floatingActionBar = document.getElementById('floatingActionBar');

  // Monitor checkbox changes in the container
  document.getElementById('new-item-table-container').addEventListener('change', function (event) {
    if (event.target.classList.contains('checkbox')) {
      toggleFloatingActionBar();
    }
  });

  function toggleFloatingActionBar() {
    const anyChecked = document.querySelectorAll('#new-item-table-container .checkbox:checked').length > 0;
    floatingActionBar.style.display = anyChecked ? 'flex' : 'none';
  }

  window.deleteSelected = function () {
    const selected = document.querySelectorAll('#new-item-table-container .checkbox:checked');
    selected.forEach(checkbox => {
      const itemRow = checkbox.closest('.item-row');
      itemRow.remove();
    });
    toggleFloatingActionBar(); // Update visibility after deletion
  };

  window.archiveSelected = function () {
    const selected = document.querySelectorAll('#new-item-table-container .checkbox:checked');
    selected.forEach(checkbox => {
      const itemRow = checkbox.closest('.item-row');
      itemRow.style.opacity = 0.5; // Example action for archiving
      checkbox.checked = false; // Uncheck the box
    });
    toggleFloatingActionBar(); // Update visibility after archiving
  };
});


