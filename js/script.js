// Enhanced Main Script with Comprehensive Error Handling

// Wait for Firebase to be initialized
document.addEventListener('DOMContentLoaded', function() {
  if (!firebaseManager.isInitialized) {
    console.error('Firebase not initialized');
    return;
  }
  
  initializeApplication();
});

function initializeApplication() {
  try {
    // Initialize all event listeners with error handling
    initializeEventListeners();
    
    // Load initial data
    loadEntries();
    
    // Check for archiving
    checkAndArchiveEntries();
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Application initialization failed:', error);
    ErrorHandler.safeDOMOperation(() => {
      firebaseManager.showErrorAlert('Failed to initialize application');
    });
  }
}

// Enhanced control number generation with error handling
function generateControlNumber(date) {
  return ErrorHandler.safeFirebaseOperation(async () => {
    if (!ErrorHandler.isValidDate(date)) {
      throw new Error('Invalid date provided');
    }

    const d = new Date(date);
    const year = String(d.getFullYear()).slice(-2);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateKey = `${year}${day}${month}`;
    
    const database = firebaseManager.getDatabase();
    const snapshot = await database.ref('controlNumbers').child(dateKey).once('value');
    let count = snapshot.val() || 0;
    count++;
    
    await database.ref('controlNumbers').child(dateKey).set(count);
    
    const controlNumber = `${dateKey}-${count}/100`;
    
    await database.ref('generatedControlNumbers').push({
      controlNumber: controlNumber,
      date: date,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    
    return controlNumber;
  }, 'Failed to generate control number');
}

// Enhanced preview control number function
function previewNextControlNumber(date) {
  return ErrorHandler.safeFirebaseOperation(async () => {
    if (!ErrorHandler.isValidDate(date)) {
      throw new Error('Invalid date provided');
    }

    const d = new Date(date);
    const year = String(d.getFullYear()).slice(-2);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateKey = `${year}${day}${month}`;
    
    const database = firebaseManager.getDatabase();
    const snapshot = await database.ref('controlNumbers').child(dateKey).once('value');
    let count = snapshot.val() || 0;
    
    return `${dateKey}-${count + 1}/100`;
  }, 'Failed to preview control number');
}

// Enhanced form submission with validation
function handleFormSubmission(formData, formType = 'entry') {
  return ErrorHandler.safeFirebaseOperation(async () => {
    // Sanitize input data
    const sanitizedData = {};
    for (const [key, value] of Object.entries(formData)) {
      sanitizedData[key] = ErrorHandler.sanitizeInput(value);
    }
    
    // Validate form data
    const rules = VALIDATION_RULES[formType];
    if (rules) {
      const errors = ErrorHandler.validateInput(sanitizedData, rules);
      if (errors.length > 0) {
        throw new Error('Validation failed: ' + errors.join(', '));
      }
    }
    
    // Generate control number if needed
    if (formType === 'entry' && !sanitizedData.controlNumber) {
      sanitizedData.controlNumber = await generateControlNumber(sanitizedData.dateReceived);
    }
    
    // Add timestamps
    sanitizedData.createdAt = firebase.database.ServerValue.TIMESTAMP;
    
    // Save to database
    const entriesRef = firebaseManager.getEntriesRef();
    const result = await entriesRef.push(sanitizedData);
    
    // Log activity
    await logActivity('create', `Created new ${formType}: ${sanitizedData.subject || sanitizedData.firstName}`, sanitizedData.controlNumber);
    
    return result;
  }, 'Failed to save data');
}

// Enhanced event listener initialization
function initializeEventListeners() {
  const eventConfigs = [
    { id: 'saveEntry', event: 'click', handler: handleSaveEntry },
    { id: 'updateEntry', event: 'click', handler: handleUpdateEntry },
    { id: 'searchForm', event: 'submit', handler: handleSearch },
    { id: 'profileForm', event: 'submit', handler: handleProfileUpdate },
    { id: 'passwordForm', event: 'submit', handler: handlePasswordChange },
    { id: 'archiveAllBtn', event: 'click', handler: archiveAllEntries }
  ];
  
  eventConfigs.forEach(config => {
    const element = getElementSafely(config.id);
    if (element) {
      element.addEventListener(config.event, config.handler);
    }
  });

  // Navigation event listeners
  const navigationConfigs = [
    { id: 'dashboardLink', section: 'dashboardSection' },
    { id: 'documentsLink', section: 'documentsSection' },
    { id: 'usersLink', section: 'usersSection' },
    { id: 'archivesLink', section: 'archivesSection' },
    { id: 'historyLink', section: 'historySection' },
    { id: 'profileLink', section: 'profileSection' }
  ];

  navigationConfigs.forEach(config => {
    const element = getElementSafely(config.id);
    if (element) {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavigation(config.section);
      });
    }
  });
}

