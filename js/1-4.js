document.addEventListener("DOMContentLoaded", () => {
    // 对话数据
    const dialogues = [
        { name: "K/O", text: "消灭人类暴政，世界属于K/O！", position: "right", image: "../images/KO抠像.png" },
        { name: "那年追风", text: "啊啊啊！！！", position: "left", image: "../images/吕骐豪抠像.png" },
        { name: "那年追风", text: "究竟是怎么回事？？？耳机里的电流声好吵，耳朵有点疼，头好痛……”", position: "left", image: "../images/吕骐豪抠像.png" },
        { name: "那年追风", text: "（晕了过去）" },
    ];

    // 状态变量
    let currentDialogueIndex = 0;
    let charIndex = 0;
    let isTyping = false;

    // DOM 元素
    const dialogueTextElement = document.getElementById("dialogue-text");
    const characterNameElement = document.getElementById("character-name");
    const leftCharacterImageElement = document.getElementById("left-character-image");
    const rightCharacterImageElement = document.getElementById("right-character-image");
    const dialogueBox = document.querySelector(".dialogue-container");
    const settingsBtn = document.getElementById("settings-btn");
    const settingsMenu = document.getElementById("settings-menu");

    // 修改打字效果函数，扩展爆炸效果判断条件
    async function typeWriter(text, delay = 50) {
        isTyping = true;
        dialogueTextElement.textContent = ""; // 清空内容
        
        // 修改判断条件，同时包含两句需要爆炸效果的文本
        // 使用数组存储所有需要爆炸效果的文本
        const explosionTexts = [
            "啊啊啊！！！",
            "究竟是怎么回事？？？耳机里的电流声好吵，耳朵有点疼，头好痛……”"
        ];
        
        // 判断当前文本是否在需要爆炸效果的列表中
        const isExplosionText = explosionTexts.includes(text);
        
        if (isExplosionText) {
            // 为较长的爆炸文本设置适中的延迟
            delay = text.length > 10 ? 30 : 100; // 长文本用短延迟，短文本用长延迟
            
            for (let i = charIndex; i < text.length; i++) {
                if (!isTyping) {
                    dialogueTextElement.textContent = text;
                    return;
                }
                
                // 创建单个字符元素并添加随机爆炸效果
                const charSpan = document.createElement('span');
                charSpan.textContent = text.charAt(i);
                charSpan.classList.add('char-explode');
                
                // 为每个字符添加随机的动画参数，增强爆炸感
                const randomX = (Math.random() - 0.5) * 30; // 左右偏移（比之前小一点，避免过于混乱）
                const randomY = (Math.random() - 0.5) * 30; // 上下偏移
                const randomScale = 1 + Math.random() * 0.3; // 缩放（比之前小一点）
                const randomDelay = Math.random() * 0.2; // 延迟（更短的延迟，让效果更连贯）
                
                charSpan.style.animationDelay = `${randomDelay}s`;
                charSpan.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale})`;
                
                dialogueTextElement.appendChild(charSpan);
                charIndex++;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        } else {
            // 普通文本的打字效果
            for (let i = charIndex; i < text.length; i++) {
                if (!isTyping) {
                    dialogueTextElement.textContent = text;
                    return;
                }
                dialogueTextElement.textContent += text.charAt(i);
                charIndex++;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
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
        } else {
            // 所有对话结束后跳转到下一场景
            window.location.href = "1-5.html";
        }
    }

    // 设置菜单切换
    settingsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        settingsMenu.classList.toggle("active");
    });

    // 点击页面其他地方关闭设置菜单
    document.addEventListener("click", () => {
        settingsMenu.classList.remove("active");
    });

    // 阻止菜单内部点击事件冒泡
    settingsMenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // 对话区域点击事件
    dialogueBox.addEventListener("click", updateDialogue);

    // 初始化显示第一句对话
    updateDialogue();

    // 自动存档功能
    function autoSave() {
        const saveData = {
            currentDialogueIndex,
            scene: "main",
            timestamp: new Date().toISOString()
        };
        localStorage.setItem("autoSave", JSON.stringify(saveData));
    }

    // 定时存档
    setInterval(autoSave, 30000); // 每30秒自动存档
});

localStorage.setItem("currentPath", window.location.pathname); // 当前页面路径
