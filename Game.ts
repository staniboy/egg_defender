import Player from "./Player";
import Obstacle from "./Obstacle";
import Egg from "./Egg";

interface Mouse {
  x: number;
  y: number;
  pressed: boolean;
}

interface CollisionInfo {
  collide: boolean;
  dx: number;
  dy: number;
  distance: number;
  sumOfRadii: number;
}

export default class Game {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  topMargin: number;
  player: Player;
  numberOfObstacles: number;
  obstacles: Obstacle[] = [];
  maxEggs: number = 20;
  eggs: Egg[] = [];
  eggTimer: number = 0;
  eggInterval: number = 1000; // in milliseconds
  gameObjects: any[] = [];
  mouse: Mouse;
  debug: boolean = true;

  fps: number = 70;
  timer: number = 0;
  interval: number = 1000 / this.fps;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.topMargin = 260;
    this.player = new Player(this);
    this.numberOfObstacles = 10;
    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.5,
      pressed: false,
    };

    // event listeners
    this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.mouse.pressed = true;
    });
    this.canvas.addEventListener("mouseup", (e: MouseEvent) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.mouse.pressed = false;
    });
    this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
      if (this.mouse.pressed) {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
      }
    });
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code == "KeyD") this.debug = !this.debug;
    });
  }

  render(context: CanvasRenderingContext2D, deltaTime: number) {
    if (this.timer > this.interval) {
      context.clearRect(0, 0, this.width, this.height);
      this.gameObjects = [...this.eggs, ...this.obstacles, this.player];
      this.gameObjects.sort((a, b) => a.collisionY - b.collisionY);
      this.gameObjects.forEach((obj) => {
        obj.draw(context);
        obj.update();
      });

      this.timer = 0;
    }

    if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs) {
      this.addEgg();
      this.eggTimer = 0;
    } else {
      this.eggTimer += deltaTime;
    }

    this.timer += deltaTime;
  }
  addEgg() {
    this.eggs.push(new Egg(this));
  }
  populateObstacles() {
    let attempts = 0;
    while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
      let testObstacle = new Obstacle(this);
      let overlap = false;
      this.obstacles.forEach((obstacle) => {
        const dx = testObstacle.collisionX - obstacle.collisionX;
        const dy = testObstacle.collisionY - obstacle.collisionY;
        const distance = Math.hypot(dy, dx);
        const distanceBuffer = 150;
        const sumOfRadii =
          testObstacle.collisionRadius + obstacle.collisionRadius;
        if (distance < sumOfRadii + distanceBuffer) {
          overlap = true;
        }
      });

      const margin = testObstacle.collisionRadius * 2;
      if (
        !overlap &&
        testObstacle.spriteX > 0 &&
        testObstacle.spriteX < this.width - testObstacle.width &&
        testObstacle.collisionY > this.topMargin + margin &&
        testObstacle.collisionY < this.height - margin
      ) {
        this.obstacles.push(testObstacle);
      }

      attempts++;
    }
  }

  // TODO: Typing
  /**
   * Checks if 2 game objects collide. Returns boolean and collision information.
   * @param {Object} a Object that contains collisionX and collisionY properties.
   * @param {Object} b Object that contains collisionX and collisionY properties.
   */
  checkCollision(a: any, b: any): CollisionInfo {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dy, dx);
    const sumOfRadii = a.collisionRadius + b.collisionRadius;
    return { collide: distance < sumOfRadii, dx, dy, distance, sumOfRadii };
  }

  init() {
    this.populateObstacles();
  }
}
