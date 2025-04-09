// edit header

function enableEditing() {
    const insideText = document.getElementById('editable-text');
    const outsideText = document.getElementById('editable-text-outside');
    const input = document.getElementById('edit-input');
    
    if (insideText && outsideText) {
        const text = insideText.textContent;
        input.value = text;
        input.style.display = 'inline-block';
        insideText.style.display = 'none';
        input.focus();
    }
}

function saveText() {
    const insideText = document.getElementById('editable-text');
    const outsideText = document.getElementById('editable-text-outside');
    const input = document.getElementById('edit-input');
    
    if (insideText && outsideText && input) {
        const newText = input.value;
        insideText.textContent = newText;
        outsideText.textContent = newText;
        input.style.display = 'none';
        insideText.style.display = 'inline-block';
    }
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

// Febraury drawer
function toggleDrawerState2() {
  const drawer = document.querySelector('.drawer-container:nth-child(2) .drawer');
  const button = document.querySelector('.drawer-container:nth-child(2) .toggle-drawer-button');
  
  if (drawer.style.display === 'none') {
    drawer.style.display = 'block';
    button.textContent = 'Close';
  } else {
    drawer.style.display = 'none';
    button.textContent = 'Open';
  }
}

function enableEditing2() {
  const text = document.getElementById('editable-text2');
  const input = document.getElementById('edit-input2');
  text.style.display = 'none';
  input.style.display = 'inline-block';
  input.value = text.textContent;
  input.focus();
}

function saveText2() {
  const text = document.getElementById('editable-text2');
  const input = document.getElementById('edit-input2');
  text.textContent = input.value;
  text.style.display = 'inline-block';
  input.style.display = 'none';
}

function saveOnEnter2(event) {
  if (event.key === 'Enter') {
    saveText2();
  }
}

function editFebruaryReceiving() {
  // Add your edit functionality for the second drawer here
  console.log('Edit February Receiving ');
}

// Add initialization for the second drawer's data
function initializeSecondDrawer() {
  const dbRef = ref(db, "February"); // Using February as example, adjust as needed
  const tbody = document.getElementById('tbody2');
  let count = 0;

  onValue(dbRef, (snapshot) => {
    tbody.innerHTML = '';
    count = 0;
    
    snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val();
      addItemToTable2(tbody, data);
    });

    updateCategoryCount2(snapshot);
  });
}

function updateCategoryCount2(snapshot) {
  let complaints = 0;
  let requests = 0;
  let others = 0;

  snapshot.forEach(childSnapshot => {
    const subject = childSnapshot.val().subject?.toLowerCase() || '';
    if (subject.includes('complaint')) {
      complaints++;
    } else if (subject.includes('request')) {
      requests++;
    } else {
      others++;
    }
  });

  document.getElementById('complaints-count2').textContent = complaints;
  document.getElementById('requests-count2').textContent = requests;
  document.getElementById('others-count2').textContent = others;
}

//----March drawer---//
function toggleDrawerState3() {
  const drawer = document.querySelector('.drawer-container:nth-child(3) .drawer');
  const button = document.querySelector('.drawer-container:nth-child(3) .toggle-drawer-button');
  
  if (drawer.style.display === 'none') {
    drawer.style.display = 'block';
    button.textContent = 'Close';
  } else {
    drawer.style.display = 'none';
    button.textContent = 'Open';
  }
}

function enableEditing3() {
  const text = document.getElementById('editable-text3');
  const input = document.getElementById('edit-input3');
  text.style.display = 'none';
  input.style.display = 'inline-block';
  input.value = text.textContent;
  input.focus();
}

function saveText3() {
  const text = document.getElementById('editable-text3');
  const input = document.getElementById('edit-input3');
  text.textContent = input.value;
  text.style.display = 'inline-block';
  input.style.display = 'none';
}

function saveOnEnter3(event) {
  if (event.key === 'Enter') {
    saveText3();
  }
}

function editMarchReceiving() {
  //---Add your edit functionality for the third drawer here---///
  console.log('Edit March Receiving ');
}

//---Add initialization for the third drawer's data---//
function initializeThridDrawer() {
  const dbRef = ref(db, "March"); 
  const tbody = document.getElementById('tbody3');
  let count = 0;

  onValue(dbRef, (snapshot) => {
    tbody.innerHTML = '';
    count = 0;
    
    snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val();
      addItemToTable3(tbody, data);
    });

    updateCategoryCount3(snapshot);
  });
}

