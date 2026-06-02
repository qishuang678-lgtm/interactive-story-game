document.addEventListener("DOMContentLoaded", () => {
    // 对话数据
    const dialogues = [
         { name: "", text: "墙上屏幕闪烁，弹出破碎文字：霓虹町…… 捷风……"},
        { name: "那年芮娜", text: "（心脏骤缩，盯着屏幕）这行字…… 既在我的记忆里，也在芮娜的记忆里！捷风？必须找到她！", position: "left", image: "../images/吕骐豪抠像.png" },
        { name: "那年芮娜", text: "（扶墙站起）还有 ，K/O 的主体在日落之城，要打败它、并将其手动重启服务器才能救瓦世界…… 这到底是任务，还是我活下去的唯一办法？", position: "left", image: "../images/吕骐豪抠像.png"  },
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

        // 特殊处理破碎文字
        if (currentDialogueIndex === 0) {
            dialogueTextElement.innerHTML = 
                '<span class="broken-text flicker">墙上屏幕闪烁，弹出破碎文字：霓虹町…… 捷风……</span>';
            isTyping = false;
            currentDialogueIndex++;
        } else {
            // 开始打字
            await typeWriter(dialogue.text);
            currentDialogueIndex++;
        }
    } else {
        window.location.href = "1-8.html";
    }
}

    
    settingsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        settingsMenu.classList.toggle("active");
    });

   
    document.addEventListener("click", () => {
        settingsMenu.classList.remove("active");
    });

    
    settingsMenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    
    dialogueBox.addEventListener("click", updateDialogue);

    
    updateDialogue();

    
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
