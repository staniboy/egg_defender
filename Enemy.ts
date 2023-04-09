import type Game from "./Game";
import GameObject from "./GameObject";

export default class Enemy extends GameObject {
  speedX: number = Math.random() * 5 + 0.5;
  constructor(game: Game) {
    super(game, "toad");
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
  update() {
    this.collisionX -= this.speedX;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height + 40;
    // Reposition enemy on canvas once it left the canvas
    if (this.spriteX + this.width < 0) {
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
