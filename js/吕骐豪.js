
document.addEventListener('DOMContentLoaded', function() {
    
    const welcomeBar = document.querySelector('.welcome-bar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 15) {
            welcomeBar.classList.add('scroll');
        } else {
            welcomeBar.classList.remove('scroll');
        }
    });

    
    const hobbyImages = document.querySelectorAll('.hobby-item img');
    hobbyImages.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://picsum.photos/seed/hobby/400/500'; 
            this.alt = '爱好相关图片';
        });
    });

    
    document.body.addEventListener('click', function(e) {
        
        if (!e.target.closest('img') && !e.target.closest('button') && !e.target.closest('a')) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});