// Enhanced save entry handler
async function handleSaveEntry(event) {
  event.preventDefault();
  
  try {
    // Rate limiting
    ErrorHandler.rateLimit('saveEntry', 5, 60000);
    
    const formData = {
      type: getElementSafely('letterType').value,
      dateReceived: getElementSafely('dateReceived').value,
      timeReceived: getElementSafely('timeReceived').value,
      from: getElementSafely('from').value,
      office: getElementSafely('office').value,
      subject: getElementSafely('subject').value,
      endorsedTo: getElementSafely('endorsedTo').value,
      remarks: getElementSafely('remarks').value,
      status: getElementSafely('status').value
    };
    
    await handleFormSubmission(formData, 'entry');
    
    // Reset form and show success
    getElementSafely('createEntryForm').reset();
    showSuccessAlert('Entry created successfully!');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(getElementSafely('createEntryModal'));
    if (modal) modal.hide();
    
    // Reload data
    loadEntries();
    
  } catch (error) {
    console.error('Save entry failed:', error);
    firebaseManager.showErrorAlert('Failed to save entry: ' + error.message);
  }
}

// Enhanced update entry handler
async function handleUpdateEntry(event) {
  event.preventDefault();
  
  try {
    const key = getElementSafely('editEntryForm').dataset.key;
    if (!key) {
      throw new Error('No entry selected for update');
    }
    
    const formData = {
      type: getElementSafely('editType').value,
      controlNumber: getElementSafely('editControlNumber').value,
      dateReceived: getElementSafely('editDateReceived').value,
      timeReceived: getElementSafely('editTimeReceived').value,
      from: getElementSafely('editFrom').value,
      office: getElementSafely('editOffice').value,
      subject: getElementSafely('editSubject').value,
      endorsedTo: getElementSafely('editEndorsedTo').value,
      remarks: getElementSafely('editRemarks').value,
      status: getElementSafely('editStatus').value,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    };
    
    // Validate control number
    if (!ErrorHandler.validateControlNumber(formData.controlNumber)) {
      throw new Error('Invalid control number format');
    }
    
    await ErrorHandler.safeFirebaseOperation(async () => {
      const entriesRef = firebaseManager.getEntriesRef();
      await entriesRef.child(key).update(formData);
      
      await logActivity('update', `Updated entry: ${formData.subject}`, formData.controlNumber);
    }, 'Failed to update entry');
    
    showSuccessAlert('Entry updated successfully!');
    
    // Close modal and reload
    const modal = bootstrap.Modal.getInstance(getElementSafely('editEntryModal'));
    if (modal) modal.hide();
    
    loadEntries();
    
  } catch (error) {
    console.error('Update entry failed:', error);
    firebaseManager.showErrorAlert('Failed to update entry: ' + error.message);
  }
}

// Enhanced data loading with error handling
function loadEntries() {
  ErrorHandler.safeFirebaseOperation(async () => {
    const entriesRef = firebaseManager.getEntriesRef();
    const snapshot = await entriesRef.once('value');
    const entries = snapshot.val();
    
    if (!entries) {
      console.log('No entries found');
      updateEntriesUI([]);
      return;
    }
    
    // Process entries with error handling
    const processedEntries = Object.entries(entries).map(([key, entry]) => {
      try {
        return {
          key,
          ...entry,
          formattedDate: formatDate(entry.dateReceived)
        };
      } catch (error) {
        console.error('Error processing entry:', error);
        return null;
      }
    }).filter(entry => entry !== null);
    
    // Update UI
    updateEntriesUI(processedEntries);
    
  }, 'Failed to load entries');
}

// Enhanced UI update function
function updateEntriesUI(entries) {
  ErrorHandler.safeDOMOperation(() => {
    const container = getElementSafely('monthlyStatsAccordion');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    if (entries.length === 0) {
      container.innerHTML = '<div class="text-center text-muted p-4">No entries found</div>';
      return;
    }
    
    // Group entries by month
    const entriesByMonth = groupEntriesByMonth(entries);
    
    // Create UI for each month
    Object.entries(entriesByMonth).forEach(([month, monthEntries]) => {
      const monthElement = createMonthElement(month, monthEntries);
      container.appendChild(monthElement);
    });
    
  }, 'monthlyStatsAccordion');
}

// Utility functions
function groupEntriesByMonth(entries) {
  const groups = {};
  
  entries.forEach(entry => {
    try {
      const date = new Date(entry.dateReceived);
      const monthKey = date.toLocaleString('default', { month: 'long' }) + date.getFullYear();
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(entry);
    } catch (error) {
      console.error('Error grouping entry:', error);
    }
  });
  
  return groups;
}

function createMonthElement(month, entries) {
  const element = document.createElement('div');
  element.className = 'accordion-item border-0 mb-2';
  
  // Calculate statistics
  const stats = calculateStats(entries);
  
  element.innerHTML = `
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${month.toLowerCase()}">
        <div class="d-flex justify-content-between align-items-center w-100">
          <div>
            <span class="fw-bold">${month}</span>
            <span class="badge bg-success ms-2">${entries.length} entries</span>
          </div>
        </div>
      </button>
    </h2>
    <div id="${month.toLowerCase()}" class="accordion-collapse collapse">
      <div class="accordion-body">
        ${createEntriesTable(entries)}
      </div>
    </div>
  `;
  
  return element;
}

function calculateStats(entries) {
  return {
    complaints: entries.filter(e => e.type === 'Complaint').length,
    proposals: entries.filter(e => e.type === 'Proposal').length,
    invitations: entries.filter(e => e.type === 'Invitation').length,
    requests: entries.filter(e => e.type === 'Request').length
  };
}

