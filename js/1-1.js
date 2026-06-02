document.addEventListener("DOMContentLoaded", () => {
    // 对话数据
    const dialogues = [
        { name: "那年追风", text: "匹配成功了！朋友们，集合准备战斗！", position: "left", image: "../images/吕骐豪抠像.png" },
        { name: "朋友", text: "快快快，最后一把冲分！我选K/O，保你芮娜输出！。", position: "right", image: "../images/朋友.png" },
        { name: "那年追风", text: "别坑啊，昨天你探针匕首扔我身上的事儿我还没忘呢！", position: "left", image: "../images/吕骐豪抠像.png" },
        { name: "朋友", text: "那是意外！看这次的，等会儿开团我先控场，你跟上打伤害！", position: "right", image: "../images/朋友.png" },
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
            window.location.href = "1-2.html";
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
