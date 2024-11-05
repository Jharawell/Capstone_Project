document.addEventListener("DOMContentLoaded", function() {
    const splashScreen = document.getElementById('splashScreen');
    const mainContent = document.getElementById('mainContent');

    const startSplashAnimation = () => {
        splashScreen.style.transform = 'scale(1)'; 
    };

    setTimeout(startSplashAnimation, 100); 
    setTimeout(() => {
        splashScreen.style.opacity = '0'; 
        setTimeout(() => {
            splashScreen.style.display = 'none'; 
            mainContent.style.opacity = '1'; 
        }, 1000); 
    }, 2000); 
	
	mainContent.addEventListener('click', () => {
		window.location.href = 'log-in.html';
	});
});