function createEntriesTable(entries) {
  if (entries.length === 0) {
    return '<p class="text-muted text-center">No entries for this month</p>';
  }
  
  const rows = entries.map(entry => `
    <tr>
      <td>${entry.controlNumber || 'N/A'}</td>
      <td>${entry.type || 'N/A'}</td>
      <td>${entry.timeReceived || 'N/A'}</td>
      <td>${entry.formattedDate || 'N/A'}</td>
      <td>${entry.from || 'N/A'}</td>
      <td>${entry.office || 'N/A'}</td>
      <td>${entry.subject || 'N/A'}</td>
      <td>${entry.endorsedTo || 'N/A'}</td>
      <td>${entry.remarks || ''}</td>
      <td><span class="badge bg-${getStatusColor(entry.status)}">${entry.status || 'Pending'}</span></td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editEntry('${entry.key}')">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteEntry('${entry.key}')">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
  
  return `
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Control #</th>
            <th>Type</th>
            <th>Time Received</th>
            <th>Date Received</th>
            <th>From</th>
            <th>Office</th>
            <th>Subject</th>
            <th>Endorsed To</th>
            <th>Remarks</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

// Enhanced utility functions
function formatDate(dateString) {
  try {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

function getStatusColor(status) {
  const statusColors = {
    'Pending': 'warning',
    'Processing': 'info',
    'Completed': 'success',
    'Archived': 'secondary'
  };
  return statusColors[status] || 'primary';
}

// Enhanced activity logging
async function logActivity(action, details, controlNumber) {
  try {
    const logData = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: 'Admin', // TODO: Replace with actual user when authentication is implemented
      action: action,
      details: details,
      controlNumber: controlNumber,
      ipAddress: '127.0.0.1', // TODO: Replace with actual IP when available
      userAgent: navigator.userAgent
    };

    const database = firebaseManager.getDatabase();
    await database.ref('logs').push(logData);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

// Function to show success alert
function showSuccessAlert(message) {
  Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    confirmButtonColor: '#2e7d32',
    timer: 2000,
    timerProgressBar: true
  });
}

// Function to show error alert
function showErrorAlert(message) {
  Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonColor: '#dc3545'
  });
}

// Function to show confirmation dialog
function showConfirmDialog(title, text, confirmButtonText) {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2e7d32',
    cancelButtonColor: '#dc3545',
    confirmButtonText: confirmButtonText
  });
}

// Update delete entry function
function deleteEntry(key) {
  showConfirmDialog('Are you sure?', 'You won\'t be able to revert this!', 'Yes, delete it!')
    .then((result) => {
      if (result.isConfirmed) {
        entriesRef.child(key).once('value', (snapshot) => {
          const entry = snapshot.val();
          entriesRef.child(key).remove()
            .then(() => {
              logActivity('delete', `Deleted entry: ${entry.subject}`, entry.controlNumber);
              showSuccessAlert('Entry deleted successfully!');
            })
            .catch((error) => {
              console.error('Error deleting entry:', error);
              showErrorAlert('Error deleting entry. Please try again.');
            });
        });
      }
    });
}

// Function to archive all entries
function archiveAllEntries() {
  showConfirmDialog('Archive All Entries', 'Are you sure you want to archive all entries? This action cannot be undone.', 'Yes, archive all!')
    .then((result) => {
      if (result.isConfirmed) {
        // Show initial loading state
        Swal.fire({
          title: 'Preparing to Archive',
          text: 'Please wait while we prepare to archive entries...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        entriesRef.once('value', (snapshot) => {
          const entries = snapshot.val();
          if (entries) {
            let archivedCount = 0;
            let totalToArchive = 0;
            
            // First count how many entries need to be archived
            Object.entries(entries).forEach(([_, entry]) => {
              if (entry.status !== 'Archived') {
                totalToArchive++;
              }
            });

            if (totalToArchive === 0) {
              Swal.fire({
                title: 'No Entries to Archive',
                text: 'There are no entries available to archive.',
                icon: 'info',
                confirmButtonColor: '#2e7d32'
              });
              return;
            }

            // Update loading message
            Swal.update({
              title: 'Archiving Entries',
              html: `Archiving ${totalToArchive} entries...<br><br>
                    <div class="progress" style="height: 20px;">
                      <div class="progress-bar progress-bar-striped progress-bar-animated" 
                           role="progressbar" 
                           style="width: 0%" 
                           id="archiveProgress">
                        0%
                      </div>
                    </div>`
            });

            // Archive each entry
            Object.entries(entries).forEach(([key, entry]) => {
              if (entry.status !== 'Archived') {
                entriesRef.child(key).update({
                  status: 'Archived',
                  archivedAt: firebase.database.ServerValue.TIMESTAMP
                })
                .then(() => {
                  archivedCount++;
                  logActivity('archive', `Archived entry: ${entry.subject}`, entry.controlNumber);
                  
                  // Update progress bar
                  const progress = Math.round((archivedCount / totalToArchive) * 100);
                  document.getElementById('archiveProgress').style.width = `${progress}%`;
                  document.getElementById('archiveProgress').textContent = `${progress}%`;
                  
                  // Update progress
                  if (archivedCount === totalToArchive) {
                    Swal.fire({
                      title: 'Success!',
                      text: `Successfully archived ${archivedCount} entries!`,
                      icon: 'success',
                      confirmButtonColor: '#2e7d32'
                    }).then(() => {
                      loadEntries();
                    });
                  }
                })
                .catch((error) => {
                  console.error('Error archiving entry:', error);
                  Swal.fire({
                    title: 'Error!',
                    text: 'Error archiving entries. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#dc3545'
                  });
                });
              }
            });
          } else {
            Swal.fire({
              title: 'No Entries Found',
              text: 'There are no entries in the database.',
              icon: 'info',
              confirmButtonColor: '#2e7d32'
            });
          }
        }).catch((error) => {
          console.error('Error preparing to archive:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Error preparing to archive entries. Please try again.',
            icon: 'error',
            confirmButtonColor: '#dc3545'
          });
        });
      }
    });
}

