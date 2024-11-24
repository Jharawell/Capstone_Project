let itemCounter = 1; 
let rowCounter = 1; 

function addNewItemTable() {
  const container = document.getElementById ('new-item-table-container');
  const newItemContainer = document.createElement('div');
  newItemContainer.classList.add('item-row');
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const newItem = document.createElement('div');
  newItem.classList.add('item-row');
  newItem.innerHTML = `
    <div class="item">
      <input type="checkbox" id="itemCheckbox${itemCounter}" onchange="updateStatusBar(this)">
      <span class="date">${formattedDate}</span>
      <button class="Open-button" onclick="toggleDrawer(this)">Open</button>
      <div class="status-bar-container">
        <div class="status-bar" style="width: 0%;"></div>
        <p class="status-text">0% done, 100% undone</p>
      </div>
    </div>
  `;

  const drawerTemplate = document.getElementById('drawer-template').firstElementChild.cloneNode(true);
  const inputs = drawerTemplate.querySelectorAll('.task-input');
  inputs.forEach((input, index) => {
    input.id = `row${itemCounter}.${index + 1}`; 
  });

  newItem.appendChild(drawerTemplate);
  container.appendChild(newItem);
  
  itemCounter++; 
}

function addNewRow(buttonElement) {
  const drawer = buttonElement.closest('.drawer');
  const table = drawer.querySelector('.receiving-list');
  const tbody = table.querySelector('tbody');
  const newRow = document.createElement('tr'); 

  newRow.innerHTML = `
    <td><input type="checkbox" onclick="highlightRow(this)"> </td>
    <td><input type="text" class="task-input" id="row${itemCounter}.1" placeholder="Enter Time"></td>
    <td><input type="text" class="task-input" id="row${itemCounter}.2" placeholder="Enter Date"></td>
    <td><input type="text" class="task-input" id="row${itemCounter}.3" placeholder="Enter Ctrl No."></td>
    <td><input type="text" class="task-input" id="row${itemCounter}.4" placeholder="Enter From"></td>
    <td><input type="text" class="task-input" id="row${itemCounter}.5" placeholder="Enter Office"></td>
    <td><input type="text" class="task-input" id="row${itemCounter}.6" placeholder="Enter Subject"></td>
  `;

  tbody.appendChild(newRow);
  rowCounter++; 
}

function highlightRow(checkbox) {
  const row = checkbox.closest('tr');
  
  if (checkbox.checked) {
    row.classList.add('selected');
  } else {
    row.classList.remove('selected');
  }
}

function highlightRow(checkbox) {
  const row = checkbox.closest('tr');
  
  if (checkbox.checked) {
    row.classList.add('selected');
  } else {
    row.classList.remove('selected');
  }

  const anyChecked = document.querySelectorAll('.item-row input[type="checkbox"]:checked').length > 0;
  const actionBar = document.getElementById('floatingActionBar');
  
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
  const drawer = itemRow.querySelector('.drawer');

  drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
    
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

function markAsCompleted() {
  const selectedRows = document.querySelectorAll('.item-row input[type="checkbox"]:checked');
  selectedRows.forEach(checkbox => {
    const row = checkbox.closest('.item-row');
    row.classList.add('completed'); 
    checkbox.checked = false;
  });
}

function updateStatusBar(inputElement) {
  
  const itemRow = inputElement.closest('.item-row');
  const drawer = itemRow.querySelector('.drawer');
  const taskInputs = drawer.querySelectorAll('.task-input');
  const totalInputs = taskInputs.length;
  let filledInputs = 0;

  taskInputs.forEach(input => {
      if (input.value.trim() !== "") {
          filledInputs++;
      }
  });

  const donePercentage = totalInputs > 0 ? (filledInputs / totalInputs) * 100 : 0;
  const undonePercentage = 100 - donePercentage;
  const statusBar = itemRow.querySelector('.status-bar');
  const statusText = itemRow.querySelector('.status-text');
  statusBar.style.width = `${donePercentage}%`;
  statusText.textContent = `${Math.round(donePercentage)}% done, ${Math.round(undonePercentage)}% undone`;

  if (filledInputs === totalInputs) {
      statusBar.style.width = '100%';
      statusText.textContent = '100% done, 0% undone';
  }
}



