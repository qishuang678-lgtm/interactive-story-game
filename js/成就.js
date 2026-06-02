// 成就数据
const achievements = [
    {
        id: 1,
        title: "初次启程",
        description: "完成游戏的第一个章节，开启冒险之旅。这只是你伟大冒险的开始，前方还有更多挑战等待着你。",
        image: "../images/achievements/1.jpg",
        unlocked: true
    },
    {
        id: 2,
        title: "收集达人",
        description: "收集游戏中50%的道具。你的探索精神令人钦佩，继续寻找那些隐藏的宝藏吧。",
        image: "../images/achievements/2.jpg",
        unlocked: false
    },
    {
        id: 3,
        title: "战斗大师",
        description: "不受到任何伤害击败最终BOSS。完美的战斗技巧！你已经掌握了战斗的精髓。",
        image: "../images/achievements/3.jpg",
        unlocked: false
    },
    {
        id: 4,
        title: "解谜专家",
        description: "所有谜题都在提示前解决。你的智慧和洞察力无人能及，任何谜题在你面前都不堪一击。",
        image: "../images/achievements/4.jpg",
        unlocked: true
    },
    {
        id: 5,
        title: "隐藏发现者",
        description: "发现所有隐藏区域。世界的每个角落都逃不过你的眼睛，你是真正的探索者。",
        image: "../images/achievements/5.jpg",
        unlocked: false
    },
    {
        id: 6,
        title: "好友相助",
        description: "完成所有支线任务。你乐于助人的品质让你获得了所有人的尊重和友谊。",
        image: "../images/achievements/6.jpg",
        unlocked: true
    },
    {
        id: 7,
        title: "剧情大师",
        description: "观看所有角色结局。你深入了解了每个角色的故事，体验了这个世界的方方面面。",
        image: "../images/achievements/7.jpg",
        unlocked: false
    },
    {
        id: 8,
        title: "完美通关",
        description: "以最高难度完成游戏。真正的勇士敢于面对最艰难的挑战，你已经证明了自己的实力。",
        image: "../images/achievements/8.jpg",
        unlocked: false
    }
];

// DOM元素
const grid = document.getElementById('achievementsGrid');
const modal = document.getElementById('achievementModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const closeModal = document.getElementById('closeModal');
const backButton = document.querySelector('.nav-btn');

// 统计元素
const totalAchievementsEl = document.getElementById('totalAchievements');
const unlockedAchievementsEl = document.getElementById('unlockedAchievements');
const lockedAchievementsEl = document.getElementById('lockedAchievements');
const completionRateEl = document.getElementById('completionRate');

// 更新成就统计
function updateStats() {
    const total = achievements.length;
    const unlocked = achievements.filter(a => a.unlocked).length;
    const locked = total - unlocked;
    const rate = Math.round((unlocked / total) * 100);

    totalAchievementsEl.textContent = total;
    unlockedAchievementsEl.textContent = unlocked;
    lockedAchievementsEl.textContent = locked;
    completionRateEl.textContent = `${rate}%`;
}

// 生成成就格子
function renderAchievements() {
    grid.innerHTML = ''; // 清空容器
    
    achievements.forEach(achievement => {
        const item = document.createElement('div');
        item.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        item.dataset.id = achievement.id;

        // 添加悬停提示
        const tooltip = document.createElement('div');
        tooltip.className = 'achievement-tooltip';
        tooltip.innerHTML = `
            <strong>${achievement.title}</strong>
            <p>${achievement.description}</p>
        `;
        item.appendChild(tooltip);

        // 已激活状态显示图片
        if (achievement.unlocked) {
            const img = document.createElement('img');
            img.src = achievement.image;
            img.alt = achievement.title;
            // 图片加载动画
            img.style.opacity = '0';
            img.onload = function() {
                img.style.transition = 'opacity 0.5s ease';
                img.style.opacity = '1';
            };
            item.appendChild(img);
        }

        // 点击事件 - 打开模态框（仅对已激活成就）
        item.addEventListener('click', () => {
            if (achievement.unlocked) {
                modalImage.src = achievement.image;
                modalTitle.textContent = achievement.title;
                modalText.textContent = achievement.description;
                
                // 模态框动画
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.classList.add('active');
                }, 10);
            }
        });

        grid.appendChild(item);
    });

    // 更新统计
    updateStats();
}

// 关闭模态框
function closeModalFunc() {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

closeModal.addEventListener('click', closeModalFunc);

// 点击模态框外部关闭
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalFunc();
    }
});

// ESC键关闭模态框
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModalFunc();
    }
});

// 返回游戏按钮
backButton.addEventListener('click', () => {
    backButton.classList.add('clicked');
    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 300);
});

// 初始化
renderAchievements();