// Update restore entry function
function restoreEntry(key) {
  showConfirmDialog('Restore Entry', 'Are you sure you want to restore this entry?', 'Yes, restore it!')
    .then((result) => {
      if (result.isConfirmed) {
        entriesRef.child(key).update({
          status: 'Pending',
          restoredAt: firebase.database.ServerValue.TIMESTAMP
        })
        .then(() => {
          logActivity('restore', `Restored archived entry: ${key}`, key);
          showSuccessAlert('Entry restored successfully!');
          loadArchivedEntries();
        })
        .catch((error) => {
          console.error('Error restoring entry:', error);
          showErrorAlert('Error restoring entry. Please try again.');
        });
      }
    });
}

// Update create entry handler to handle async control number generation
document.getElementById('saveEntry').addEventListener('click', function() {
  const formData = {
    type: document.getElementById('letterType').value,
    dateReceived: document.getElementById('dateReceived').value,
    timeReceived: document.getElementById('timeReceived').value,
    from: document.getElementById('from').value,
    office: document.getElementById('office').value,
    subject: document.getElementById('subject').value,
    endorsedTo: document.getElementById('endorsedTo').value,
    remarks: document.getElementById('remarks').value,
    status: document.getElementById('status').value,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  };

  // Generate and save control number
  generateControlNumber(formData.dateReceived)
    .then((controlNumber) => {
      formData.controlNumber = controlNumber;
      
      // Save the entry
      return entriesRef.push(formData);
    })
    .then(() => {
      logActivity('create', `Created new entry: ${formData.subject}`, formData.controlNumber);
      
      document.getElementById('createEntryForm').reset();
      
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);
      document.getElementById('dateReceived').value = currentDate;
      document.getElementById('timeReceived').value = currentTime;
      
      showSuccessAlert('Entry created successfully!');
      const modal = bootstrap.Modal.getInstance(document.getElementById('createEntryModal'));
      modal.hide();

      const currentMonth = now.toLocaleString('default', { month: 'long' }).toLowerCase() + now.getFullYear();
      loadEntries();
      setTimeout(() => {
        const accordionButton = document.querySelector(`button[data-bs-target="#${currentMonth}"]`);
        if (accordionButton) {
          accordionButton.click();
        }
      }, 500);
    })
    .catch((error) => {
      console.error('Error creating entry:', error);
      showErrorAlert('Error creating entry. Please try again.');
    });
});

// Update edit entry handler
document.getElementById('updateEntry').addEventListener('click', function() {
  const key = document.getElementById('editEntryForm').dataset.key;
  const formData = {
    type: document.getElementById('editType').value,
    controlNumber: document.getElementById('editControlNumber').value,
    dateReceived: document.getElementById('editDateReceived').value,
    timeReceived: document.getElementById('editTimeReceived').value,
    from: document.getElementById('editFrom').value,
    office: document.getElementById('editOffice').value,
    subject: document.getElementById('editSubject').value,
    endorsedTo: document.getElementById('editEndorsedTo').value,
    remarks: document.getElementById('editRemarks').value,
    status: document.getElementById('editStatus').value,
    updatedAt: firebase.database.ServerValue.TIMESTAMP
  };

  entriesRef.child(key).update(formData)
    .then(() => {
      logActivity('update', `Updated entry: ${formData.subject}`, formData.controlNumber);
      
      showSuccessAlert('Entry updated successfully!');
      const modal = bootstrap.Modal.getInstance(document.getElementById('editEntryModal'));
      modal.hide();

      const entryDate = new Date(formData.dateReceived);
      const monthKey = entryDate.toLocaleString('default', { month: 'long' }).toLowerCase() + entryDate.getFullYear();
      loadEntries();
      setTimeout(() => {
        const accordionButton = document.querySelector(`button[data-bs-target="#${monthKey}"]`);
        if (accordionButton) {
          accordionButton.click();
        }
      }, 500);
    })
    .catch((error) => {
      console.error('Error updating entry:', error);
      showErrorAlert('Error updating entry. Please try again.');
    });
});

