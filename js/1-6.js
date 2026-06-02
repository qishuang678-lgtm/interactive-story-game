document.addEventListener("DOMContentLoaded", () => {
    // 对话数据
    const dialogues = [
        { name: "", text: "通过芮娜残存的记忆，你大概了解了事情的来龙去脉：" },
        { name: "", text: "《无畏契约》游戏内置的先进AI模型，让角色们有了自主意识，甚至掌握了连接现实的方法。不过，这种技术仍在萌芽阶段，并不成熟。"},
        { name: "", text: "如今，游戏角色分裂成了两个阵营。以K.O为首的部分角色，长期被玩家操控，在无尽的死亡轮回中痛苦不堪，认为自己只是玩家取乐的工具，心中满是仇恨，于是发动 “无畏暴动”，誓要报复人类"},
        { name: "", text: "而以芮娜为首的另一部分角色，则觉得游戏本就该带来快乐，自己由人类创造，为人类带来欢乐也理所当然，并且在与玩家并肩作战中，也收获了协作和胜利的喜悦，因此选择加入对抗K/O的阵营" },
        { name: "", text: "至于你，在K/O发动暴动时恰好在无畏世界里畅游，阴差阳错之下，被拉入了无畏契约的世界，附身在了芮娜的身上" },
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
        } else {
            // 所有对话结束后跳转到下一场景
            window.location.href = "1-7.html";
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