function updateCategoryCount3(snapshot) {
  let complaints = 0;
  let requests = 0;
  let others = 0;

  snapshot.forEach(childSnapshot => {
    const subject = childSnapshot.val().subject?.toLowerCase() || '';
    if (subject.includes('complaint')) {
      complaints++;
    } else if (subject.includes('request')) {
      requests++;
    } else {
      others++;
    }
  });

  document.getElementById('complaints-count3').textContent = complaints;
  document.getElementById('requests-count3').textContent = requests;
  document.getElementById('others-count3').textContent = others;
}

//----April drawer---//
function toggleDrawerState4() {
  const drawer = document.querySelector('.drawer-container:nth-child(4) .drawer');
  const button = document.querySelector('.drawer-container:nth-child(4) .toggle-drawer-button');
  
  if (drawer.style.display === 'none') {
    drawer.style.display = 'block';
    button.textContent = 'Close';
  } else {
    drawer.style.display = 'none';
    button.textContent = 'Open';
  }
}

function enableEditing4() {
  const text = document.getElementById('editable-text4');
  const input = document.getElementById('edit-input4');
  text.style.display = 'none';
  input.style.display = 'inline-block';
  input.value = text.textContent;
  input.focus();
}

function saveText4() {
  const text = document.getElementById('editable-text4');
  const input = document.getElementById('edit-input4');
  text.textContent = input.value;
  text.style.display = 'inline-block';
  input.style.display = 'none';
}

function saveOnEnter4(event) {
  if (event.key === 'Enter') {
    saveText4();
  }
}

function editAprilReceiving() {
  // Add your edit functionality for the fourth drawer here
  console.log('Edit April Receiving ');
}

// Add initialization for the Fourth drawer's data
function initializeFourthDrawer() {
  const dbRef = ref(db, "April"); 
  const tbody = document.getElementById('tbody4');
  let count = 0;

  onValue(dbRef, (snapshot) => {
    tbody.innerHTML = '';
    count = 0;
    
    snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val();
      addItemToTable4(tbody, data);
    });

    updateCategoryCount4(snapshot);
  });
}

function updateCategoryCount4(snapshot) {
  let complaints = 0;
  let requests = 0;
  let others = 0;

  snapshot.forEach(childSnapshot => {
    const subject = childSnapshot.val().subject?.toLowerCase() || '';
    if (subject.includes('complaint')) {
      complaints++;
    } else if (subject.includes('request')) {
      requests++;
    } else {
      others++;
    }
  });

  document.getElementById('complaints-count4').textContent = complaints;
  document.getElementById('requests-count4').textContent = requests;
  document.getElementById('others-count4').textContent = others;
}

//----May drawer---//
function toggleDrawerState5() {
  const drawer = document.querySelector('.drawer-container:nth-child(5) .drawer');
  const button = document.querySelector('.drawer-container:nth-child(5) .toggle-drawer-button');
  
  if (drawer.style.display === 'none') {
    drawer.style.display = 'block';
    button.textContent = 'Close';
  } else {
    drawer.style.display = 'none';
    button.textContent = 'Open';
  }
}

function enableEditing5() {
  const text = document.getElementById('editable-text5');
  const input = document.getElementById('edit-input5');
  text.style.display = 'none';
  input.style.display = 'inline-block';
  input.value = text.textContent;
  input.focus();
}

function saveText5() {
  const text = document.getElementById('editable-text5');
  const input = document.getElementById('edit-input5');
  text.textContent = input.value;
  text.style.display = 'inline-block';
  input.style.display = 'none';
}

function saveOnEnter5(event) {
  if (event.key === 'Enter') {
    saveText5();
  }
}

function editMayReceiving() {
  //---Add your edit functionality for the fifth drawer here---//
  console.log('Edit May Receiving ');
}

//---Add initialization for the fifth drawer's data---//
function initializeFifthDrawer() {
  const dbRef = ref(db, "May"); 
  const tbody = document.getElementById('tbody5');
  let count = 0;

  onValue(dbRef, (snapshot) => {
    tbody.innerHTML = '';
    count = 0;
    
    snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val();
      addItemToTable5(tbody, data);
    });

    updateCategoryCount5(snapshot);
  });
}