// Update profile form submission
document.getElementById('profileForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const profileData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    department: document.getElementById('department').value,
    position: document.getElementById('position').value,
    updatedAt: firebase.database.ServerValue.TIMESTAMP
  };

  database.ref('users/admin').update(profileData)
    .then(() => {
      showSuccessAlert('Profile updated successfully!');
      logActivity('profile_update', 'Updated profile information', 'admin');
    })
    .catch((error) => {
      console.error('Error updating profile:', error);
      showErrorAlert('Error updating profile. Please try again.');
    });
});

// Update password change form submission
document.getElementById('passwordForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    showErrorAlert('New passwords do not match!');
    return;
  }

  showSuccessAlert('Password updated successfully!');
  logActivity('password_change', 'Changed password', 'admin');
  document.getElementById('passwordForm').reset();
});

// Update profile image upload
document.getElementById('profileImageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    showSuccessAlert('Profile image updated successfully!');
    logActivity('profile_image', 'Updated profile image', 'admin');
  }
});

// Edit entry function
function editEntry(key) {
  entriesRef.child(key).once('value', (snapshot) => {
    const entry = snapshot.val();
    if (entry) {
      document.getElementById('editType').value = entry.type;
      document.getElementById('editControlNumber').value = entry.controlNumber;
      document.getElementById('editDateReceived').value = entry.dateReceived;
      document.getElementById('editTimeReceived').value = entry.timeReceived;
      document.getElementById('editFrom').value = entry.from;
      document.getElementById('editOffice').value = entry.office;
      document.getElementById('editSubject').value = entry.subject;
      document.getElementById('editEndorsedTo').value = entry.endorsedTo;
      document.getElementById('editRemarks').value = entry.remarks || '';
      document.getElementById('editStatus').value = entry.status;

      // Store the key for updating
      document.getElementById('editEntryForm').dataset.key = key;
    }
  });
}

// Update control number when date changes in create form
document.getElementById('dateReceived').addEventListener('change', function() {
  previewNextControlNumber(this.value)
    .then((controlNumber) => {
      document.getElementById('controlNumber').value = controlNumber;
    })
    .catch((error) => {
      console.error('Error previewing control number:', error);
      showErrorAlert('Error previewing control number. Please try again.');
    });
});

// Update control number when date changes in edit form
document.getElementById('editDateReceived').addEventListener('change', function() {
  generateControlNumber(this.value)
    .then((controlNumber) => {
      document.getElementById('editControlNumber').value = controlNumber;
    })
    .catch((error) => {
      console.error('Error generating control number:', error);
      showErrorAlert('Error generating control number. Please try again.');
    });
});

// Set current time and preview control number when modal opens
document.getElementById('createEntryModal').addEventListener('show.bs.modal', function() {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);
  
  document.getElementById('dateReceived').value = currentDate;
  document.getElementById('timeReceived').value = currentTime;
  
  // Preview control number
  previewNextControlNumber(currentDate)
    .then((controlNumber) => {
      document.getElementById('controlNumber').value = controlNumber;
    })
    .catch((error) => {
      console.error('Error previewing control number:', error);
      showErrorAlert('Error previewing control number. Please try again.');
    });
});

// Load entries and check for archiving when page loads
document.addEventListener('DOMContentLoaded', function() {
  checkAndArchiveEntries();
  handleNavigation('dashboardSection');
});

// Add event listener for the Archive All button
document.addEventListener('DOMContentLoaded', function() {
  const archiveAllBtn = document.getElementById('archiveAllBtn');
  if (archiveAllBtn) {
    archiveAllBtn.addEventListener('click', archiveAllEntries);
  }
});

// Function to handle navigation
function handleNavigation(sectionId) {
  // Hide all sections
  document.querySelectorAll('.main-content > div').forEach(section => {
    section.classList.add('d-none');
  });
  
  // Show selected section
  document.getElementById(sectionId).classList.remove('d-none');
  
  // Update active state in sidebar
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`#${sectionId.replace('Section', 'Link')}`).classList.add('active');
  
  // Load section-specific data
  switch(sectionId) {
    case 'documentsSection':
      loadDocuments();
      break;
    case 'usersSection':
      loadUsers();
      break;
    case 'archivesSection':
      loadArchivedEntries();
      break;
    case 'historySection':
      loadHistory();
      break;
    case 'profileSection':
      loadProfile();
      break;
    default:
      loadEntries();
  }
}

// Add event listeners for navigation
document.getElementById('dashboardLink').addEventListener('click', function(e) {
  e.preventDefault();
  handleNavigation('dashboardSection');
});

document.getElementById('documentsLink').addEventListener('click', function(e) {
  e.preventDefault();
  handleNavigation('documentsSection');
});

document.getElementById('usersLink').addEventListener('click', function(e) {
  e.preventDefault();
  handleNavigation('usersSection');
});

document.getElementById('archivesLink').addEventListener('click', function(e) {
  e.preventDefault();
  handleNavigation('archivesSection');
});

document.getElementById('historyLink').addEventListener('click', function(e) {
  e.preventDefault();
  handleNavigation('historySection');
});

document.getElementById('profileLink').addEventListener('click', function(e) {
  e.preventDefault();
  handleNavigation('profileSection');
});

