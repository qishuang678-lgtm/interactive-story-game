// 游戏元素获取
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const pauseScreen = document.getElementById('pause-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const livesElement = document.getElementById('lives');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸
canvas.width = 800;
canvas.height = 600;

// 游戏状态变量
let gameRunning = false;
let gamePaused = false;
let score = 0;
let lives = 3;
let lastTime = 0;
let enemySpawnTimer = 0;
let enemySpawnInterval = 1500; // 敌机生成间隔(毫秒)
const maxScoreForEnemies = 1000; // 达到此分数后不再出怪
let stopSpawningEnemies = false; // 是否停止生成敌机

// 玩家飞机属性
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 60,
    speed: 5,
    color: '#4CAF50',
    bullets: [],
    lastShot: 0,
    shotCooldown: 300 // 射击冷却时间(毫秒)
};

// 敌机数组
let enemies = [];

// 按键状态跟踪
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

// 初始化游戏
function initGame() {
    // 重置游戏状态
    score = 0;
    lives = 3;
    stopSpawningEnemies = false;
    enemySpawnInterval = 1500;
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 100;
    player.bullets = [];
    enemies = [];
    enemySpawnTimer = 0;
    
    // 更新UI
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    finalScoreElement.textContent = score;
    
    // 开始游戏循环
    gameRunning = true;
    gamePaused = false;
    requestAnimationFrame(gameLoop);
}

// 游戏主循环
function gameLoop(timestamp) {
    if (!gameRunning) return;
    if (gamePaused) {
        pauseScreen.classList.remove('hidden');
        return;
    }
    
    // 计算时间差
    const deltaTime = timestamp - lastTime || 0;
    lastTime = timestamp;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 检查是否达到最大分数
    if (stopSpawningEnemies && enemies.length > 0) {
        showMessage("消灭剩余敌机即可胜利！");
    } else if (stopSpawningEnemies && enemies.length === 0) {
        endGame(true);
        return;
    }
    
    // 更新和绘制玩家
    updatePlayer(deltaTime);
    drawPlayer();
    
    // 更新和绘制子弹
    updateBullets();
    drawBullets();
    
    // 生成敌机（仅在未达到分数上限时）
    if (!stopSpawningEnemies) {
        enemySpawnTimer += deltaTime;
        if (enemySpawnTimer >= enemySpawnInterval) {
            spawnEnemy();
            enemySpawnTimer = 0;
            if (enemySpawnInterval > 500) {
                enemySpawnInterval -= 10;
            }
        }
    }
    
    // 更新和绘制敌机
    updateEnemies(deltaTime);
    drawEnemies();
    
    // 碰撞检测
    checkCollisions();
    
    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}

// 显示提示信息
function showMessage(text) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, 50);
}

// 更新玩家位置
function updatePlayer(deltaTime) {
    // 移动玩家
    if (keys.ArrowUp && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    
    // 发射子弹 - 修复的核心部分
    if (keys.Space && gameRunning && !gamePaused) {
        const now = Date.now();
        if (now - player.lastShot > player.shotCooldown) {
            shootBullet();
            player.lastShot = now;
        }
    }
}

// 绘制玩家飞机
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();
    
    // 绘制飞机细节
    ctx.fillStyle = '#2E7D32';
    ctx.fillRect(player.x + 10, player.y + player.height - 10, 30, 5);
}

// 发射子弹
function shootBullet() {
    player.bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 15,
        speed: 8,
        color: '#FFEB3B'
    });
}

// 更新子弹位置
function updateBullets() {
    for (let i = player.bullets.length - 1; i >= 0; i--) {
        const bullet = player.bullets[i];
        bullet.y -= bullet.speed;
        
        // 移除超出屏幕的子弹
        if (bullet.y + bullet.height < 0) {
            player.bullets.splice(i, 1);
        }
    }
}