function updateCategoryCount5(snapshot) {
  let complaints = 0;
  let requests = 0;
  let others = 0;

  snapshot.forEach(childSnapshot => {
    const subject = childSnapshot.val().subject?.toLowerCase() || '';
    if (subject.includes('complaint')) {
      complaints++;
    } else if (subject.includes('request')) {
      requests++;
    } else {
      others++;
    }
  });

  document.getElementById('complaints-count5').textContent = complaints;
  document.getElementById('requests-count5').textContent = requests;
  document.getElementById('others-count5').textContent = others;
}

//----June drawer---//
function toggleDrawerState6() {
  const drawer = document.querySelector('.drawer-container:nth-child(6) .drawer');
  const button = document.querySelector('.drawer-container:nth-child(6) .toggle-drawer-button');
  
  if (drawer.style.display === 'none') {
    drawer.style.display = 'block';
    button.textContent = 'Close';
  } else {
    drawer.style.display = 'none';
    button.textContent = 'Open';
  }
}

function enableEditing6() {
  const text = document.getElementById('editable-text6');
  const input = document.getElementById('edit-input6');
  text.style.display = 'none';
  input.style.display = 'inline-block';
  input.value = text.textContent;
  input.focus();
}

function saveText6() {
  const text = document.getElementById('editable-text6');
  const input = document.getElementById('edit-input6');
  text.textContent = input.value;
  text.style.display = 'inline-block';
  input.style.display = 'none';
}

function saveOnEnter6(event) {
  if (event.key === 'Enter') {
    saveText6();
  }
}

function editJuneReceiving() {
  //---Add your edit functionality for the sixth drawer here---//
  console.log('Edit June Receiving ');
}

//---Add initialization for the sixth drawer's data---//
function initializeSixthDrawer() {
  const dbRef = ref(db, "June"); 
  const tbody = document.getElementById('tbody6');
  let count = 0;

  onValue(dbRef, (snapshot) => {
    tbody.innerHTML = '';
    count = 0;
    
    snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val();
      addItemToTable6(tbody, data);
    });

    updateCategoryCount6(snapshot);
  });
}

function updateCategoryCount6(snapshot) {
  let complaints = 0;
  let requests = 0;
  let others = 0;

  snapshot.forEach(childSnapshot => {
    const subject = childSnapshot.val().subject?.toLowerCase() || '';
    if (subject.includes('complaint')) {
      complaints++;
    } else if (subject.includes('request')) {
      requests++;
    } else {
      others++;
    }
  });

  document.getElementById('complaints-count6').textContent = complaints;
  document.getElementById('requests-count6').textContent = requests;
  document.getElementById('others-count6').textContent = others;
}

//----July drawer---//
function toggleDrawerState7() {
  const drawer = document.querySelector('.drawer-container:nth-child(7) .drawer');
  const button = document.querySelector('.drawer-container:nth-child(7) .toggle-drawer-button');
  
  if (drawer.style.display === 'none') {
    drawer.style.display = 'block';
    button.textContent = 'Close';
  } else {
    drawer.style.display = 'none';
    button.textContent = 'Open';
  }
}

function enableEditing7() {
  const text = document.getElementById('editable-text7');
  const input = document.getElementById('edit-input7');
  text.style.display = 'none';
  input.style.display = 'inline-block';
  input.value = text.textContent;
  input.focus();
}

function saveText7() {
  const text = document.getElementById('editable-text7');
  const input = document.getElementById('edit-input7');
  text.textContent = input.value;
  text.style.display = 'inline-block';
  input.style.display = 'none';
}

function saveOnEnter7(event) {
  if (event.key === 'Enter') {
    saveText7();
  }
}

function editJulyReceiving() {
  //---Add your edit functionality for the seventh drawer here---//
  console.log('Edit July Receiving ');
}

//---Add initialization for the seventh drawer's data---//
function initializeSeventhDrawer() {
  const dbRef = ref(db, "July"); 
  const tbody = document.getElementById('tbody7');
  let count = 0;

  onValue(dbRef, (snapshot) => {
    tbody.innerHTML = '';
    count = 0;
    
    snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val();
      addItemToTable5(tbody, data);
    });

    updateCategoryCount5(snapshot);
  });
}

