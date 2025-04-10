document.addEventListener("DOMContentLoaded", function () {
    const splashScreen = document.getElementById('splashScreen');
    const mainContent = document.getElementById('mainContent');

    setTimeout(() => {
        splashScreen.style.opacity = '0'; // Fade out
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.style.display = 'block'; //
        }, 1000); // Wait for fade-out animation
    }, 3000); // Display duration of splash screen

    $(window).on('scroll load', function () {

        if ($(window).scrollTop() > 30) {
            $('header').addClass('header-active');
        } else {
            $('header').removeClass('header-active');
        }

        $('section').each(function () {
            var offset = $(window).scrollTop();
            var id = $(this).attr('id');
            var top = $(this).offset().top - 200;
            var height = $(this).height();

            if (offset >= top && offset < top + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });
});

function showPopup(title, text) {
    document.getElementById('popup-title').textContent = title;
    document.getElementById('popup-text').textContent = text;
    document.getElementById('popup').style.display = 'flex';
    document.getElementById('popup').classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('show');
    popup.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

// Add search functionality
document.getElementById('searchInput')?.addEventListener('input', function(e) {
    const searchText = e.target.value.toLowerCase();
    const popupText = document.getElementById('popup-text');
    const originalText = popupText.getAttribute('data-original-text') || popupText.textContent;
    
    if (!popupText.getAttribute('data-original-text')) {
        popupText.setAttribute('data-original-text', originalText);
    }

    if (searchText) {
        const highlightedText = originalText.replace(
            new RegExp(searchText, 'gi'),
            match => `<mark style="background-color: #fff3cd;">${match}</mark>`
        );
        popupText.innerHTML = highlightedText;
    } else {
        popupText.textContent = originalText;
    }
});

// Close popup when clicking outside
window.addEventListener('click', function(event) {
    const popup = document.getElementById('popup');
    if (event.target === popup) {
        closePopup();
    }
});

// firebase configuration 
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

// initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// search functionality for firebase records
function searchDocument() {
    const controlNumber = document.getElementById('controlNumberInput').value.trim();
    const searchResults = document.getElementById('search-results');
    
    // check if control number is empty
    if (!controlNumber) {
        alert('Please enter a control number');
        return;
    }
    // show loading message and hide previous results
    document.getElementById('popup-text').textContent = 'Searching...';
    searchResults.style.display = 'none';

    // firebase database reference
    const dbRef = firebase.database();
    let found = false;
    // array of month names for searching
    const months = ["January", "February", "March", "April", "May", "June", 
                   "July", "August", "September", "October", "November", "December"];
    // search in each month node
    Promise.all(months.map(month => {
        return dbRef.ref(month)
            //
            .orderByChild('ctrl_No')
            .equalTo(controlNumber)
            .once('value');
    }))
    // process the results from all month nodes
    .then(snapshots => {
        snapshots.forEach(snapshot => {
            // check if the snapshot exists and has children
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    found = true;
                    const data = childSnapshot.val();
                    displayResults(data);
                });
            }
        });
        // if not found in month nodes, search in recSecItem node
        if (!found) {
            return dbRef.ref('recSecItem')
                .orderByChild('controlNumber')
                .equalTo(controlNumber)
                .once('value');
        }
    })
    // process the results from recSecItem node
    .then(snapshot => {
        if (!found && snapshot && snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                displayResults(data);
            });
            // found = true;
        } else if (!found) {
            document.getElementById('popup-text').textContent = 'No record found for this control number.';
        }
    })
    .catch(error => {
        console.error('Error searching document:', error);
        document.getElementById('popup-text').textContent = 'An error occurred while searching.';
    });
}
// display results in the popup
function displayResults(data) {
    const searchResults = document.getElementById('search-results');
    document.getElementById('result-ctrl-no').textContent = data.controlNumber || data.ctrl_No || 'N/A';
    document.getElementById('result-endorsed').textContent = data.endorsedTo || data.endorsed || 'N/A';
    document.getElementById('result-status').textContent = data.status || 'Pending';
    // document.getElementById('result-date').textContent = data.date || 'N/A';
    searchResults.style.display = 'block';
    document.getElementById('popup-text').textContent = '';
}

// initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // add click handler for search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchDocument);
    }

    // add enter key handler for search input
    const searchInput = document.getElementById('controlNumberInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDocument();
            }
        });
    }
});