// Function to load archived entries
function loadArchivedEntries() {
  // Show loading state
  Swal.fire({
    title: 'Loading Archived Entries',
    text: 'Please wait...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  entriesRef.once('value', (snapshot) => {
    const entries = snapshot.val();
    const archivedYearsContainer = document.getElementById('archivedYearsContainer');
    archivedYearsContainer.innerHTML = '';

    if (entries) {
      // Group entries by year
      const entriesByYear = {};
      Object.entries(entries).forEach(([key, entry]) => {
        if (entry.status === 'Archived') {
          const year = new Date(entry.dateReceived).getFullYear();
          if (!entriesByYear[year]) {
            entriesByYear[year] = [];
          }
          entriesByYear[year].push({ key, ...entry });
        }
      });

      // Sort years in descending order
      const years = Object.keys(entriesByYear).sort((a, b) => b - a);

      // Create accordion for each year
      years.forEach(year => {
        const yearEntries = entriesByYear[year];
        const yearAccordion = document.createElement('div');
        yearAccordion.className = 'col-12 mb-4';
        yearAccordion.innerHTML = `
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">${year}</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover archived-entries-table" id="archivedTable${year}">
                  <thead>
                    <tr>
                      <th>Control #</th>
                      <th>Type</th>
                      <th>Time Received</th>
                      <th>Date Received</th>
                      <th>From</th>
                      <th>Office</th>
                      <th>Subject</th>
                      <th>Endorsed To</th>
                      <th>Remarks</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${yearEntries.map(entry => `
                      <tr>
                        <td>${entry.controlNumber}</td>
                        <td>${entry.type}</td>
                        <td>${entry.timeReceived}</td>
                        <td>${formatDate(entry.dateReceived)}</td>
                        <td>${entry.from}</td>
                        <td>${entry.office}</td>
                        <td>${entry.subject}</td>
                        <td>${entry.endorsedTo}</td>
                        <td>${entry.remarks || ''}</td>
                        <td><span class="badge bg-secondary">Archived</span></td>
                        <td>
                          <button class="btn btn-sm btn-info" onclick="viewArchivedEntry('${entry.key}')">
                            <i class="bi bi-eye"></i>
                          </button>
                          <button class="btn btn-sm btn-warning" onclick="restoreEntry('${entry.key}')">
                            <i class="bi bi-arrow-counterclockwise"></i>
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;
        archivedYearsContainer.appendChild(yearAccordion);

        // Initialize DataTable for this year's entries
        $(`#archivedTable${year}`).DataTable({
          dom: 'Bfrtip',
          buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
          ],
          pageLength: 10,
          order: [[3, 'desc']],
          destroy: true,
          language: {
            search: "Search entries:"
          }
        });
      });

      if (years.length === 0) {
        archivedYearsContainer.innerHTML = `
          <div class="col-12 text-center">
            <p class="text-muted">No archived entries found.</p>
          </div>
        `;
      }
    }

    // Close loading state
    Swal.close();
  }).catch((error) => {
    console.error('Error loading archived entries:', error);
    Swal.close();
    showErrorAlert('Error loading archived entries. Please try again.');
  });
}

// Function to view archived entry details
function viewArchivedEntry(key) {
  entriesRef.child(key).once('value', (snapshot) => {
    const entry = snapshot.val();
    if (entry) {
      // Show entry details in a modal
      const modal = new bootstrap.Modal(document.getElementById('viewArchivedModal'));
      document.getElementById('viewArchivedModal').querySelector('.modal-body').innerHTML = `
        <div class="row mb-3">
          <div class="col-md-6">
            <strong>Control Number:</strong> ${entry.controlNumber}
          </div>
          <div class="col-md-6">
            <strong>Type:</strong> ${entry.type}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <strong>Date Received:</strong> ${formatDate(entry.dateReceived)}
          </div>
          <div class="col-md-6">
            <strong>Time Received:</strong> ${entry.timeReceived}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <strong>From:</strong> ${entry.from}
          </div>
          <div class="col-md-6">
            <strong>Office:</strong> ${entry.office}
          </div>
        </div>
        <div class="mb-3">
          <strong>Subject:</strong> ${entry.subject}
        </div>
        <div class="mb-3">
          <strong>Endorsed To:</strong> ${entry.endorsedTo}
        </div>
        <div class="mb-3">
          <strong>Remarks:</strong> ${entry.remarks || 'None'}
        </div>
        <div class="mb-3">
          <strong>Archived On:</strong> ${formatDate(entry.archivedAt)}
        </div>
      `;
      modal.show();
    }
  });
}

