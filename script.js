window.addEventListener('load', function() {
    /** @type {HTMLCanvasElement} */
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    class Player {
        constructor(game) {
            this.game = game;
        }
        draw(context) {
            context.beginPath();
            context.arc(100, 100, 50, 0, MATH.PI * 2);
            context.fill();
        }
    }

    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;

            this.player = new Player(this);
        }
        render(context) {
            this.player.draw(context);
        }
    }

    const game = new Game(canvas);
    console.log(game);

    function animate() {

    }
})