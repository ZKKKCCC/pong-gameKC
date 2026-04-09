// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 15;
const paddleHeight = 80;
const ballSize = 8;

const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 6,
    dy: 0
};

const computer = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 4.5
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballSize,
    dx: 4,
    dy: 4
};

let playerScore = 0;
let computerScore = 0;

// Input handling
const keys = {};
let mouseY = canvas.height / 2;

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Game functions
function drawRectangle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = '#00ff00';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function updatePlayerPaddle() {
    // Arrow key control
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }

    // Mouse control
    const mouseSpeed = 5;
    const mouseDiff = mouseY - (player.y + player.height / 2);
    
    if (Math.abs(mouseDiff) > 5) {
        if (mouseDiff > 0) {
            player.y = Math.min(player.y + mouseSpeed, canvas.height - player.height);
        } else {
            player.y = Math.max(player.y - mouseSpeed, 0);
        }
    }
}

function updateComputerPaddle() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    const difficulty = 0.7; // Adjustment for computer difficulty (0-1, lower = easier)
    
    if (computerCenter < ballCenter - 35) {
        computer.y = Math.min(computer.y + computer.speed * difficulty, canvas.height - computer.height);
    } else if (computerCenter > ballCenter + 35) {
        computer.y = Math.max(computer.y - computer.speed * difficulty, 0);
    }
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }

    // Player paddle collision
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.radius;
        
        // Add spin based on paddle position
        const deltaY = ball.y - (player.y + player.height / 2);
        ball.dy += deltaY * 0.1;
    }

    // Computer paddle collision
    if (
        ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computer.x - ball.radius;
        
        // Add spin based on paddle position
        const deltaY = ball.y - (computer.y + computer.height / 2);
        ball.dy += deltaY * 0.1;
    }

    // Score points
    if (ball.x - ball.radius < 0) {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
        resetBall();
    }

    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
    ball.dy = (Math.random() - 0.5) * 4;
}

function draw() {
    // Clear canvas
    drawRectangle(0, 0, canvas.width, canvas.height, '#1a1a1a');

    // Draw game elements
    drawNet();
    drawRectangle(player.x, player.y, player.width, player.height, '#00ff00');
    drawRectangle(computer.x, computer.y, computer.width, computer.height, '#ff00ff');
    drawCircle(ball.x, ball.y, ball.radius, '#ffff00');
}

function update() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();