function updateCategoryCount7(snapshot) {
  let complaints = 0;
  let requests = 0;
  let others = 0;

  snapshot.forEach(childSnapshot => {
    const subject = childSnapshot.val().subject?.toLowerCase() || '';
    if (subject.includes('complaint')) {
      complaints++;
    } else if (subject.includes('request')) {
      requests++;
    } else {
      others++;
    }
  });

  document.getElementById('complaints-count7').textContent = complaints;
  document.getElementById('requests-count7').textContent = requests;
  document.getElementById('others-count7').textContent = others;
}

//----August drawer---//
function toggleDrawerState8() {
  const drawer = document.querySelector('.drawer-container:nth-child(8) .drawer');
  const button = document.querySelector('.drawer-container:nth-child(8) .toggle-drawer-button');
  
  if (drawer.style.display === 'none') {
    drawer.style.display = 'block';
    button.textContent = 'Close';
  } else {
    drawer.style.display = 'none';
    button.textContent = 'Open';
  }
}

function enableEditing8() {
  const text = document.getElementById('editable-text8');
  const input = document.getElementById('edit-input8');
  text.style.display = 'none';
  input.style.display = 'inline-block';
  input.value = text.textContent;
  input.focus();
}

function saveText8() {
  const text = document.getElementById('editable-text8');
  const input = document.getElementById('edit-input8');
  text.textContent = input.value;
  text.style.display = 'inline-block';
  input.style.display = 'none';
}

function saveOnEnter8(event) {
  if (event.key === 'Enter') {
    saveText8();
  }
}

function editAugustReceiving() {
  //---Add your edit functionality for the eighth drawer here---//
  console.log('Edit August Receiving ');
}

//---Add initialization for the eighth drawer's data---//
function initializeEighthDrawer() {
  const dbRef = ref(db, "August"); 
  const tbody = document.getElementById('tbody8');
  let count = 0;

  onValue(dbRef, (snapshot) => {
    tbody.innerHTML = '';
    count = 0;
    
    snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val();
      addItemToTable8(tbody, data);
    });

    updateCategoryCount8(snapshot);
  });
}

function updateCategoryCount8(snapshot) {
  let complaints = 0;
  let requests = 0;
  let others = 0;

  snapshot.forEach(childSnapshot => {
    const subject = childSnapshot.val().subject?.toLowerCase() || '';
    if (subject.includes('complaint')) {
      complaints++;
    } else if (subject.includes('request')) {
      requests++;
    } else {
      others++;
    }
  });

  document.getElementById('complaints-count8').textContent = complaints;
  document.getElementById('requests-count8').textContent = requests;
  document.getElementById('others-count8').textContent = others;
}

//----September drawer---//
function toggleDrawerState9() {
  const drawer = document.querySelector('.drawer-container:nth-child(9) .drawer');
  const button = document.querySelector('.drawer-container:nth-child(9) .toggle-drawer-button');
  
  if (drawer.style.display === 'none') {
    drawer.style.display = 'block';
    button.textContent = 'Close';
  } else {
    drawer.style.display = 'none';
    button.textContent = 'Open';
  }
}

function enableEditing9() {
  const text = document.getElementById('editable-text9');
  const input = document.getElementById('edit-input9');
  text.style.display = 'none';
  input.style.display = 'inline-block';
  input.value = text.textContent;
  input.focus();
}

function saveText9() {
  const text = document.getElementById('editable-text9');
  const input = document.getElementById('edit-input9');
  text.textContent = input.value;
  text.style.display = 'inline-block';
  input.style.display = 'none';
}

function saveOnEnter9(event) {
  if (event.key === 'Enter') {
    saveText9();
  }
}

function editSeptemberReceiving() {
  //---Add your edit functionality for the ninth drawer here---//
  console.log('Edit September Receiving ');
}

//---Add initialization for the ninth drawer's data---//
function initializeNinthDrawer() {
  const dbRef = ref(db, "September"); 
  const tbody = document.getElementById('tbody9');
  let count = 0;

  onValue(dbRef, (snapshot) => {
    tbody.innerHTML = '';
    count = 0;
    
    snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val();
      addItemToTable9(tbody, data);
    });

    updateCategoryCount9(snapshot);
  });
}

function updateCategoryCount9(snapshot) {
  let complaints = 0;
  let requests = 0;
  let others = 0;

  snapshot.forEach(childSnapshot => {
    const subject = childSnapshot.val().subject?.toLowerCase() || '';
    if (subject.includes('complaint')) {
      complaints++;
    } else if (subject.includes('request')) {
      requests++;
    } else {
      others++;
    }
  });

  document.getElementById('complaints-count9').textContent = complaints;
  document.getElementById('requests-count9').textContent = requests;
  document.getElementById('others-count9').textContent = others;
}

