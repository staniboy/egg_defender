import type Game from "./Game";
import GameObject from "./GameObject";

export default class Enemy extends GameObject {
  frameX: number = 0;
  frameY: number = Math.floor(Math.random() * 4);
  speedX: number = Math.random() * 3 + 0.5;
  constructor(game: Game) {
    super(game, "toads");
    this.collisionRadius = 30;

    this.spriteWidth = 140;
    this.spriteHeight = 260;

    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.collisionX = this.game.width;
    this.collisionY =
      this.game.topMargin +
      Math.random() * (this.game.height - this.game.topMargin);
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 25;
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
    this.collisionX -= this.speedX;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height + 40;
    // Reposition enemy on canvas once it left the canvas
    if (!this.game.gameOver && this.spriteX + this.width < 0) {
      this.frameY = Math.floor(Math.random() * 4);
      this.collisionX = this.game.width;
      this.collisionY =
        this.game.topMargin +
        Math.random() * (this.game.height - this.game.topMargin);
    }
    let collisionObjects = [this.game.player, ...this.game.obstacles];
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
  }
}
