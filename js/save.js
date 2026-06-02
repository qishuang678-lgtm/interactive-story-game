// 存档相关配置
let selectedSlot = null;

// DOM 元素
const confirmBtn = document.getElementById('confirm-btn');
const cancelBtn = document.getElementById('cancel-btn');
const backBtn = document.getElementById('back-btn');
const pageTitle = document.getElementById('page-title');

// 获取URL参数判断是保存还是加载
const urlParams = new URLSearchParams(window.location.search);
const action = urlParams.get('action') || 'save';

// 初始化页面
function init() {
    // 根据操作类型更新页面标题和按钮文字
    if (action === 'load') {
        pageTitle.textContent = '选择加载位置';
        confirmBtn.innerHTML = '<i class="fa fa-download"></i><span>确认加载</span>';
    } else {
        pageTitle.textContent = '选择存档位置';
        confirmBtn.innerHTML = '<i class="fa fa-save"></i><span>确认存档</span>';
    }

    // 加载存档数据
    loadSaveData();
    
    // 绑定事件
    bindEvents();

    // 初始禁用确认按钮
    confirmBtn.disabled = true;
}

// 加载存档数据
function loadSaveData() {
    for (let i = 1; i <= 6; i++) {
        const saveData = localStorage.getItem(`saveSlot${i}`);
        const slotImage = document.getElementById(`slot-${i}-image`);
        const slotTime = document.getElementById(`slot-${i}-time`);
        const tooltip = document.getElementById(`tooltip-${i}`);
        
        if (saveData) {
            const data = JSON.parse(saveData);
            // 使用该存档位对应的图片
            slotImage.style.backgroundImage = `url("${SLOT_IMAGES[i]}")`;
            slotTime.textContent = formatShortTime(data.timestamp);
            tooltip.textContent = `存档时间: ${formatFullTime(data.timestamp)}`;
        } else {
            // 未存档时保持黑色背景，不设置图片
            slotImage.style.backgroundImage = 'none';
            slotTime.textContent = "空";
            tooltip.textContent = "无存档数据";
        }
    }
}

// 绑定事件
function bindEvents() {
    // 存档槽点击事件
    document.querySelectorAll('.save-slot').forEach(slot => {
        slot.addEventListener('click', () => {
            const slotNumber = slot.getAttribute('data-slot');
            selectSlot(slotNumber);
        });

        // 鼠标悬停显示提示
        slot.addEventListener('mouseenter', () => {
            const slotNumber = slot.getAttribute('data-slot');
            document.getElementById(`tooltip-${slotNumber}`).classList.remove('hidden');
        });

        slot.addEventListener('mouseleave', () => {
            const slotNumber = slot.getAttribute('data-slot');
            document.getElementById(`tooltip-${slotNumber}`).classList.add('hidden');
        });
    });

    // 确认按钮事件
    confirmBtn.addEventListener('click', () => {
        if (selectedSlot) {
            if (action === 'save') {
                saveGame(selectedSlot);
            } else {
                loadGame(selectedSlot);
            }
        }
    });

    // 取消和返回按钮事件
    cancelBtn.addEventListener('click', goBack);
    backBtn.addEventListener('click', goBack);

    // ESC键返回游戏
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            goBack();
        }
    });
}

// 选择存档槽
function selectSlot(slotNumber) {
    // 清除之前的选择
    if (selectedSlot) {
        document.querySelector(`.save-slot[data-slot="${selectedSlot}"] .selected-indicator`).classList.add('hidden');
    }

    // 设置新选择
    selectedSlot = slotNumber;
    document.querySelector(`.save-slot[data-slot="${slotNumber}"] .selected-indicator`).classList.remove('hidden');
    
    // 启用确认按钮
    confirmBtn.disabled = false;
}

// 保存游戏（核心修改：仅依赖currentPath，验证路径存在性）
function saveGame(slotNumber) {
    // 1. 从LocalStorage获取当前页面路径（仅验证这一个字段）
    const currentPath = localStorage.getItem("currentPath");
    
    // 2. 验证路径是否存在（若不存在，提示存档失败）
    if (!currentPath) {
        showNotification("未能获取当前页面信息，存档失败！", 'error');
        return;
    }

    // 3. 构建存档数据（仅包含：路径、时间戳、基础游戏状态）
    const saveData = {
        currentPath: currentPath, // 核心：关联当前页面的路径
        timestamp: new Date().getTime(), // 存档时间戳（用于显示）
        gameState: { // 保留原游戏状态字段，可根据实际需求扩展
            level: 5,
            score: 1560,
            position: { x: 120, y: 450 },
            inventory: ['sword', 'potion', 'shield']
        }
    };

    // 4. 保存到LocalStorage
    localStorage.setItem(`saveSlot${slotNumber}`, JSON.stringify(saveData));
    
    // 5. 提示成功+重新加载存档列表（更新显示）
    showNotification(`已成功保存到 存档 ${slotNumber}`);
    loadSaveData();
}

// 加载游戏（核心修改：用currentPath跳转页面）
function loadGame(slotNumber) {
    const saveData = localStorage.getItem(`saveSlot${slotNumber}`);
    
    if (saveData) {
        const data = JSON.parse(saveData);
        // 1. 验证存档中是否包含currentPath（防止旧存档兼容问题）
        if (!data.currentPath) {
            showNotification("存档数据异常，无法加载页面！", 'error');
            return;
        }

        // 2. 提示加载成功+跳转到存档对应的页面
        showNotification(`已加载 存档 ${slotNumber} (${formatShortTime(data.timestamp)})`);
        setTimeout(() => {
            window.location.pathname = data.currentPath; // 核心：通过路径跳转页面
        }, 1000); // 延迟1秒跳转，让用户看到提示
    } else {
        showNotification(`存档 ${slotNumber} 为空，无法加载`, 'error');
    }
}

// 返回游戏
function goBack() {
    // 在实际应用中，这里应该返回游戏主界面
    window.history.back();
}

// 显示通知
function showNotification(message, type = 'success') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg z-50 transition-all duration-300 flex items-center gap-2 ${
        type === 'success' ? 'bg-secondary text-white' : 'bg-red-600 text-white'
    }`;
    
    notification.innerHTML = `
        <i class="fa ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('opacity-100');
    }, 10);
    
    // 3秒后移除
    setTimeout(() => {
        notification.classList.add('opacity-0');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 格式化短时间显示
function formatShortTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// 格式化完整时间显示
function formatFullTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${
        date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')
    }`;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);