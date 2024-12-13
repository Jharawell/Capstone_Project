let itemCounter = 1;

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

  var db = firebase.database();
  var reviews = document.getElementById("reviews");
  var reviewsRef = db.ref("/reviews");

  rec_sec_item.addEventListener("submit", e =>{

    var time = document.getElementById("row1.1");
    var date = document.getElementById("row1.2");
    var ctrlnum = document.getElementById("row1.3");
    var from = document.getElementById("row1.4");
    var office = document.getElementById("row1.5");
    var subject = document.getElementById("row1.6");

    var id = enter_time.value || Date.now();

    db.ref("reviews/" + id).set({
      time: time.value,
      date: date.value,
      ctrlnum: ctrlnum.value,
      from: from.value,
      office: office.value,
      subject: subject.value,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });
  });
  
  reviewsRef.on("child_added", data => {
    var li = document.createElement("li");
    li.id = data.key;
    li.innerHTML = reviewTemplate(data.val());
    reviews.appendChild(li);
  })

  reviews.addEventListener("click", e => {
    updateData(e);
  });

  function updateData(e) {
    var reviewNode = e.target.parentNode;

    if (e.target.classList.contains("edit")) {
      time.value = reviewNode.querySelector(".time").innerText;
      date.value = reviewNode.querySelector(".date").innerText;
      ctrlnum.value = reviewNode.querySelector(".ctrlnum").innerText;
      from.value = reviewNode.querySelector(".from").innerText;
      office.value = reviewNode.querySelector(".office").innerText;
      subject.value = reviewNode.querySelector(".subject").innerText;

      enter_time.value = reviewNode.id;

    }

  }

  function reviewTemplate({time, date, ctrlnum, from, office, subject, createdAt}) {
    var createdAtFormatted = new Date(createdAt);

    return `
      <td><input id="chikiboxi1" type="checkbox" class="checkbox" onclick="highlightRow(this)"> </td>
      <td><input id="enter_time" type="text" class="task-input" placeholder="${time}" name="time" oninput="updateStatusBar(this)"></td>
      <td><input id="enter_date" type="text" class="task-input" placeholder="${date}" name="date" oninput="updateStatusBar(this)"></td>
      <td><input id="enter_ctrlnum" type="text" class="task-input" placeholder="${ctrlnum}" oninput="updateStatusBar(this)"></td>
      <td><input id="enter_from" type="text" class="task-input" placeholder="${from}" oninput="updateStatusBar(this)"></td>
      <td><input id="enter_Office" type="text" class="task-input" placeholder="${office}" oninput="updateStatusBar(this)"></td>
      <td><input id="enter_sub" type="text" class="task-input" placeholder="${subject}" oninput="updateStatusBar(this)"></td>
    `;
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




