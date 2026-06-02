document.addEventListener('DOMContentLoaded', () => {
    const creatorCards = document.querySelectorAll('.creator-card');
    creatorCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetUrl = card.getAttribute('data-url');
            if (targetUrl && targetUrl!== '#') {
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 800);
            }
        });
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 15px 30px -5px rgba(6, 182, 212, 0.2)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
    const backButton = document.querySelector('a[href="menu.html"]');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = e.currentTarget.getAttribute('href');
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 800);
        });
    }
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});