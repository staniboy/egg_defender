import type Game from "./Game";

export default class Enemy {
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }
}
