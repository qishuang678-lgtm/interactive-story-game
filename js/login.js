document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('.login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  const style = document.createElement('style');
  style.textContent = `
    .fade-out {
      opacity: 0;
      transition: opacity 1s ease-out;
    }
    body {
      transition: opacity 1s ease-out;
    }
  `;
  document.head.appendChild(style);

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      alert('用户名和密码不能为空！');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const matchedUser = users.find(
      user => user.username === username && user.password === password
    );

    if (matchedUser) {
      localStorage.setItem('currentUser', username);
      
      document.body.classList.add('fade-out');
      
      setTimeout(() => {
        window.location.href = 'menu.html';
      }, 1000);
    } else {
      alert('用户名或密码错误，请重新输入！');
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
});
