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