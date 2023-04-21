import GameObject from "./GameObject";
import type Game from "./Game";
import { Firefly, Spark } from "./Particles";

export default class Larva extends GameObject {
  frameX: number = 0;
  frameY: number = Math.floor(Math.random() * 2);
  speedY: number = 1 + Math.random();
  constructor(game: Game, x: number, y: number) {
    super(game, "larva");
    this.collisionX = x;
    this.collisionY = y;
    this.collisionRadius = 30;
    this.spriteWidth = 150;
    this.spriteHeight = 150;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 50;
  }
  draw(context: CanvasRenderingContext2D) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
    if (this.game.debug) {
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2
      );
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
    }
  }
  update() {
    this.collisionY -= this.speedY;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 50;
    // Moved to safety
    if (this.collisionY < this.game.topMargin) {
      this.deleteFlag = true;
      this.game.removeGameObjects();
      if (!this.game.gameOver) this.game.saved++;
      for (let i = 0; i < 3; i++) {
        this.game.particles.push(
          new Firefly(this.game, this.collisionX, this.collisionY, "yellow")
        );
      }
    }
    // Collision Handling
    let collisionObjects = [
      this.game.player,
      ...this.game.obstacles,
      ...this.game.eggs,
    ];
    collisionObjects.forEach((obj) => {
      const { collide, distance, dx, dy, sumOfRadii } =
        this.game.checkCollision(this, obj);
      if (collide) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        this.collisionX = obj.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = obj.collisionY + (sumOfRadii + 1) * unit_y;
      }
    });
    // Got eaten
    this.game.enemies.forEach((enemy) => {
      if (this.game.checkCollision(this, enemy).collide) {
        this.deleteFlag = true;
        this.game.removeGameObjects();
        if (!this.game.gameOver) this.game.lost++;
        for (let i = 0; i < 5; i++) {
          this.game.particles.push(
            new Spark(this.game, this.collisionX, this.collisionY, "white")
          );
        }
      }
    });
  }
}
