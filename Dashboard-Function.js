let itemCounter = 1.2; 
let rowCounter = 1.1; 

const firebaseConfig = {
  apiKey: "AIzaSyCaSHRLbIRWW8COl5iwHb19dMDYYLJ2DIk",
  authDomain: "centralcomm-248a9.firebaseapp.com",
  databaseURL: "https://centralcomm-248a9-default-rtdb.firebaseio.com",
  projectId: "centralcomm-248a9",
  storageBucket: "centralcomm-248a9.firebasestorage.app",
  messagingSenderId: "796912003621",
  appId: "1:796912003621:web:0d6fd82e43399871a9edcc",
  measurementId: "G-CN0S9L5YV4"
  };

  firebase.initializeApp(firebaseConfig);

  const database = firebase.database();
  
  const db = firebase.database().ref('recSecItem');

  document.getElementById('rec_sec_item').addEventListener('submit', save);

function save(e) {
    e.preventDefault();

    const table = document.querySelector('.receiving-list tbody');
    const rows = table.querySelectorAll('tr');

    rows.forEach((row) => {
        const time = row.querySelector('input[type="time"]').value;
        const date = row.querySelector('input[type="date"]').value;
        const ctrlnum = row.querySelector('input[placeholder="Enter Ctrl No."]').value;
        const from = row.querySelector('input[placeholder="Enter From"]').value;
        const office = row.querySelector('input[list="suggestions"]').value;
        const sub = row.querySelector('input[placeholder="Enter Subject"]').value;

        // Debugging logs
        console.log("Row Data:", { time, date, ctrlnum, from, office, sub });

        // Push the data to Firebase
        saveNew(time, date, ctrlnum, from, office, sub);
    });
}

const saveNew = (time, date, ctrlnum, from, office, sub) => {
    const newItemRec = db.push();

    newItemRec
        .set({
            timeReceived: time,
            dateReceived: date,
            controlNumber: ctrlnum,
            from: from,
            office: office,
            subject: sub,
        })
        .then(() => {
            console.log("Row data saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving data:", error);
        });
};
  


const getElementVal = (id) => {
  return document.getElementById(id).value;
}

function addNewItemTable() {
  const container = document.getElementById('new-item-table-container');
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
    <td><input type="checkbox" name="checkbox" id="row${rowCounter}.1" onclick="highlightRow(this)"> </td>
    <td><input type="time" class="task-input" id="row${rowCounter}.2" name="time" oninput="updateStatusBar(this)"></td>
    <td><input type="date" class="task-input" id="row${rowCounter}.3" name="date" oninput="updateStatusBar(this)"></td>
    <td><input type="text" class="task-input" id="row${rowCounter}.4" placeholder="Enter Ctrl No."></td>
    <td><input type="text" class="task-input" id="row${rowCounter}.5" placeholder="Enter From"></td>
    <td><form>
        <input type="text" class="task-input" id="row${rowCounter}.6" list="suggestions" placeholder="Enter Office">
        <datalist id="suggestions">
          <option value="Vice Mayor's Office">
          <option value="Sangguniang Panlungsod">
          <option value="CAO">
          <option value="CASSO">
          <option value="CADMO">
          <option value="CBO">
          <option value="CEPMO">
          <option value="CHRMO">
          <option value="CLO">
          <option value="CPDSO">
          <option value="CTO">
          <option value="GSO">
          <option value="CBAO">
          <option value="CEO">
          <option value="CSWDO">
          <option value="HSO">
          <option value="LCR">
          <option value="CVAO">
          <option value="DEPED">
          <option value="COA">
          <option value="MTCC">
          <option value="RTCC">
          <option value="Prosecutor's Office">
          <option value="DILG-City">
          <option value="BCPO">
          <option value="BFP">
          <option value="BJMP">
          <option value="PESO">
          <option value="PIO">
          <option value="PLD">
          <option value="PLEB">
          <option value="POSD">
          <option value="SSD">
          <option value="PDAO">
          <option value="MITD">
          <option value="CCTV">
          <option value="CDRRMO">
          <option value="LIBRARY">
          <option value="PERSONAL STAFF">

        </datalist>
      </form>
      </td>
    <td><input type="text" class="task-input" id="row${rowCounter}.7" placeholder="Enter Subject"></td>
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




