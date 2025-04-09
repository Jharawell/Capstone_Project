// Add this at the end of your HTML file, before the closing </body> tag
document.addEventListener('DOMContentLoaded', function() {
    const drawer = document.querySelector('.drawer');
    const drawerToggle = document.querySelector('.drawer-toggle');
    const container = document.querySelector('.container');

    // Toggle drawer
    drawerToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        drawer.classList.toggle('open');
        if (drawer.classList.contains('open')) {
            container.style.marginLeft = '280px';
        } else {
            container.style.marginLeft = '0';
        }
    });

    // Close drawer when clicking outside
    document.addEventListener('click', function(e) {
        if (!drawer.contains(e.target) && 
            !drawerToggle.contains(e.target) && 
            drawer.classList.contains('open')) {
            drawer.classList.remove('open');
            container.style.marginLeft = '0';
        }
    });

    // Prevent drawer from closing when clicking inside
    drawer.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});