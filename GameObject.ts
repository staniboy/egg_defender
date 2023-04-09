import type Game from "./Game";

export default class GameObject {
  game: Game;

  collisionX: number = 0;
  collisionY: number = 0;
  collisionRadius: number = 0;

  constructor(game: Game) {
    this.game = game;
  }
  draw(context: CanvasRenderingContext2D) {}
  update() {}
}
