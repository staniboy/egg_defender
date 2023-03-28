export default class Player {
  constructor(/**@type {Game} */ game) {
    this.game = game;
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.collisionRadius = 30;

    this.speedX = 0;
    this.speedY = 0;
    this.speedModifier = 5;

    this.dx = 0;
    this.dy = 0;
    this.distance = 0;
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

    context.beginPath();
    context.moveTo(this.collisionX, this.collisionY);
    context.lineTo(this.game.mouse.x, this.game.mouse.y);
    context.stroke();
  }
  update() {
    this.dx = this.game.mouse.x - this.collisionX;
    this.dy = this.game.mouse.y - this.collisionY;
    this.distance = Math.hypot(this.dy, this.dx);
    if (this.distance > this.speedModifier) {
      this.speedX = this.dx / this.distance;
      this.speedY = this.dy / this.distance;
    } else {
      this.speedX = 0;
      this.speedY = 0;
    }
    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;

    // Collision Detection
    this.game.obstacles.forEach((obstacle) => {
      if (this.game.checkCollision(this, obstacle)) {
        console.log("collision detected");
      }
    });
  }
}
