document.addEventListener('DOMContentLoaded', () => {
    // 游戏配置
    const SIZE = 4; // 4x4 网格
    let puzzleArray = []; // 存储拼图数据
    let emptyPosition = { row: SIZE - 1, col: SIZE - 1 }; // 空白块初始位置
    
    // 内置图片 - 请替换为你的图片路径
    const puzzleImage = "../images/华容道.png"; // 替换为你的图片
    
    // 下一页面地址 - 请替换为实际页面
    const nextPage = "第一章传送门.html";
    
    // 获取DOM元素
    const puzzleContainer = document.getElementById('puzzle-container');
    const resetButton = document.getElementById('reset-btn');
    const skipButton = document.getElementById('skip-btn');
    const showOriginalBtn = document.getElementById('show-original-btn');
    const originalPopup = document.getElementById('original-image-popup');
    const closeBtn = document.querySelector('.close-btn');
    
    // 对话框元素
    const dialogueTextElement = document.getElementById("dialogue-text");
    const characterNameElement = document.getElementById("character-name");
    const leftCharacterImageElement = document.getElementById("left-character-image");
    const rightCharacterImageElement = document.getElementById("right-character-image");
    const dialogueBox = document.querySelector(".dialogue-container");
    
    // 对话数据
    const dialogues = [
        { name: "那年芮娜", text: "这个拼图看起来好复杂...", position: "right", image: "../images/芮娜抠像.png"},
        { name: "那年芮娜", text: "我需要把图片拼好才能打开传送门吗？", position: "right", image: "../images/芮娜抠像.png"},
        { name: "那年芮娜", text: "点击图片块可以移动它们，试试看吧", position: "right", image: "../images/芮娜抠像.png" }
    ];
    
    // 对话状态变量
    let currentDialogueIndex = 0;
    let charIndex = 0;
    let isTyping = false;
    
    // 初始化游戏
    initGame();
    // 初始化对话
    initDialogue();
    
    // 事件监听
    resetButton.addEventListener('click', initGame);
    skipButton.addEventListener('click', () => {
        window.location.href = nextPage;
    });
    
    // 原图弹窗控制
    showOriginalBtn.addEventListener('click', () => {
        originalPopup.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', () => {
        originalPopup.style.display = 'none';
    });
    
    // 点击弹窗外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === originalPopup) {
            originalPopup.style.display = 'none';
        }
    });
    
    // 对话框点击事件
    dialogueBox.addEventListener("click", updateDialogue);
    
    // 初始化函数
    function initGame() {
        // 生成拼图数据
        generatePuzzleArray();
        
        // 渲染拼图
        renderPuzzle();
    }
    
    // 初始化对话
    function initDialogue() {
        updateDialogue();
    }
    
    // 生成拼图数据
    function generatePuzzleArray() {
        // 创建有序数组 1-15，最后一个为0表示空白
        puzzleArray = [];
        for (let i = 1; i < SIZE * SIZE; i++) {
            puzzleArray.push(i);
        }
        puzzleArray.push(0); // 0 表示空白块
        
        // 打乱拼图（确保可解）
        shufflePuzzle();
    }
    
    // 打乱拼图
    function shufflePuzzle() {
        let solvable = false;
        
        // 确保拼图可解
        while (!solvable) {
            // Fisher-Yates 洗牌算法
            for (let i = puzzleArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [puzzleArray[i], puzzleArray[j]] = [puzzleArray[j], puzzleArray[i]];
            }
            
            // 检查是否可解
            solvable = isSolvable();
        }
        
        // 更新空白块位置
        const emptyIndex = puzzleArray.indexOf(0);
        emptyPosition = {
            row: Math.floor(emptyIndex / SIZE),
            col: emptyIndex % SIZE
        };
    }
    
    // 检查拼图是否可解
    function isSolvable() {
        let inversions = 0;
        const size = SIZE;
        
        // 计算逆序数
        for (let i = 0; i < puzzleArray.length; i++) {
            for (let j = i + 1; j < puzzleArray.length; j++) {
                if (puzzleArray[i] !== 0 && puzzleArray[j] !== 0 && puzzleArray[i] > puzzleArray[j]) {
                    inversions++;
                }
            }
        }
        
        // 对于偶数尺寸的棋盘
        if (size % 2 === 0) {
            // 空白块所在的行数（从底部开始计数）
            const blankRowFromBottom = size - emptyPosition.row;
            return (inversions + blankRowFromBottom) % 2 === 0;
        } else {
            // 对于奇数尺寸的棋盘，逆序数必须为偶数
            return inversions % 2 === 0;
        }
    }
    
    // 渲染拼图
    function renderPuzzle() {
        puzzleContainer.innerHTML = '';
        
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                const index = i * SIZE + j;
                const value = puzzleArray[index];
                const piece = document.createElement('div');
                piece.classList.add('puzzle-piece');
                piece.dataset.row = i;
                piece.dataset.col = j;
                
                // 空白块
                if (value === 0) {
                    piece.classList.add('empty');
                } else {
                    // 设置图片背景
                    const pieceValue = value - 1; // 转换为0-14的索引
                    const row = Math.floor(pieceValue / SIZE);
                    const col = pieceValue % SIZE;
                    
                    const xPos = (col * 100) / (SIZE - 1);
                    const yPos = (row * 100) / (SIZE - 1);
                    
                    piece.style.backgroundImage = `url(${puzzleImage})`;
                    piece.style.backgroundPosition = `-${xPos}% -${yPos}%`;
                    piece.style.backgroundSize = `${SIZE * 100}% ${SIZE * 100}%`;
                    
                    // 添加点击事件
                    piece.addEventListener('click', () => {
                        movePiece(i, j);
                    });
                }
                
                puzzleContainer.appendChild(piece);
            }
        }
    }
    
    // 移动拼图块
    function movePiece(row, col) {
        // 检查是否可以移动（上下左右相邻）
        const isAdjacent = 
            (Math.abs(row - emptyPosition.row) === 1 && col === emptyPosition.col) ||
            (Math.abs(col - emptyPosition.col) === 1 && row === emptyPosition.row);
        
        if (!isAdjacent) return;
        
        // 计算当前索引和空白块索引
        const currentIndex = row * SIZE + col;
        const emptyIndex = emptyPosition.row * SIZE + emptyPosition.col;
        
        // 交换位置
        [puzzleArray[currentIndex], puzzleArray[emptyIndex]] = 
        [puzzleArray[emptyIndex], puzzleArray[currentIndex]];
        
        // 更新空白块位置
        emptyPosition = { row, col };
        
        // 重新渲染
        renderPuzzle();
        
        // 检查是否完成
        if (isPuzzleComplete()) {
            // 延迟跳转，让玩家看到完成效果
            setTimeout(() => {
                window.location.href = nextPage;
            }, 500);
        }
    }
    
    // 检查拼图是否完成
    function isPuzzleComplete() {
        for (let i = 0; i < puzzleArray.length - 1; i++) {
            if (puzzleArray[i] !== i + 1) {
                return false;
            }
        }
        return true;
    }
    
    // 打字效果函数
    async function typeWriter(text, delay = 50) {
        isTyping = true;
        for (let i = charIndex; i < text.length; i++) {
            if (!isTyping) {
                dialogueTextElement.textContent = text;
                return;
            }
            dialogueTextElement.textContent += text.charAt(i);
            charIndex++;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        isTyping = false;
    }
    
    // 更新对话函数
    async function updateDialogue() {
        if (isTyping) {
            isTyping = false; // 中断打字，显示完整文本
            return;
        }
        
        if (currentDialogueIndex < dialogues.length) {
            const dialogue = dialogues[currentDialogueIndex];
            charIndex = 0;
            dialogueTextElement.textContent = "";
            
            // 更新角色名
            characterNameElement.textContent = dialogue.name;
            
            // 更新角色立绘
            leftCharacterImageElement.classList.remove("visible");
            rightCharacterImageElement.classList.remove("visible");
            
            if (dialogue.position === "left") {
                leftCharacterImageElement.src = dialogue.image || "";
                leftCharacterImageElement.classList.add("visible");
            } else {
                rightCharacterImageElement.src = dialogue.image || "";
                rightCharacterImageElement.classList.add("visible");
            }
            
            // 开始打字
            await typeWriter(dialogue.text);
            currentDialogueIndex++;
        }
        // 移除了对话结束后自动跳转的功能
    }
});