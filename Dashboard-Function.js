let itemCounter = 1;
let adminCounter = 1;

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
  database.goOffline();
  database.goOnline();
  
  const db = firebase.database().ref('recSecItem');

  document.getElementById('rec_sec_item').addEventListener('submit', save);
  document.getElementById('rec_sec_item1').addEventListener('submit', save);
  document.getElementById('rec_sec_item2').addEventListener('submit', save);
  document.getElementById('rec_sec_item3').addEventListener('submit', save);
  document.getElementById('rec_sec_item4').addEventListener('submit', save);

  function save(e) {
    e.preventDefault(); 
  
    var time = document.getElementById(`row1.2.1`).value; 
    var date = document.getElementById(`row1.2.2`).value; 
    var ctrlnum = document.getElementById(`row1.2.3`).value; 
    var from = document.getElementById(`row1.2.4`).value; 
    var office = document.getElementById(`row1.2.5`).value; 
    var sub = document.getElementById(`row1.2.6`).value; 
  
    var time1 = document.getElementById(`row1.2.7`).value; 
    var date1 = document.getElementById(`row1.2.8`).value; // Get the last added row's date
    var ctrlnum1 = document.getElementById(`row1.2.9`).value; // Get the last added row's control number
    var from1 = document.getElementById(`row1.2.10`).value; // Get the last added row's from field
    var office1 = document.getElementById(`row1.2.11`).value; // Get the last added row's office
    var sub1 = document.getElementById(`row1.2.12`).value; // Get the last added row's subject
  
    var time2 = document.getElementById(`row1.2.13`).value; // Get the last added row's time
    var date2 = document.getElementById(`row1.2.14`).value; // Get the last added row's date
    var ctrlnum2 = document.getElementById(`row1.2.15`).value; // Get the last added row's control number
    var from2 = document.getElementById(`row1.2.16`).value; // Get the last added row's from field
    var office2 = document.getElementById(`row1.2.17`).value; // Get the last added row's office
    var sub2 = document.getElementById(`row1.2.18`).value; // Get the last added row's subject
  
    var time3 = document.getElementById(`row1.2.19`).value; // Get the last added row's time
    var date3 = document.getElementById(`row1.2.20`).value; // Get the last added row's date
    var ctrlnum3 = document.getElementById(`row1.2.21`).value; // Get the last added row's control number
    var from3 = document.getElementById(`row1.2.22`).value; // Get the last added row's from field
    var office3 = document.getElementById(`row1.2.23`).value; // Get the last added row's office
    var sub3 = document.getElementById(`row1.2.24`).value; // Get the last added row's subject
  
    var time4 = document.getElementById(`row1.2.25`).value; // Get the last added row's time
    var date4 = document.getElementById(`row1.2.26`).value; // Get the last added row's date
    var ctrlnum4 = document.getElementById(`row1.2.27`).value; // Get the last added row's control number
    var from4 = document.getElementById(`row1.2.28`).value; // Get the last added row's from field
    var office4 = document.getElementById(`row1.2.29`).value; // Get the last added row's office
    var sub4 = document.getElementById(`row1.2.30`).value; // Get the last added row's subject
  
    // Debugging logs
    console.log("Time:", time);
    console.log("Date:", date);
    console.log("Ctrl No:", ctrlnum);
    console.log("From:", from);
    console.log("Office:", office);
    console.log("Subject:", sub);
  
    saveNew(time, date, ctrlnum, from, office, sub, time1, date1, ctrlnum1, from1, office1, sub1, time2, date2, ctrlnum2, from2, office2, sub2, time3, date3, ctrlnum3, from3, office3, sub3, time4, date4, ctrlnum4, from4, office4, sub4);
  }
  
