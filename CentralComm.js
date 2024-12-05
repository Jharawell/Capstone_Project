document.addEventListener("DOMContentLoaded", function() {
    const splashScreen = document.getElementById('splashScreen');

    const startSplashAnimation = () => {
        splashScreen.style.transform = 'scale(1)'; 
    };

    setTimeout(startSplashAnimation, 100); 
    setTimeout(() => {
        splashScreen.style.opacity = '0'; 
        setTimeout(() => {
            splashScreen.style.display = 'none'; 
        }, 1000); 
    }, 3000); 
	
});

