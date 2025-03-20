const cube = document.getElementById('cube');
const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameOverDisplay = document.getElementById('game-over');
const collisionSound = document.getElementById('collisionSound');
const gameOverSound = document.getElementById('gameOverSound');
const topScoreDisplay = document.getElementById('top-score');
let x = 100;
let y = 100;
let score = 0;
let gameTime = 10; // Change gametime here, total time of the game
let targetTimeout;
let gameInterval;
let isGameOver = false;
let targetHit = false;
let topScore = 0;
let resetTime = localStorage.getItem('resetTime') ? parseInt(localStorage.getItem('resetTime')) : 0;

function checkResetTime() {
    const currentTime = Date.now();
    if (currentTime > resetTime) {
        topScore = 0;
        localStorage.setItem('topScore', topScore);
        resetTime = currentTime + 3600000; // 1 hour in milliseconds
        localStorage.setItem('resetTime', resetTime);
    }
}


function spawnTarget() {
    target.style.left = Math.floor(Math.random() * 16) * 50 + 'px';
    target.style.top = Math.floor(Math.random() * 16) * 50 + 'px';
    target.style.opacity = 1; // Đặt độ mờ về 1 (hiển thị đầy đủ)
    target.style.transition = 'opacity 0s linear, transform 0s linear'; // Thêm transition cho transform
    target.style.transform = 'scale(1)'; // Đặt scale về 1 ban đầu
    target.style.display = 'block';
    targetHit = false;
    let topScore = 0;

    clearTimeout(targetTimeout);
    targetTimeout = setTimeout(() => {
        target.style.display = 'none';
        setTimeout(spawnTarget, 500); // Thêm độ trễ 1 giây trước khi tạo mục tiêu mới
    }, 3000);
}

function checkCollision() {
    if (targetHit) return;

    const cubeRect = cube.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    if (target.style.display === 'block' &&
        cubeRect.left < targetRect.right &&
        cubeRect.right > targetRect.left &&
        cubeRect.top < targetRect.bottom &&
        cubeRect.bottom > targetRect.top) {
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
        collisionSound.currentTime = 0;
        collisionSound.play();
        gameTime += 1; // Thêm 1 giây vào thời gian trò chơi
        timerDisplay.textContent = 'Time: ' + gameTime; // Cập nhật hiển thị thời gian
        target.style.transition = 'opacity 1s linear, transform 0.2s ease-in-out'; // Thêm transition cho transform
        target.style.transform = 'scale(1.3)'; // Tăng scale lên 1.3 (30%)
        target.style.opacity = 0; // Đặt độ mờ về 0 (ẩn)
        targetHit = true;
        setTimeout(() => { spawnTarget(); }, 500); // Thêm độ trễ nhỏ để hiệu ứng mờ dần hiển thị

    }
}

function updateGameTime() {
    gameTime--;
    timerDisplay.textContent = 'Time: ' + gameTime;
    if (gameTime <= 0) {
        clearInterval(gameInterval);
        gameOver();
    }
}

function gameOver() {
    gameOverDisplay.style.display = 'block';
    cube.style.display = 'none';
    target.style.display = 'none';
    isGameOver = true;
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    if (score > topScore) {
        topScore = score;
    }
    topScoreDisplay.textContent = topScore;
}

function resetGame() {
    x = 100;
    y = 100;
    score = 0;
    gameTime = 10;
    isGameOver = false;

    cube.style.left = x + 'px';
    cube.style.top = y + 'px';
    cube.style.display = 'block';
    target.style.display = 'none';
    gameOverDisplay.style.display = 'none';
    scoreDisplay.textContent = 'Score: 0';
    timerDisplay.textContent = 'Time: 10';

    spawnTarget();
    gameInterval = setInterval(updateGameTime, 1000);
}

document.addEventListener('keydown', (event) => {
      if (isGameOver && event.code === 'Space') {
        resetGame();
        return;
    }
    switch (event.key) {
        case 'ArrowLeft':
            x -= 50;
            if (x < 0) x = 0;
            break;
        case 'ArrowRight':
            x += 50;
            if (x > 750) x = 750;
            break;
        case 'ArrowUp':
            y -= 50;
            if (y < 0) y = 0;
            break;
        case 'ArrowDown':
            y += 50;
            if (y > 750) y = 750;
            break;
    }
    cube.style.left = x + 'px';
    cube.style.top = y + 'px';
    checkCollision();
});

spawnTarget();
gameInterval = setInterval(updateGameTime, 1000);