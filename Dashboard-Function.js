// edit header

function enableEditing() {
  const editableText = document.getElementById('editable-text');
  const editInput = document.getElementById('edit-input');
  
  // Hide the span and show the input field
  editableText.style.display = 'none';
  editInput.style.display = 'inline-block';
  editInput.value = editableText.innerText; // Set the input field value to current text
  editInput.focus();  // Focus on the input field so the user can start typing
}

function saveText() {
  const editableText = document.getElementById('editable-text');
  const editInput = document.getElementById('edit-input');
  
  editableText.innerText = editInput.value; // Set the span text to the new input value
  editInput.style.display = 'none'; // Hide the input field
  editableText.style.display = 'inline-block'; // Show the text again
}

function saveOnEnter(event) {
  if (event.key === 'Enter') {
    saveText();
  }
}


let No = 0;
function toggleEdit() {
  const headerText = document.getElementById('header-text');
  const input = document.getElementById('edit-input');
  const buttonText = document.getElementById('button-text');

  if (buttonText.textContent === 'Edit') {
    input.value = headerText.textContent.trim();
    headerText.style.display = 'none';
    input.style.display = 'inline';
    input.focus();
    buttonText.textContent = 'Save';
  } else {
    saveHeader();
    buttonText.textContent = 'Edit';
  }
}

function saveHeader() {
  const headerText = document.getElementById('header-text');
  const input = document.getElementById('edit-input');

  if (input.value.trim() !== '') {
    headerText.textContent = input.value.trim();
  }
  headerText.style.display = 'inline';
  input.style.display = 'none';
}

function toggleDrawerState() {
  const drawer = document.querySelector('.drawer'); // Select the drawer
  const toggleButton = document.querySelector('.toggle-drawer-button'); // Select the toggle button

  if (drawer.style.display === 'none' || drawer.style.display === '') {
    drawer.style.display = 'block'; // Open the drawer
    toggleButton.textContent = 'Close'; // Update button text
  } else {
    drawer.style.display = 'none'; // Close the drawer
    toggleButton.textContent = 'Open'; // Update button text
  }
}



function addNewItemTable() {
  const drawerTemplate = document.createElement('div');
  drawerTemplate.classList.add('drawer-container');

  const drawer = document.createElement('div'); // Define the drawer here
  drawer.classList.add('drawer');
  drawer.style.display = 'none'; // Initially hidden

  const toggleButton = document.createElement('button');
  toggleButton.classList.add('toggle-drawer-button');
  toggleButton.textContent = 'Open';

  toggleButton.addEventListener('click', function () {
    toggleDrawerState(drawer); // Pass the actual drawer element
  });

  const monthHeader = document.createElement('h4');
  monthHeader.id = 'month-header';
  const headerText = document.createElement('span');
  headerText.textContent = 'January'; // Default month
  headerText.id = 'header-text';

  const editButton = document.createElement('button');
  editButton.id = 'edit-button';
  editButton.innerHTML = '<i class="edit-icon"></i><span id="button-text">Edit</span>';
  editButton.onclick = toggleEdit;

  monthHeader.appendChild(headerText);
  monthHeader.appendChild(editButton);

  const tableContainer = document.createElement('div');
  tableContainer.classList.add('receiving-list-container');
  const table = document.createElement('table');
  table.classList.add('receiving-list');
  table.style.margin = '20px auto';
  table.style.borderCollapse = 'collapse';
  table.style.width = '10%';
  table.innerHTML = `
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
    <tbody id="tbody${No}"></tbody>
  `;
  tableContainer.appendChild(table);

  const bottomButton = document.createElement('button');
  bottomButton.id = 'bottom-button';

  drawer.appendChild(monthHeader);
  drawer.appendChild(tableContainer);
  drawer.appendChild(bottomButton);

  drawerTemplate.appendChild(toggleButton);
  drawerTemplate.appendChild(drawer);

  const mainContent = document.querySelector('.main-content');
  mainContent.appendChild(drawerTemplate);

  No++;
}

function toggleDrawer() {
  const drawer = document.getElementById('drawer');
  drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
}

function editJanuaryReceiving() {
  window.open('receiving-january.html', '_blank');
}

function editJanuaryAdmin() {
  window.open('Admin-January.html', '_blank');
}
