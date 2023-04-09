import type Game from "./Game";

export default class GameObject {
  game: Game;

  collisionX: number = 0;
  collisionY: number = 0;
  collisionRadius: number = 0;

  image: CanvasImageSource;

  spriteWidth: number = 0;
  spriteHeight: number = 0;

  width: number = 0;
  height: number = 0;

  spriteX: number = 0;
  spriteY: number = 0;

  constructor(game: Game, image: string) {
    this.game = game;
    this.image = document.getElementById(image) as CanvasImageSource;
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
  update() {}
}
