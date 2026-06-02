/**
 * 方向输入控制器
 * 处理键盘输入并跟踪当前方向
 */
class DirectionInput {
    constructor() {
        this.heldDirections = [];
        this.map = {
            ArrowUp: "up",
            ArrowDown: "down",
            ArrowLeft: "left",
            ArrowRight: "right",
            KeyW: "up",
            KeyS: "down",
            KeyA: "left",
            KeyD: "right"
        };
        this.init();
    }

    /**
     * 初始化事件监听
     */
    init() {
        document.addEventListener("keydown", e => {
            const dir = this.map[e.code];
            if (dir && this.heldDirections.indexOf(dir) === -1) {
                this.heldDirections.unshift(dir);
            }
        });

        document.addEventListener("keyup", e => {
            const dir = this.map[e.code];
            const index = this.heldDirections.indexOf(dir);
            if (index > -1) {
                this.heldDirections.splice(index, 1);
            }
        });
    }

    /**
     * 获取当前方向
     * @returns {string} 当前方向
     */
    get direction() {
        return this.heldDirections[0];
    }
}

/**
 * 精灵类 - 处理动画和渲染
 */
class Sprite {
    constructor(config) {
        this.gameObject = config.gameObject;
        this.src = config.src || "./character.png";
        this.image = new Image();
        this.image.src = this.src;
        this.isLoaded = false;
        
        // 图片加载完成后标记
        this.image.onload = () => {
            this.isLoaded = true;
        };

        // 动画配置
        this.animations = {
            "idle-down": [[0, 0]],
            "idle-right": [[0, 1]],
            "idle-up": [[0, 2]],
            "idle-left": [[0, 3]],
            "walk-down": [[1, 0], [2, 0], [3, 0], [0, 0]],
            "walk-right": [[1, 1], [2, 1], [3, 1], [0, 1]],
            "walk-up": [[1, 2], [2, 2], [3, 2], [0, 2]],
            "walk-left": [[1, 3], [2, 3], [3, 3], [0, 3]]
        };
        this.currentAnimation = "idle-down";
        this.currentAnimationFrame = 0;
        this.animationFrameLimit = 8;
        this.animationFrameProgress = 0;
    }

    /**
     * 设置当前动画
     * @param {string} key - 动画键名
     */
    setAnimation(key) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    /**
     * 更新动画进度
     */
    updateAnimationProgress() {
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress--;
            return;
        }

        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame++;

        // 循环动画
        if (this.animations[this.currentAnimation].length <= this.currentAnimationFrame) {
            this.currentAnimationFrame = 0;
        }
    }

    /**
     * 绘制精灵
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Object} cameraPerson - 相机跟随的人物
     */
    draw(ctx, cameraPerson) {
        const x = this.gameObject.x - cameraPerson.x + 400;
        const y = this.gameObject.y - cameraPerson.y + 225;

        this.updateAnimationProgress();

        if (!this.isLoaded) return;

        const [frameX, frameY] = this.animations[this.currentAnimation][this.currentAnimationFrame];
        ctx.drawImage(
            this.image,
            frameX * 48, frameY * 48,
            48, 48,
            x, y,
            48, 48
        );
    }
}

/**
 * 游戏对象基类
 */
class GameObject {
    constructor(config) {
        this.id = config.id || null;
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src
        });
    }

    /**
     * 挂载对象到地图
     * @param {Object} map - 地图对象
     */
    mount(map) {
        this.isMounted = true;
    }

    /**
     * 更新对象状态
     */
    update() {}
}

/**
 * 人物类
 */
class Person extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;
        this.isPlayerControlled = config.isPlayerControlled || false;

        // 方向与坐标变化映射
        this.directionUpdate = {
            "up": ["y", -2],
            "down": ["y", 2],
            "left": ["x", -2],
            "right": ["x", 2],
        };
    }

    /**
     * 更新人物状态
     * @param {Object} state - 游戏状态
     */
    update(state) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            // 只有玩家可控且有输入方向时才移动
            if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                });
            }
            this.updateSprite();
        }
    }

    /**
     * 开始行为（如移动）
     * @param {Object} state - 游戏状态
     * @param {Object} behavior - 行为配置
     */
    startBehavior(state, behavior) {
        if (!this.isMounted) return;

        this.direction = behavior.direction;
        if (behavior.type === "walk") {
            // 检查是否可以移动（没有碰撞）
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                return;
            }

            this.movingProgressRemaining = 48; // 48像素为一个格子
            this.updateSprite();
        }
    }

    /**
     * 更新位置
     */
    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining -= 2;

        // 移动完成时触发事件
        if (this.movingProgressRemaining === 0) {
            utils.emitEvent("PersonWalkingComplete", {
                whoId: this.id
            });
        }
    }

    /**
     * 更新精灵动画
     */
    updateSprite() {
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("walk-" + this.direction);
            return;
        }
        this.sprite.setAnimation("idle-" + this.direction);
    }
}

/**
 * 地图类
 */
class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};
        this.cameraPerson = config.cameraPerson;
        this.isCutscenePlaying = false;
    }

    /**
     * 检查指定位置是否被占用（碰撞检测）
     * @param {number} currentX - 当前X坐标
     * @param {number} currentY - 当前Y坐标
     * @param {string} direction - 方向
     * @returns {boolean} 是否被占用
     */
    isSpaceTaken(currentX, currentY, direction) {
        const {x, y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[utils.asGridCoord(x / 48, y / 48)] || false;
    }

    /**
     * 挂载游戏对象到地图
     */
    mountObjects() {
        Object.values(this.gameObjects).forEach(object => {
            object.mount(this);
        });
    }

    /**
     * 绘制地图和游戏对象
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     */
    draw(ctx) {
        Object.values(this.gameObjects).forEach(object => {
            object.sprite.draw(ctx, this.gameObjects[this.cameraPerson]);
        });
    }

    /**
     * 更新地图上所有对象
     * @param {Object} state - 游戏状态
     */
    update(state) {
        Object.values(this.gameObjects).forEach(object => {
            object.update(state);
        });
    }
}
