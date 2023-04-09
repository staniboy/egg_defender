import Player from "./Player";
import Obstacle from "./Obstacle";
import Egg from "./Egg";
import Enemy from "./Enemy";
import Larva from "./Larva";
import type { Particle } from "./Particles";
import type GameObject from "./GameObject";

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
  numberOfObstacles: number = 10;
  obstacles: Obstacle[] = [];
  maxEggs: number = 5;
  eggs: Egg[] = [];
  eggTimer: number = 0;
  eggInterval: number = 1000; // in milliseconds
  larva: Larva[] = [];
  enemies: Enemy[] = [];
  numberOfEnemies: number = 3;
  particles: Particle[] = [];
  gameObjects: any[] = [];
  mouse: Mouse;
  debug: boolean = true;

  lost: number = 0;
  saved: number = 0;

  fps: number = 140;
  timer: number = 0;
  interval: number = 1000 / this.fps;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.topMargin = 260;
    this.player = new Player(this);
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
      this.gameObjects = [
        ...this.eggs,
        ...this.obstacles,
        this.player,
        ...this.enemies,
        ...this.larva,
        ...this.particles,
      ];
      this.gameObjects.sort((a, b) => a.collisionY - b.collisionY);
      this.gameObjects.forEach((obj) => {
        obj.draw(context);
        obj.update(deltaTime);
      });
      this.timer = 0;
    }
    this.timer += deltaTime;

    if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs) {
      this.addEgg();
      this.eggTimer = 0;
    } else {
      this.eggTimer += deltaTime;
    }

    // Scoreboard
    context.save();
    context.textAlign = "left";
    context.fillText("Score: " + this.saved, 25, 50);
    if (this.debug) {
      context.fillText("Lost: " + this.lost, 25, 100);
    }
    context.restore();
  }
  addEgg() {
    this.eggs.push(new Egg(this));
  }
  addEnemies(num: number) {
    for (let i = 0; i < num; i++) {
      this.enemies.push(new Enemy(this));
    }
  }
  addObstacles(num: number) {
    let attempts = 0;
    while (this.obstacles.length < num && attempts < 500) {
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

  checkCollision(a: GameObject, b: GameObject): CollisionInfo {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dy, dx);
    const sumOfRadii = a.collisionRadius + b.collisionRadius;
    return { collide: distance < sumOfRadii, dx, dy, distance, sumOfRadii };
  }

  removeGameObjects() {
    this.eggs = this.eggs.filter((egg) => !egg.deleteFlag);
    this.larva = this.larva.filter((larva) => !larva.deleteFlag);
    this.particles = this.particles.filter((particle) => !particle.deleteFlag);
  }

  init() {
    this.addEnemies(this.numberOfEnemies);
    this.addObstacles(this.numberOfObstacles);
  }
}
