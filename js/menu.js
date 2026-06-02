document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('newGameBtn').addEventListener('click', function() {
        this.classList.add('scale-95');
        setTimeout(() => {
            window.location.href = '0-0.html';
        }, 200);
    });
    
    document.getElementById('loadGameBtn').addEventListener('click', function() {
        this.classList.add('scale-95');
        setTimeout(() => {
            window.location.href = 'save.html?action=load';
        }, 200);
    });
    
    document.getElementById('achievementsBtn').addEventListener('click', function() {
        this.classList.add('scale-95');
        setTimeout(() => {
            window.location.href = '成就.html';
        }, 200);
    });
    
    document.getElementById('aboutBtn').addEventListener('click', function() {
        this.classList.add('scale-95');
        setTimeout(() => {
            window.location.href = 'about.html';
        }, 200);
    });
    
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseleave', function() {
            this.classList.remove('scale-95');
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            alert('返回上一级菜单');
        }
    });
});