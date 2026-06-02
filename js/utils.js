/**
 * 游戏通用工具函数
 */
const utils = {
    /**
     * 将网格坐标转换为字符串键
     * @param {number} x - 网格X坐标
     * @param {number} y - 网格Y坐标
     * @returns {string} 坐标字符串
     */
    asGridCoord(x, y) {
        return `${x},${y}`;
    },

    /**
     * 将网格单位转换为像素单位
     * @param {number} n - 网格数量
     * @returns {number} 像素值
     */
    withGrid(n) {
        return n * 48;
    },

    /**
     * 计算下一个位置坐标
     * @param {number} x - 当前X坐标
     * @param {number} y - 当前Y坐标
     * @param {string} direction - 方向(up, down, left, right)
     * @returns {Object} 下一个位置坐标
     */
    nextPosition(x, y, direction) {
        switch(direction) {
            case "up":
                return {x, y: y - 1};
            case "down":
                return {x, y: y + 1};
            case "left":
                return {x: x - 1, y};
            case "right":
                return {x: x + 1, y};
        }
    },

    /**
     * 触发自定义事件
     * @param {string} eventName - 事件名称
     * @param {Object} data - 事件数据
     */
    emitEvent(eventName, data) {
        const event = new CustomEvent(eventName, {
            detail: data
        });
        document.dispatchEvent(event);
    }
};
