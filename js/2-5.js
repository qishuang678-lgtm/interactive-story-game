document.addEventListener("DOMContentLoaded", () => {
    // 对话数据
    const dialogues = [
        {name: "", text: "（捷风一脚踹开近身的敌人，飞镖回收时带起一串火花）"},
        {name: "捷风", text: "有关密钥的信息都清楚了？还有个坏消息——刚才截到K.O主体的通讯，它已经开始往日落之城调集防御单位，我们的时间不多了。", position: "right", image: "../images/捷风抠像.png"},
        {name: "", text: "（捷风解除逐风，缓缓落地，抬手擦掉脸上的雨痕）"},
        {name: "捷风", text: "现在有两个选择。其一，是按原计划，去三个地方先行摧毁密钥，成功后再去日落之城彻底净化它", position: "right", image: "../images/捷风抠像.png"},
        {name: "捷风", text: "这是最稳妥的路，但至少需要三天，谁也不知道这三天里K.O会搞出什么名堂。", position: "right", image: "../images/捷风抠像.png"},
        {name: "捷风", text: "另一条路", position: "right", image: "../images/捷风抠像.png"},
        {name: "", text: "（捷风的指尖点向被红雾覆盖的日落之城图标）"},
        {name: "捷风", text: "趁K/O的防御还没完全成型，现在就冲过去。但没有摧毁密钥，对K/O的净化就不够彻底——除非……", position: "right", image: "../images/捷风抠像.png"},
        {name: "", text: "（捷风顿了顿，声音沉了下去）"},
        {name: "捷风", text: "用芮娜的能量核心强行过载屏障，相当于用你的意识当钥匙。若是成功，K/O会被彻底净化，但你和芮娜的意识会被屏障撕碎，彻底从无畏世界消失。", position: "right", image: "../images/捷风抠像.png"},
        {name: "", text: "（巷口又传来新的嘶吼声，第三波复制体正在聚集。捷风重新握紧飞镖，眸光在雨里忽明忽灭）"},
        {name: "捷风", text: "选吧，芮娜。是一步一步来，还是赌上一切？", position: "right", image: "../images/捷风抠像.png",showOptions: true},
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
    const optionsContainer = document.getElementById("options-container");
    const continueIndicator = document.querySelector(".continue-indicator");

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
                
                // 检查是否需要显示选项
                if (dialogue.showOptions) {
                    showOptions();
                }
            } else {
                // 所有对话结束后跳转到下一场景
                //window.location.href = "飞机大战.html";
            }
    }
    // 显示选项函数
        function showOptions() {
            optionsContainer.style.display = "block";
            continueIndicator.style.display = "none";
            
            // 添加选项点击事件
            const options = document.querySelectorAll(".option");
            options.forEach(option => {
                option.addEventListener("click", function() {
                    const targetPage = this.getAttribute("data-target");
                    window.location.href = targetPage;
                });
            });
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