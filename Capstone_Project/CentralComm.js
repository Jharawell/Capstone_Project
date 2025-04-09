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