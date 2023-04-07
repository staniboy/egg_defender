import type Game from "./Game";

export default class Egg {
  game: Game;

  collisionX: number;
  collisionY: number;
  collisionRadius: number = 40;
  margin: number = this.collisionRadius * 2;

  image: CanvasImageSource;
  spriteWidth: number = 110;
  spriteHeight: number = 135;
  spriteX: number;
  spriteY: number;

  width: number = this.spriteWidth;
  height: number = this.spriteHeight;

  constructor(game: Game) {
    this.game = game;

    this.collisionX =
      this.margin + Math.random() * (this.game.width - this.margin * 2);
    this.collisionY =
      this.game.topMargin +
      Math.random() * (this.game.height - this.game.topMargin - this.margin);

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 25;

    this.image = document.getElementById("egg") as CanvasImageSource;
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.spriteX, this.spriteY);
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
}
