// This file contains the JavaScript code that implements the Flappy Bird game logic.

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = 320;
canvas.height = 480;

let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

let pipes = [];
let frame = 0;

function setup() {
    document.addEventListener('keydown', () => {
        bird.velocity += bird.lift;
    });
    requestAnimationFrame(loop);
}

function loop() {
    frame++;
    update();
    draw();
    requestAnimationFrame(loop);
}

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height) {
        bird.y = canvas.height;
        bird.velocity = 0;
    }

    if (frame % 75 === 0) {
        let pipeHeight = Math.random() * (canvas.height / 2);
        pipes.push({
            x: canvas.width,
            y: pipeHeight,
            width: 20,
            height: canvas.height - pipeHeight - 100
        });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;

        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
        }
    }
}

function draw() {
    context.fillStyle = '#70c5ce';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#ffcc00';
    context.fillRect(bird.x, bird.y, bird.width, bird.height);

    context.fillStyle = '#228B22';
    for (let pipe of pipes) {
        context.fillRect(pipe.x, 0, pipe.width, pipe.y);
        context.fillRect(pipe.x, pipe.y + pipe.height, pipe.width, canvas.height - pipe.y - pipe.height);
    }
}

setup();