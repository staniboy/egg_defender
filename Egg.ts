import type Game from "./Game";
import GameObject from "./GameObject";
import Larva from "./Larva";

export default class Egg extends GameObject {
  game: Game;

  collisionRadius: number = 40;
  margin: number = this.collisionRadius * 2;

  spriteWidth: number = 110;
  spriteHeight: number = 135;
  spriteX: number;
  spriteY: number;

  width: number = this.spriteWidth;
  height: number = this.spriteHeight;

  hatchTimer: number = 0;
  hatchInterval: number = 5000;

  constructor(game: Game) {
    super(game, "egg");
    this.game = game;
    this.collisionX =
      this.margin + Math.random() * (this.game.width - this.margin * 2);
    this.collisionY =
      this.game.topMargin +
      Math.random() * (this.game.height - this.game.topMargin - this.margin);
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 25;
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
      const displayTimer = (this.hatchTimer * 0.001).toFixed(0);
      context.fillText(displayTimer, this.collisionX, this.collisionY + 13);
    }
  }
  update(deltaTime: number) {
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 25;

    // Collision Handling
    let collisionObjects = [
      this.game.player,
      ...this.game.obstacles,
      ...this.game.enemies,
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
    // Hatching Handling
    if (
      this.hatchTimer > this.hatchInterval ||
      this.collisionY < this.game.topMargin
    ) {
      this.deleteFlag = true;
      this.game.larva.push(
        new Larva(this.game, this.collisionX, this.collisionY)
      );
      this.game.removeGameObjects();
    } else {
      this.hatchTimer += deltaTime;
    }
  }
}