const saveNew = (time, date, ctrlnum, from, office, sub, time1, date1, ctrlnum1, from1, office1, sub1, time2, date2, ctrlnum2, from2, office2, sub2, time3, date3, ctrlnum3, from3, office3, sub3, time4, date4, ctrlnum4, from4, office4, sub4) => {
  var newItemRec = db.push(); 

  newItemRec.set({
    timeReceived: time,
    dateReceived: date,
    controlNumber: ctrlnum,
    from: from,
    office: office,
    subject: sub,

    timeReceived1: time1,
    dateReceived1: date1,
    controlNumber1: ctrlnum1,
    from1: from1,
    office1: office1,
    subject1: sub1,

    timeReceived2: time2,
    dateReceived2: date2,
    controlNumber2: ctrlnum2,
    from2: from2,
    office2: office2,
    subject2: sub2,

    timeReceived3: time3,
    dateReceived3: date3,
    controlNumber3: ctrlnum3,
    from3: from3,
    office3: office3,
    subject3: sub3,

    timeReceived4: time4,
    dateReceived4: date4,
    controlNumber4: ctrlnum4,
    from4: from4,
    office4: office4,
    subject4: sub4,
  })
  .then(() => {
    console.log("Data saved successfully!");
  })
  .catch((error) => {
    console.error("Error saving data:", error);
  });
  const retrieveData = () => {
    db.on('value', (snapshot) => {
      const data = snapshot.val();

      // Populate the input fields with retrieved data
      if (data) {
        document.getElementById('row1.2.1').value = data.timeReceived;
        document.getElementById('row1.2.2').value = data.dateReceived;
        document.getElementById('row1.2.3').value = data.controlNumber;
        document.getElementById('row1.2.4').value = data.from;
        document.getElementById('row1.2.5').value = data.office;
        document.getElementById('row1.2.6').value = data.subject;

        document.getElementById('row1.2.7').value = data.timeReceived1;
        document.getElementById('row1.2.8').value = data.dateReceived1;
        document.getElementById('row1.2.9').value = data.controlNumber1;
        document.getElementById('row1.2.10').value = data.from1;
        document.getElementById('row1.2.11').value = data.office1;
        document.getElementById('row1.2.12').value = data.subject1;

        document.getElementById('row1.2.13').value = data.timeReceived2;
        document.getElementById('row1.2.14').value = data.dateReceived2;
        document.getElementById('row1.2.15').value = data.controlNumber2;
        document.getElementById('row1.2.16').value = data.from2;
        document.getElementById('row1.2.17').value = data.office2;
        document.getElementById('row1.2.18').value = data.subject2;

        document.getElementById('row1.2.19').value = data.timeReceived3;
        document.getElementById('row1.2.20').value = data.dateReceived3;
        document.getElementById('row1.2.21').value = data.controlNumber3;
        document.getElementById('row1.2.22').value = data.from3;
        document.getElementById('row1.2.23').value = data.office3;
        document.getElementById('row1.2.24').value = data.subject3;

        document.getElementById('row1.2.25').value = data.timeReceived4;
        document.getElementById('row1.2.26').value = data.dateReceived4;
        document.getElementById('row1.2.27').value = data.controlNumber4;
        document.getElementById('row1.2.28').value = data.from4;
        document.getElementById('row1.2.29').value = data.office4;
        document.getElementById('row1.2.30').value = data.subject4;
        Object.keys(data).forEach(key => {
          const item = data[key];
              document.getElementById('row1.2.1').value = item.timeReceived || '';
              document.getElementById('row1.2.2').value = item.dateReceived || '';
              document.getElementById('row1.2.3').value = item.controlNumber || '';
              document.getElementById('row1.2.4').value = item.from || '';
              document.getElementById('row1.2.5').value = item.office || '';
              document.getElementById('row1.2.6').value = item.subject || '';
        });
      }
    });
    window.onload = () => {
      retrieveData();
    };
  }};
  
  
  const getElementVal = (id) => {
    return document.getElementById(id).value;
  };


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
      <input type="checkbox" id="itemCheckbox${itemCounter}" class="checkbox" onchange="updateStatusBar(this)">
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
  const checkbox = drawerTemplate.querySelectorAll('.checkbox');
  inputs.forEach((input, index) => {
    input.id = `row${itemCounter}.${index + 1}`; 
  });
  checkbox.forEach((checkbox, index) =>{
    checkbox.id = `checkbox${itemCounter}.${index + 1}`;
  });

  newItem.appendChild(drawerTemplate);
  container.appendChild(newItem);

  itemCounter++;
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




