window.addEventListener("load", function () {
  /** @type {HTMLCanvasElement} */
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";

  class Player {
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
    }
  }

  class Game {
    constructor(/** @type {HTMLCanvasElement} */ canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player = new Player(this);
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.5,
        pressed: false,
      };

      // event listeners
      this.canvas.addEventListener(
        "mousedown",
        (/** @type {MouseEvent} */ e) => {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
          this.mouse.pressed = true;
        }
      );
      this.canvas.addEventListener("mouseup", (/** @type {MouseEvent} */ e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = false;
      });
      this.canvas.addEventListener(
        "mousemove",
        (/** @type {MouseEvent} */ e) => {
          if (this.mouse.pressed) {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
          }
        }
      );
    }

    render(/** @type {CanvasRenderingContext2D} */ context) {
      this.player.draw(context);
      this.player.update();
    }
  }

  const game = new Game(canvas);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate);
  }
  animate();
});
