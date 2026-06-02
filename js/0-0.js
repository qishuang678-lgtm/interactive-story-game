window.addEventListener('load', () => {
  // 隐藏加载遮罩
  const loadingMask = document.getElementById('loadingMask');
  loadingMask.classList.add('fade-out');

  // 逐行启动文字渐显动画
  const lines = document.querySelectorAll('.line');
  lines.forEach((line, index) => {
    // 给每行文字设置动画延迟索引
    line.style.setProperty('--index', index); 
    line.style.animation = 'fadeInLine 0.8s forwards';
  });

  // 标记是否已加速显示全部文字
  let isFullShown = false; 
  // 监听页面点击事件
  document.addEventListener('click', () => {
    if (!isFullShown) {
      // 第一次点击：立即显示所有文字
      lines.forEach(line => {
        line.style.opacity = 1;
        line.style.transform = 'translateY(0)';
        line.style.animation = 'none';
      });
      isFullShown = true;
    } else {
      // 第二次点击：跳转游戏界面
      window.location.href = '1-1.html'; 
    }
  });
});