// 绘制子弹
function drawBullets() {
    player.bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// 预加载敌机图片
const enemyImages = {
    1: new Image(),
    2: new Image(),
    3: new Image()
};

// 设置图片路径
enemyImages[1].src = '../images/KO头.png';  // 替换为你的图片路径
enemyImages[2].src = '../images/KO头.png';  // 替换为你的图片路径
enemyImages[3].src = '../images/KO头.png';  // 替换为你的图片路径

// 生成敌机（修改部分）
function spawnEnemy() {
    const enemyTypes = [
        { width: 180, height: 170, speed: 2, image: enemyImages[1], points: 10 },
        { width: 100, height: 100, speed: 1.5, image: enemyImages[2], points: 20 },
        { width: 90, height: 90, speed: 3, image: enemyImages[3], points: 15 }
    ];
    
    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const x = Math.random() * (canvas.width - enemyType.width);
    
    enemies.push({
        x: x,
        y: -enemyType.height,
        width: enemyType.width,
        height: enemyType.height,
        speed: enemyType.speed,
        image: enemyType.image,  // 存储图片引用
        points: enemyType.points
    });
}

// 更新敌机位置
function updateEnemies(deltaTime) {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.y += enemy.speed;
        
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
            loseLife();
        }
    }
}

// 绘制敌机（修改部分）
function drawEnemies() {
    enemies.forEach(enemy => {
        // 使用图片绘制敌机，替代原来的矩形
        ctx.drawImage(
            enemy.image, 
            enemy.x, 
            enemy.y, 
            enemy.width, 
            enemy.height
        );
    });
}

// 碰撞检测
function checkCollisions() {
    // 子弹与敌机碰撞
    for (let i = player.bullets.length - 1; i >= 0; i--) {
        const bullet = player.bullets[i];
        
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                player.bullets.splice(i, 1);
                enemies.splice(j, 1);
                increaseScore(enemy.points);
                break;
            }
        }
    }
    
    // 玩家与敌机碰撞
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            enemies.splice(i, 1);
            loseLife();
            break;
        }
    }
}

// 增加分数
function increaseScore(points) {
    score += points;
    scoreElement.textContent = score;
    finalScoreElement.textContent = score;
    
    if (score >= maxScoreForEnemies) {
        stopSpawningEnemies = true;
    }
}

// 减少生命值
function loseLife() {
    lives--;
    livesElement.textContent = lives;
    
    player.color = '#FF5722';
    setTimeout(() => {
        player.color = '#4CAF50';
    }, 200);
    
    if (lives <= 0) {
        endGame(false);
    }
}

// 结束游戏
function endGame(isVictory) {
    gameRunning = false;
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    
    if (isVictory) {
        document.querySelector('#end-screen h1').textContent = '恭喜胜利！';
    } else {
        document.querySelector('#end-screen h1').textContent = '游戏结束';
    }
}

// 暂停游戏
function pauseGame() {
    if (!gameRunning) return;
    
    gamePaused = true;
    pauseScreen.classList.remove('hidden');
}

// 恢复游戏
function resumeGame() {
    gamePaused = false;
    pauseScreen.classList.add('hidden');
    requestAnimationFrame(gameLoop);
}

// 事件监听 - 键盘按下（修复了空格键问题）
document.addEventListener('keydown', (e) => {
    // 处理方向键
    if (keys.hasOwnProperty(e.key)) {
        e.preventDefault();
        keys[e.key] = true;
    }
    
    // 处理空格键
    if (e.code === 'Space') {
        e.preventDefault();
        keys.Space = true;
    }
    
    // ESC键暂停/继续游戏
    if (e.key === 'Escape' && gameRunning) {
        if (gamePaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
});

// 事件监听 - 键盘释放
document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        e.preventDefault();
        keys[e.key] = false;
    }
    
    // 处理空格键释放
    if (e.code === 'Space') {
        e.preventDefault();
        keys.Space = false;
    }
});

// 按钮事件监听
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    initGame();
});

restartBtn.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    initGame();
});

pauseBtn.addEventListener('click', pauseGame);
resumeBtn.addEventListener('click', resumeGame);
