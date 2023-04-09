import type Game from "./Game";
import GameObject from "./GameObject";

export class Particle {
  game: Game;
  collisionX: number;
  collisionY: number;
  color: string;
  radius: number = Math.floor(Math.random() * 10 + 5);
  speedX: number = Math.random() * 6 - 3;
  speedY: number = Math.random() * 2 + 0.5;
  angle: number = 0;
  va: number = Math.random() * 0.1 + 0.01;
  deleteFlag: boolean = false;
  constructor(game: Game, x: number, y: number, color: string) {
    this.game = game;
    this.collisionX = x;
    this.collisionY = y;
    this.color = color;
  }
  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.collisionX, this.collisionY, this.radius, 0, Math.PI * 2);
    context.fill();
    //context.stroke();
    context.restore();
  }
}

export class Firefly extends Particle {
  update() {
    this.angle += this.va;
    this.collisionX += Math.cos(this.angle) * this.speedX;
    this.collisionY -= this.speedY;
    if (this.collisionY < 0 - this.radius) {
      this.deleteFlag = true;
      this.game.removeGameObjects();
    }
  }
}

export class Spark extends Particle {
  update() {
    this.angle += this.va * 0.5;
    this.collisionX -= Math.cos(this.angle) * this.speedX;
    this.collisionY -= Math.sin(this.angle) * this.speedY;
    if (this.radius > 0.1) {
      this.radius -= 0.05;
    } else {
      this.deleteFlag = true;
      this.game.removeGameObjects();
      console.log("particle removed");
    }
  }
}