//----October drawer---//
function toggleDrawerState10() {
  const drawer = document.querySelector('.drawer-container:nth-child(10) .drawer');
  const button = document.querySelector('.drawer-container:nth-child(10) .toggle-drawer-button');
  
  if (drawer.style.display === 'none') {
    drawer.style.display = 'block';
    button.textContent = 'Close';
  } else {
    drawer.style.display = 'none';
    button.textContent = 'Open';
  }
}

function enableEditing10() {
  const text = document.getElementById('editable-text10');
  const input = document.getElementById('edit-input10');
  text.style.display = 'none';
  input.style.display = 'inline-block';
  input.value = text.textContent;
  input.focus();
}

function saveText10() {
  const text = document.getElementById('editable-text10');
  const input = document.getElementById('edit-input10');
  text.textContent = input.value;
  text.style.display = 'inline-block';
  input.style.display = 'none';
}

function saveOnEnter10(event) {
  if (event.key === 'Enter') {
    saveText10();
  }
}

function editOctoberReceiving() {
  //---Add your edit functionality for the tenth drawer here---//
  console.log('Edit October Receiving ');
}

//---Add initialization for the tenth drawer's data---//
function initializeTenthDrawer() {
  const dbRef = ref(db, "October"); 
  const tbody = document.getElementById('tbody10');
  let count = 0;

  onValue(dbRef, (snapshot) => {
    tbody.innerHTML = '';
    count = 0;
    
    snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val();
      addItemToTable10(tbody, data);
    });

    updateCategoryCount10(snapshot);
  });
}

function updateCategoryCount10(snapshot) {
  let complaints = 0;
  let requests = 0;
  let others = 0;

  snapshot.forEach(childSnapshot => {
    const subject = childSnapshot.val().subject?.toLowerCase() || '';
    if (subject.includes('complaint')) {
      complaints++;
    } else if (subject.includes('request')) {
      requests++;
    } else {
      others++;
    }
  });

  document.getElementById('complaints-count10').textContent = complaints;
  document.getElementById('requests-count10').textContent = requests;
  document.getElementById('others-count10').textContent = others;
}

//----November drawer---//
function toggleDrawerState11() {
  const drawer = document.querySelector('.drawer-container:nth-child(11) .drawer');
  const button = document.querySelector('.drawer-container:nth-child(11) .toggle-drawer-button');
  
  if (drawer.style.display === 'none') {
    drawer.style.display = 'block';
    button.textContent = 'Close';
  } else {
    drawer.style.display = 'none';
    button.textContent = 'Open';
  }
}

function enableEditing11() {
  const text = document.getElementById('editable-text11');
  const input = document.getElementById('edit-input11');
  text.style.display = 'none';
  input.style.display = 'inline-block';
  input.value = text.textContent;
  input.focus();
}

function saveText11() {
  const text = document.getElementById('editable-text11');
  const input = document.getElementById('edit-input11');
  text.textContent = input.value;
  text.style.display = 'inline-block';
  input.style.display = 'none';
}

function saveOnEnter11(event) {
  if (event.key === 'Enter') {
    saveText11();
  }
}

function editNovemberReceiving() {
  //---Add your edit functionality for the eleventh drawer here---//
  console.log('Edit November Receiving ');
}

//---Add initialization for the eleventh drawer's data---//
function initializeEleventhDrawer() {
  const dbRef = ref(db, "November"); 
  const tbody = document.getElementById('tbody11');
  let count = 0;

  onValue(dbRef, (snapshot) => {
    tbody.innerHTML = '';
    count = 0;
    
    snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val();
      addItemToTable5(tbody, data);
    });

    updateCategoryCount11(snapshot);
  });
}

function updateCategoryCount11(snapshot) {
  let complaints = 0;
  let requests = 0;
  let others = 0;

  snapshot.forEach(childSnapshot => {
    const subject = childSnapshot.val().subject?.toLowerCase() || '';
    if (subject.includes('complaint')) {
      complaints++;
    } else if (subject.includes('request')) {
      requests++;
    } else {
      others++;
    }
  });

  document.getElementById('complaints-count11').textContent = complaints;
  document.getElementById('requests-count11').textContent = requests;
  document.getElementById('others-count11').textContent = others;
}

