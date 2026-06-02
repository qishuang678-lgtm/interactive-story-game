document.addEventListener("DOMContentLoaded", () => {
    // 对话数据
    const dialogues = [
        {name: "芮娜", text: "燃烧吧！以雷霆，击碎黑暗！", position: "right", image: "../images/芮娜抠像.png"},
        {name: "K/O", text: "不！！！！！！", position: "left", image: "../images/KO抠像.png"},
        {name: "芮娜", text: "（意识在渐渐模糊……）"},
        {name: "芮娜", text: "（一切终于尘埃落定……）"},
        {name: "芮娜", text: "（我的使命完成了……）"},
        {name: "芮娜", text: "（亲爱的瓦友们：）"},
        {name: "芮娜", text: "（我先走一步！）"},
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
                document.querySelector('.ending-container').classList.add('visible');
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
        // 绑定结局按钮点击事件
    function bindEndingButtons() {
        const endingBtns = document.querySelectorAll('.ending-btn');
        endingBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetPage = this.getAttribute('data-target');
                if (targetPage) {
                    // 跳转前可添加过渡效果（可选）
                    window.location.href = targetPage;
                }
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
    bindEndingButtons();
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