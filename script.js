const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas size
canvas.width = 320;
canvas.height = 480;

// Game variables
let birdX = 50;
let birdY = 150;
let birdWidth = 30;
let birdHeight = 30;
let birdVelocity = 0;
let gravity = 0.3;
let lift = -7;
let isFlapping = false;
let score = 0;
let gameOver = false;

let pipes = [];
let pipeWidth = 50;
let pipeGap = 100;
let pipeSpeed = 2;

const birdImage = new Image();
birdImage.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flappy_Bird.png/2560px-Flappy_Bird.png';

const pipeImage = new Image();
pipeImage.src = 'https://upload.wikimedia.org/wikipedia/commons/9/99/Flappy_Bird_Pipe.png';

// Event listener to control bird
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space' && !gameOver) {
    isFlapping = true;
  }
});

// Game loop
function gameLoop() {
  if (gameOver) {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
    ctx.fillText('Score: ' + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Bird physics
  if (isFlapping) {
    birdVelocity = lift;
    isFlapping = false;
  }
  birdVelocity += gravity;
  birdY += birdVelocity;

  // Draw bird
  ctx.drawImage(birdImage, birdX, birdY, birdWidth, birdHeight);

  // Pipe logic
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({ x: canvas.width, y: pipeHeight });
  }

  // Move pipes
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= pipeSpeed;
    if (pipes[i].x + pipeWidth < 0) {
      pipes.shift();
      score++;
    }

    // Collision detection
    if (
      birdX + birdWidth > pipes[i].x &&
      birdX < pipes[i].x + pipeWidth &&
      (birdY < pipes[i].y || birdY + birdHeight > pipes[i].y + pipeGap)
    ) {
      gameOver = true;
    }

    // Draw pipes
    ctx.drawImage(pipeImage, pipes[i].x, 0, pipeWidth, pipes[i].y);
    ctx.drawImage(pipeImage, pipes[i].x, pipes[i].y + pipeGap, pipeWidth, canvas.height - pipes[i].y - pipeGap);
  }

  // Ground collision
  if (birdY + birdHeight > canvas.height) {
    gameOver = true;
  }

  // Score
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 10, 30);

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
