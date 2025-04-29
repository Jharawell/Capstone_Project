// Initialize Firebase
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

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
const entriesRef = database.ref('entries');

// Function to preview next control number without incrementing
function previewNextControlNumber(date) {
  return new Promise((resolve, reject) => {
    const d = new Date(date);
    const year = String(d.getFullYear()).slice(-2);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateKey = `${year}${day}${month}`;
    
    // Get the current count for this date from Firebase
    database.ref('controlNumbers').child(dateKey).once('value')
      .then((snapshot) => {
        let count = snapshot.val() || 0;
        resolve(`${dateKey}-${count + 1}/100`);
      })
      .catch((error) => {
        console.error('Error previewing control number:', error);
        reject(error);
      });
  });
}

// Function to generate and save control number
function generateControlNumber(date) {
  return new Promise((resolve, reject) => {
    const d = new Date(date);
    const year = String(d.getFullYear()).slice(-2);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateKey = `${year}${day}${month}`;
    
    // Get the current count for this date from Firebase
    database.ref('controlNumbers').child(dateKey).once('value')
      .then((snapshot) => {
        let count = snapshot.val() || 0;
        count++;
        
        // Update the count in Firebase
        return database.ref('controlNumbers').child(dateKey).set(count)
          .then(() => {
            const controlNumber = `${dateKey}-${count}/100`;
            // Store the generated control number
            return database.ref('generatedControlNumbers').push({
              controlNumber: controlNumber,
              date: date,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            }).then(() => {
              resolve(controlNumber);
            });
          });
      })
      .catch((error) => {
        console.error('Error generating control number:', error);
        reject(error);
      });
  });
}

