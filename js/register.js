document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.querySelector('.register-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const confirmValue = confirmPasswordInput.value.trim();

    if (!username) {
      alert('请输入用户名！');
      usernameInput.focus();
      return;
    }

    if (passwordValue !== confirmValue) {
      alert('两次输入的密码不一致，请重新输入！');
      confirmPasswordInput.focus();
      confirmPasswordInput.value = '';
      return;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    if (!passwordPattern.test(passwordValue)) {
      alert('密码需为6-18位，且包含字母和数字！');
      passwordInput.focus();
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const isUsernameExist = existingUsers.some(user => user.username === username);
    if (isUsernameExist) {
      alert('该用户名已被注册，请更换！');
      usernameInput.focus();
      return;
    }

    existingUsers.push({ username, password: passwordValue });
    localStorage.setItem('users', JSON.stringify(existingUsers));

    alert('注册验证通过！');
    window.location.href = 'login.html';
  });
});