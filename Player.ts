import type Game from "./Game";

export default class Player {
  game: Game;

  image: CanvasImageSource;
  spriteWidth: number;
  spriteHeight: number;
  width: number;
  height: number;
  spriteX: number = 0;
  spriteY: number = 0;
  frameX: number = 0;
  frameY: number = 0;

  collisionX: number;
  collisionY: number;
  collisionRadius: number;

  speedX: number = 0;
  speedY: number = 0;
  speedModifier: number = 5;

  dx: number = 0;
  dy: number = 0;
  distance: number = 0;

  constructor(game: Game) {
    this.game = game;

    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.collisionRadius = 45;

    this.image = document.getElementById("bull") as CanvasImageSource;
    this.spriteWidth = 255;
    this.spriteHeight = 255;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
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

    const angle = Math.atan2(this.dy, this.dx);

    if (angle < -2.74 || angle > 2.74) this.frameY = 6;
    else if (angle < -1.96) this.frameY = 7;
    else if (angle < -1.17) this.frameY = 0;
    else if (angle < -0.39) this.frameY = 1;
    else if (angle < 0.39) this.frameY = 2;
    else if (angle < 1.17) this.frameY = 3;
    else if (angle < 1.96) this.frameY = 4;
    else if (angle < 2.74) this.frameY = 5;

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
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.width * 0.5 - 80;

    // Collision Detection and Handling
    this.game.obstacles.forEach((obstacle) => {
      let [collision, dx, dy, distance, sumOfRadii] = this.game.checkCollision(
        this,
        obstacle
      );

      if (collision) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
      }
    });
  }
}
