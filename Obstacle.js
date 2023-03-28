export default class Obstacle {
  constructor(/**@type {Game} */ game) {
    this.game = game;
    this.collisionX = Math.random() * this.game.width;
    this.collisionY = Math.random() * this.game.height;
    this.collisionRadius = 45;

    this.image = document.getElementById("obstacles");
    this.spriteWidth = 250;
    this.spriteHeight = 250;

    this.width = this.spriteWidth;
    this.height = this.spriteHeight;

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 75;
  }
  draw(/** @type {CanvasRenderingContext2D} */ context) {
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

    context.drawImage(
      this.image,
      0,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
  }
}
