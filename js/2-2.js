document.addEventListener("DOMContentLoaded", () => {
    // 对话数据
    const dialogues = [
        {name: "", text: "（霓虹町的灯光忽然闪烁了三下，像是某种信号。下一秒，一个身影从断墙后滑出，动作利落地落地时，手里的飞镖在指尖转得带起轻微的破空声。）"},
        {name: "", text: "（是捷风，她手中的飓刃还闪着微光，显然刚结束一场小规模缠斗。"},
        {name: "捷风", text: "你来得正好，芮娜。", position: "right", image: "../images/捷风抠像.png"},
        {name: "", text: "(捷风抬眼看向你，语气里没有丝毫意外，仿佛你们昨天才刚并肩作战过）"},
        {name: "捷风", text: "数据分析有结果了，狡猾的K/O分出了三个记忆密钥，藏在无畏世界的三个角落", position: "right", image: "../images/捷风抠像.png"},
        {name: "捷风", text: "只要有任何一块密钥还存留在无畏世界，即便 K/O 主体暂时被击败，他也能依靠密钥的数据卷土重来，只有摧毁三块密钥，才能彻底断绝他重生的可能。", position: "right", image: "../images/捷风抠像.png"},
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
            isTyping = false;
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
            window.location.href = "2-3.html";
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
    setInterval(autoSave, 30000); 
});

localStorage.setItem("currentPath", window.location.pathname); 
