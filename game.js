// This file contains the JavaScript code that implements the Flappy Bird game logic.

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
document.body.appendChild(canvas);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

canvas.width = 10000;
canvas.height = 800;

let bird = {
    x: 50,
    y: 150,
    width: 40, // Increased for visibility on larger screens
    height: 40,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

let pipes = [];
let frame = 0;
let gameOver = false;

function setup() {
    document.addEventListener('keydown', (e) => {
        if (gameOver) {
            resetGame();
        } else {
            bird.velocity = bird.lift;
        }
    });
    requestAnimationFrame(loop);
}

function loop() {
    if (!gameOver) {
        frame++;
        update();
        draw();
        requestAnimationFrame(loop);
    } else {
        drawGameOver();
    }
}

function resetGame() {
    bird.x = 50;
    bird.y = canvas.height / 2 - bird.height / 2;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
    gameOver = false;
    loop();
}

function update() {
    bird.velocity += bird.gravity;

    // Clamp velocity for max falling and flying speed
    const maxFallSpeed = 12;
    const maxFlySpeed = -15;
    if (bird.velocity > maxFallSpeed) bird.velocity = maxFallSpeed;
    if (bird.velocity < maxFlySpeed) bird.velocity = maxFlySpeed;

    bird.y += bird.velocity;

    // Prevent bird from falling below the bottom
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        gameOver = true;
    }
    // Prevent bird from going above the top
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }

    if (frame % 75 === 0) {
        let gap = canvas.height / 3;
        let pipeTop = Math.random() * (canvas.height / 2);
        pipes.push({
            x: canvas.width,
            y: 0,
            width: 60,
            height: pipeTop
        });
        pipes.push({
            x: canvas.width,
            y: pipeTop + gap,
            width: 60,
            height: canvas.height - pipeTop - gap
        });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= Math.max(2, canvas.width / 320 * 2);

        // Collision detection
        if (
            bird.x < pipes[i].x + pipes[i].width &&
            bird.x + bird.width > pipes[i].x &&
            bird.y < pipes[i].y + pipes[i].height &&
            bird.y + bird.height > pipes[i].y
        ) {
            gameOver = true;
        }

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
        context.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    }
}

function drawGameOver() {
    draw();
    context.fillStyle = 'rgba(0,0,0,0.5)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#fff';
    context.font = '32px Arial';
    context.fillText('Game Over', 70, canvas.height / 2);
    context.font = '16px Arial';
    context.fillText('Press any key to restart', 60, canvas.height / 2 + 40);
}

setup();