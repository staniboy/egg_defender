import Player from "./Player";
import Obstacle from "./Obstacle";

interface Mouse {
  x: number;
  y: number;
  pressed: boolean;
}

export default class Game {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  topMargin: number;
  player: Player;
  numberOfObstacles: number;
  obstacles: Obstacle[];
  mouse: Mouse;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.topMargin = 260;
    this.player = new Player(this);
    this.numberOfObstacles = 10;
    this.obstacles = [];
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
  }

  render(context: CanvasRenderingContext2D) {
    this.obstacles.forEach((obstacle) => obstacle.draw(context));
    this.player.draw(context);
    this.player.update();
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
   * @returns {Array} boolean, dx, dy, distance and sumOfRadii
   */
  checkCollision(a: any, b: any): any[] {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dy, dx);
    const sumOfRadii = a.collisionRadius + b.collisionRadius;
    return [distance < sumOfRadii, dx, dy, distance, sumOfRadii];
  }

  init() {
    this.populateObstacles();
  }
}
