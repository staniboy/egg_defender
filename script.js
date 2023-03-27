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
    }

    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.playear = new Player(this);
        }
    }

    const game = new Game(canvas);
    console.log(game);

    function animate() {

    }
})