// Function to check and archive old entries
function checkAndArchiveEntries() {
  // Show loading state
  Swal.fire({
    title: 'Checking Entries',
    text: 'Please wait while we check for entries to archive...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  const currentYear = new Date().getFullYear();
  entriesRef.once('value', (snapshot) => {
    const entries = snapshot.val();
    if (entries) {
      let archivedCount = 0;
      let totalToArchive = 0;

      // First count how many entries need to be archived
      Object.entries(entries).forEach(([_, entry]) => {
        const entryYear = new Date(entry.dateReceived).getFullYear();
        if (currentYear === 2025 && entryYear < 2025 && entry.status !== 'Archived') {
          totalToArchive++;
        }
      });

      if (totalToArchive === 0) {
        Swal.close();
        return;
      }

      // Update loading message
      Swal.update({
        title: 'Archiving Entries',
        html: `Archiving ${totalToArchive} entries...`
      });

      // Archive each entry
      Object.entries(entries).forEach(([key, entry]) => {
        const entryYear = new Date(entry.dateReceived).getFullYear();
        if (currentYear === 2025 && entryYear < 2025 && entry.status !== 'Archived') {
          entriesRef.child(key).update({
            status: 'Archived',
            archivedAt: firebase.database.ServerValue.TIMESTAMP
          })
          .then(() => {
            archivedCount++;
            logActivity('archive', `Archived entry from ${entryYear}: ${entry.subject}`, entry.controlNumber);
            
            // Update progress
            if (archivedCount === totalToArchive) {
              Swal.fire({
                title: 'Success!',
                text: `Successfully archived ${archivedCount} entries!`,
                icon: 'success',
                confirmButtonColor: '#2e7d32'
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
    }
    Swal.close();
  }).catch((error) => {
    console.error('Error checking entries:', error);
    Swal.close();
    showErrorAlert('Error checking entries. Please try again.');
  });
}

// Function to load entries into the table
function loadEntries() {
  const currentYear = new Date().getFullYear();
  entriesRef.on('value', (snapshot) => {
    const entries = snapshot.val();
    const accordionContainer = document.getElementById('monthlyStatsAccordion');
    
    // Create months array
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Clear existing content
    accordionContainer.innerHTML = '';

    // Create accordion structure for all months
    months.forEach(month => {
      const monthKey = `${month.toLowerCase()}${currentYear}`;
      const monthEntries = entries ? Object.entries(entries)
        .filter(([_, entry]) => {
          try {
            const date = new Date(entry.dateReceived);
            if (isNaN(date.getTime())) return false;
            const entryMonth = date.toLocaleString('default', { month: 'long' });
            const entryYear = date.getFullYear();
            // Only show non-archived entries
            return entryMonth === month && entryYear === currentYear && entry.status !== 'Archived';
          } catch (error) {
            console.error('Error processing entry:', error);
            return false;
          }
        })
        .map(([key, entry]) => ({ key, ...entry })) : [];

      // Sort entries by date
      monthEntries.sort((a, b) => {
        return new Date(b.dateReceived) - new Date(a.dateReceived);
      });

      // Calculate statistics (only for non-archived entries)
      const stats = {
        complaints: monthEntries.filter(e => e.type === 'Complaint').length,
        proposals: monthEntries.filter(e => e.type === 'Proposal').length,
        invitations: monthEntries.filter(e => e.type === 'Invitation').length,
        requests: monthEntries.filter(e => e.type === 'Request').length
      };

      // Create accordion item
      const accordionItem = document.createElement('div');
      accordionItem.className = 'accordion-item border-0 mb-2';
      accordionItem.innerHTML = `
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${monthKey}">
            <div class="d-flex justify-content-between align-items-center w-100">
              <div>
                <span class="fw-bold">${month} ${currentYear}</span>
                <span class="badge bg-success ms-2">Active</span>
              </div>
              <div class="text-muted small">
                <i class="bi bi-arrow-down-circle me-1"></i>
                Click to view details
              </div>
            </div>
          </button>
        </h2>
        <div id="${monthKey}" class="accordion-collapse collapse" data-bs-parent="#monthlyStatsAccordion">
          <div class="accordion-body">
            <!-- ${month} Statistics -->
            <div class="row mb-4">
              <div class="col-md-3">
                <div class="card bg-primary bg-opacity-10">
                  <div class="card-body">
                    <h6 class="card-title text-primary">Complaints</h6>
                    <h2 class="card-text">${stats.complaints}</h2>
                    <div class="d-flex align-items-center">
                      <span class="trend-indicator trend-up text-primary">
                        <i class="bi bi-arrow-up me-1"></i>0%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card bg-warning bg-opacity-10">
                  <div class="card-body">
                    <h6 class="card-title text-warning">Proposals</h6>
                    <h2 class="card-text">${stats.proposals}</h2>
                    <div class="d-flex align-items-center">
                      <span class="trend-indicator trend-up text-warning">
                        <i class="bi bi-arrow-up me-1"></i>0%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card bg-info bg-opacity-10">
                  <div class="card-body">
                    <h6 class="card-title text-info">Invitations</h6>
                    <h2 class="card-text">${stats.invitations}</h2>
                    <div class="d-flex align-items-center">
                      <span class="trend-indicator trend-up text-info">
                        <i class="bi bi-arrow-up me-1"></i>0%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card bg-success bg-opacity-10">
                  <div class="card-body">
                    <h6 class="card-title text-success">Requests</h6>
                    <h2 class="card-text">${stats.requests}</h2>
                    <div class="d-flex align-items-center">
                      <span class="trend-indicator trend-up text-success">
                        <i class="bi bi-arrow-up me-1"></i>0%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-hover monthly-stats-table">
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
                  ${monthEntries.length > 0 ? monthEntries.map(entry => `
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
                      <td><span class="badge bg-${getStatusColor(entry.status)}">${entry.status}</span></td>
                      <td>
                        <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#editEntryModal" onclick="editEntry('${entry.key}')">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEntry('${entry.key}')">
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  `).join('') : `
                    <tr>
                      <td colspan="11" class="text-center text-muted">No entries for ${month}</td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
      accordionContainer.appendChild(accordionItem);
    });
  });
}

// Function to get status color
function getStatusColor(status) {
  switch(status) {
    case 'Pending': return 'warning';
    case 'Processing': return 'info';
    case 'Completed': return 'success';
    case 'Archived': return 'secondary';
    default: return 'primary';
  }
}

// Function to format date
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

// Function to log activity
function logActivity(action, details, controlNumber) {
  const logData = {
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    user: 'Admin', // Replace with actual user when authentication is implemented
    action: action,
    details: details,
    controlNumber: controlNumber,
    ipAddress: '127.0.0.1' // Replace with actual IP when available
  };

  database.ref('logs').push(logData)
    .catch((error) => {
      console.error('Error logging activity:', error);
    });
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