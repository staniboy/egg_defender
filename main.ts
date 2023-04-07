import Game from "./Game";

window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";

  const game = new Game(canvas);
  game.init();

  let lastTime = 0;

  function animate(timestamp: number) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);
  }
  animate(0);
});