// Function to load documents
function loadDocuments() {
  entriesRef.once('value', (snapshot) => {
    const entries = snapshot.val();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Initialize statistics
    const yearlyStats = {
      total: 0,
      complaints: 0,
      requests: 0,
      proposals: 0,
      invitations: 0
    };

    const monthlyStats = {
      total: 0,
      dailyAverage: 0,
      highestVolume: { month: '', count: 0 },
      lowestVolume: { month: '', count: Infinity }
    };

    const monthlyData = Array(12).fill(0);

    if (entries) {
      Object.entries(entries).forEach(([_, entry]) => {
        const entryDate = new Date(entry.dateReceived);
        const entryYear = entryDate.getFullYear();
        const entryMonth = entryDate.getMonth();

        // Yearly statistics
        if (entryYear === currentYear) {
          yearlyStats.total++;
          yearlyStats[entry.type.toLowerCase() + 's']++;

          // Monthly statistics
          if (entryMonth === currentMonth) {
            monthlyStats.total++;
          }
          monthlyData[entryMonth]++;
        }
      });

      // Calculate monthly statistics
      const nonZeroMonths = monthlyData.filter(count => count > 0);
      monthlyStats.dailyAverage = nonZeroMonths.length > 0 ? 
        Math.round(nonZeroMonths.reduce((a, b) => a + b, 0) / nonZeroMonths.length) : 0;

      monthlyData.forEach((count, month) => {
        if (count > monthlyStats.highestVolume.count) {
          monthlyStats.highestVolume = {
            month: new Date(2000, month).toLocaleString('default', { month: 'long' }),
            count: count
          };
        }
        if (count < monthlyStats.lowestVolume.count && count > 0) {
          monthlyStats.lowestVolume = {
            month: new Date(2000, month).toLocaleString('default', { month: 'long' }),
            count: count
          };
        }
      });
    }

    // Update yearly statistics
    document.getElementById('yearlyTotal').textContent = yearlyStats.total;
    document.getElementById('yearlyComplaints').textContent = yearlyStats.complaints;
    document.getElementById('yearlyRequests').textContent = yearlyStats.requests;
    document.getElementById('yearlyProposals').textContent = yearlyStats.proposals;
    document.getElementById('yearlyInvitations').textContent = yearlyStats.invitations;

    // Update monthly statistics
    document.getElementById('monthlyTotal').textContent = monthlyStats.total;
    document.getElementById('avgDailyLetters').textContent = monthlyStats.dailyAverage;
    document.getElementById('highestVolumeMonth').textContent = 
      `${monthlyStats.highestVolume.month} (${monthlyStats.highestVolume.count})`;
    document.getElementById('lowestVolumeMonth').textContent = 
      `${monthlyStats.lowestVolume.month} (${monthlyStats.lowestVolume.count})`;

    // Create monthly letters chart
    const monthlyCtx = document.getElementById('monthlyLettersChart').getContext('2d');
    new Chart(monthlyCtx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
          label: 'Letters Received',
          data: monthlyData,
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  });
}

// Function to load users
function loadUsers() {
  // Check if DataTable is already initialized
  if ($.fn.DataTable.isDataTable('#usersTable')) {
    $('#usersTable').DataTable().destroy();
  }

  // Show loading state
  Swal.fire({
    title: 'Loading Users',
    text: 'Please wait...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  database.ref('users').once('value', (snapshot) => {
    const users = snapshot.val();
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';

    if (users) {
      Object.entries(users).forEach(([key, user]) => {
        if (key !== 'admin') { // Skip the admin user
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="badge bg-success">Active</span></td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="editUser('${key}')">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger" onclick="deleteUser('${key}')">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          `;
          tbody.appendChild(row);
        }
      });
    }

    // Initialize DataTable
    $('#usersTable').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ],
      pageLength: 10,
      order: [[0, 'asc']],
      destroy: true,
      language: {
        search: "Search users:"
      }
    });

    // Close loading state
    Swal.close();
  }).catch((error) => {
    console.error('Error loading users:', error);
    Swal.close();
    showErrorAlert('Error loading users. Please try again.');
  });
}