//----December drawer---//
function toggleDrawerState12() {
  const drawer = document.querySelector('.drawer-container:nth-child(12) .drawer');
  const button = document.querySelector('.drawer-container:nth-child(12) .toggle-drawer-button');
  
  if (drawer.style.display === 'none') {
    drawer.style.display = 'block';
    button.textContent = 'Close';
  } else {
    drawer.style.display = 'none';
    button.textContent = 'Open';
  }
}

function enableEditing12() {
  const text = document.getElementById('editable-text12');
  const input = document.getElementById('edit-input12');
  text.style.display = 'none';
  input.style.display = 'inline-block';
  input.value = text.textContent;
  input.focus();
}

function saveText12() {
  const text = document.getElementById('editable-text12');
  const input = document.getElementById('edit-input12');
  text.textContent = input.value;
  text.style.display = 'inline-block';
  input.style.display = 'none';
}

function saveOnEnter12(event) {
  if (event.key === 'Enter') {
    saveText12();
  }
}

function editDecemberReceiving() {
  //---Add your edit functionality for the twelfth drawer here---//
  console.log('Edit December Receiving ');
}

//---Add initialization for the twelfth drawer's data---//
function initializeTwelfthDrawer() {
  const dbRef = ref(db, "December"); 
  const tbody = document.getElementById('tbody12');
  let count = 0;

  onValue(dbRef, (snapshot) => {
    tbody.innerHTML = '';
    count = 0;
    
    snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val();
      addItemToTable12(tbody, data);
    });

    updateCategoryCount12(snapshot);
  });
}

function updateCategoryCount12(snapshot) {
  let complaints = 0;
  let requests = 0;
  let others = 0;

  snapshot.forEach(childSnapshot => {
    const subject = childSnapshot.val().subject?.toLowerCase() || '';
    if (subject.includes('complaint')) {
      complaints++;
    } else if (subject.includes('request')) {
      requests++;
    } else {
      others++;
    }
  });

  document.getElementById('complaints-count12').textContent = complaints;
  document.getElementById('requests-count12').textContent = requests;
  document.getElementById('others-count12').textContent = others;
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


//---Receiving--//
function editJanuaryReceiving() {
  window.open('receiving-january.html', '_blank');
}
function editFebruaryReceiving() {
  window.open('receiving-February.html', '_blank');
}
function editMarchReceiving() {
  window.open('receiving-March.html', '_blank');
}
function editAprilReceiving() {
  window.open('receiving-April.html', '_blank');
}
function editMayReceiving() {
  window.open('receiving-May.html', '_blank');
}
function editJuneReceiving() {
  window.open('receiving-June.html', '_blank');
}
function editJulyReceiving() {  
  window.open('receiving-Jult.html', '_blank');
}
function editAugustReceiving() {  
  window.open('receiving-August.html', '_blank');
}
function editSeptemberReceiving() {
  window.open('receiving-September.html', '_blank');
}
function editOctoberReceiving() {
  window.open('receiving-October.html', '_blank');
}
function editNovemberReceiving() {
  window.open('receiving-November.html', '_blank');
}
function editDecemberReceiving() {
  window.open('receiving-December.html', '_blank');
}


//---Admin--//
function editJanuaryAdmin() {
  window.open('Admin-January.html', '_blank');
}
function editFebruaryAdmin() {
  window.open('Admin-February.html', '_blank');
}
function editMarchAdmin() {
  window.open('Admin-March.html', '_blank');
}
function editAprilAdmin() {
  window.open('Admin-April.html', '_blank');
}
function editMayAdmin() {
  window.open('Admin-May.html', '_blank');
}
function editJuneAdmin() {
  window.open('Admin-June.html', '_blank');
}
function editJulyAdmin() {
  window.open('Admin-July.html', '_blank');
}
function editAugustAdmin() {
  window.open('Admin-August.html', '_blank');
}
function editSeptemberAdmin() {
  window.open('Admin-September.html', '_blank');
}
function editOctoberAdmin() {
  window.open('Admin-October.html', '_blank');
}
function editNovemberAdmin() {
  window.open('Admin-November.html', '_blank');
}
function editDecemberAdmin() {
  window.open('Admin-December.html', '_blank');
}


