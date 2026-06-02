/**
 * 游戏主类
 */
class Overworld {
    constructor(config) {
        this.canvas = config.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
        this.directionInput = new DirectionInput();
    }

    /**
     * 启动游戏循环
     */
    startGameLoop() {
        const step = () => {
            // 清空画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // 更新游戏状态
            this.map.update({
                arrow: this.directionInput.direction,
                map: this.map,
            });

            // 绘制游戏
            this.map.draw(this.ctx);

            // 循环游戏帧
            requestAnimationFrame(step);
        };
        step();
    }

    /**
     * 初始化游戏
     */
    init() {
        // 创建地图和游戏对象
        this.map = new OverworldMap({
            // 定义墙壁（碰撞区域）
            walls: {
                "1,1": true, "2,1": true, "3,1": true, "4,1": true, "5,1": true, 
                "6,1": true, "7,1": true, "8,1": true, "9,1": true, "10,1": true,
                "1,7": true, "2,7": true, "3,7": true, "4,7": true, "5,7": true, 
                "6,7": true, "7,7": true, "8,7": true, "9,7": true, "10,7": true,
                "1,1": true, "1,2": true, "1,3": true, "1,4": true, "1,5": true, 
                "1,6": true, "1,7": true,
                "10,1": true, "10,2": true, "10,3": true, "10,4": true, "10,5": true, 
                "10,6": true, "10,7": true,
            },
            // 游戏对象（玩家和NPC）
            gameObjects: {
                hero: new Person({
                    id: "hero",
                    x: utils.withGrid(5),
                    y: utils.withGrid(3),
                    isPlayerControlled: true,
                    src: "../gameimage/sprite.png" // 替换为你的角色图片
                }),
                npc1: new Person({
                    id: "npc1",
                    x: utils.withGrid(8),
                    y: utils.withGrid(5),
                    src: "../images/吕骐豪抠像.png" // 替换为你的NPC图片
                })
            },
            cameraPerson: "hero" // 相机跟随的对象
        });

        this.map.mountObjects();
        this.startGameLoop();
    }
}

// 页面加载完成后启动游戏
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Overworld({ canvas });
    game.init();
});