// Function to load history
function loadHistory() {
  // Check if DataTable is already initialized
  if ($.fn.DataTable.isDataTable('#historyTable')) {
    $('#historyTable').DataTable().destroy();
  }

  // Show loading state
  Swal.fire({
    title: 'Loading History',
    text: 'Please wait...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  database.ref('logs').on('value', (snapshot) => {
    const logs = snapshot.val();
    const tbody = document.querySelector('#historyTable tbody');
    tbody.innerHTML = '';

    if (logs) {
      Object.entries(logs).forEach(([key, log]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${formatDate(log.timestamp)}</td>
          <td>${log.user}</td>
          <td>${log.action}</td>
          <td>${log.details}</td>
          <td>${log.controlNumber || '-'}</td>
          <td>${log.ipAddress || '-'}</td>
          <td class="small text-muted">${log.userAgent || '-'}</td>
        `;
        tbody.appendChild(row);
      });
    }

    // Initialize DataTable
    $('#historyTable').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ],
      pageLength: 10,
      order: [[0, 'desc']],
      destroy: true,
      language: {
        search: "Search history:"
      },
      columnDefs: [
        { width: '15%', targets: 0 },
        { width: '10%', targets: 1 },
        { width: '10%', targets: 2 },
        { width: '25%', targets: 3 },
        { width: '10%', targets: 4 },
        { width: '15%', targets: 5 },
        { width: '15%', targets: 6 }
      ]
    });

    // Close loading state
    Swal.close();
  }).catch((error) => {
    console.error('Error loading history:', error);
    Swal.close();
    showErrorAlert('Error loading history. Please try again.');
  });
}

// Function to load profile
function loadProfile() {
  database.ref('users/admin').once('value', (snapshot) => {
    const user = snapshot.val();
    if (user) {
      document.getElementById('firstName').value = user.firstName || 'Admin';
      document.getElementById('lastName').value = user.lastName || 'User';
      document.getElementById('email').value = user.email || 'admin@example.com';
      document.getElementById('phone').value = user.phone || '+1 234 567 8900';
      document.getElementById('department').value = user.department || 'Administration';
      document.getElementById('position').value = user.position || 'System Administrator';
    }
  });
}

// Add search functionality
document.getElementById('searchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const controlNumber = document.getElementById('searchControlNumber').value.trim();
  const type = document.getElementById('searchType').value;
  const status = document.getElementById('searchStatus').value;
  const date = document.getElementById('searchDate').value;

  // Show loading state
  Swal.fire({
    title: 'Searching Documents',
    text: 'Please wait...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  entriesRef.once('value', (snapshot) => {
    const entries = snapshot.val();
    const results = [];
    const searchResultsTable = document.getElementById('searchResultsTable').getElementsByTagName('tbody')[0];
    searchResultsTable.innerHTML = '';

    if (entries) {
      Object.entries(entries).forEach(([key, entry]) => {
        let matches = true;

        // Apply filters
        if (controlNumber && !entry.controlNumber.includes(controlNumber)) {
          matches = false;
        }
        if (type && entry.type !== type) {
          matches = false;
        }
        if (status && entry.status !== status) {
          matches = false;
        }
        if (date && entry.dateReceived !== date) {
          matches = false;
        }

        if (matches) {
          results.push({ key, ...entry });
        }
      });

      // Sort results by date (newest first)
      results.sort((a, b) => new Date(b.dateReceived) - new Date(a.dateReceived));

      // Display results
      results.forEach(entry => {
        const row = searchResultsTable.insertRow();
        row.innerHTML = `
          <td>${entry.controlNumber}</td>
          <td>${entry.type}</td>
          <td>${formatDate(entry.dateReceived)}</td>
          <td>${entry.from}</td>
          <td>${entry.subject}</td>
          <td>${entry.endorsedTo}</td>
          <td><span class="badge bg-${getStatusColor(entry.status)}">${entry.status}</span></td>
          <td>
            <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#editEntryModal" onclick="editEntry('${entry.key}')">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-info" onclick="viewEntryDetails('${entry.key}')">
              <i class="bi bi-eye"></i>
            </button>
          </td>
        `;
      });
    }

    // Show/hide results section
    const searchResults = document.getElementById('searchResults');
    if (results.length > 0) {
      searchResults.classList.remove('d-none');
      // Initialize DataTable
      $('#searchResultsTable').DataTable({
        dom: 'Bfrtip',
        buttons: [
          'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        pageLength: 10,
        order: [[2, 'desc']],
        destroy: true,
        language: {
          search: "Search results:"
        }
      });
    } else {
      searchResults.classList.add('d-none');
      showErrorAlert('No documents found matching your search criteria.');
    }

    // Close loading state
    Swal.close();
  }).catch((error) => {
    console.error('Error searching documents:', error);
    Swal.close();
    showErrorAlert('Error searching documents. Please try again.');
  });
});

// Clear search functionality
document.getElementById('clearSearch').addEventListener('click', function() {
  document.getElementById('searchForm').reset();
  document.getElementById('searchResults').classList.add('d-none');
  if ($.fn.DataTable.isDataTable('#searchResultsTable')) {
    $('#searchResultsTable').DataTable().destroy();
  }
});

// Function to view entry details
function viewEntryDetails(key) {
  entriesRef.child(key).once('value', (snapshot) => {
    const entry = snapshot.val();
    if (entry) {
      // Show entry details in a modal
      const modal = new bootstrap.Modal(document.getElementById('viewArchivedModal'));
      document.getElementById('viewArchivedModal').querySelector('.modal-body').innerHTML = `
        <div class="row mb-3">
          <div class="col-md-6">
            <strong>Control Number:</strong> ${entry.controlNumber}
          </div>
          <div class="col-md-6">
            <strong>Type:</strong> ${entry.type}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <strong>Date Received:</strong> ${formatDate(entry.dateReceived)}
          </div>
          <div class="col-md-6">
            <strong>Time Received:</strong> ${entry.timeReceived}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <strong>From:</strong> ${entry.from}
          </div>
          <div class="col-md-6">
            <strong>Office:</strong> ${entry.office}
          </div>
        </div>
        <div class="mb-3">
          <strong>Subject:</strong> ${entry.subject}
        </div>
        <div class="mb-3">
          <strong>Endorsed To:</strong> ${entry.endorsedTo}
        </div>
        <div class="mb-3">
          <strong>Remarks:</strong> ${entry.remarks || 'None'}
        </div>
        <div class="mb-3">
          <strong>Status:</strong> <span class="badge bg-${getStatusColor(entry.status)}">${entry.status}</span>
        </div>
        ${entry.archivedAt ? `
          <div class="mb-3">
            <strong>Archived On:</strong> ${formatDate(entry.archivedAt)}
          </div>
        ` : ''}
      `;
      modal.show();
    }
  });
}