const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.querySelector('.start');
const pauseButton = document.querySelector('.pause');
const resetButton = document.querySelector('.reset');
const speedSlider = document.querySelector('.speed-slider');
const speedLabel = document.querySelector('.speed-label');
const themeSelector = document.querySelector('.theme-selector');

const rows = 40;
const cols = 80;
let cellSize = 10;
let grid = createGrid();
let running = false;
let speed = 0.5; // Speed in seconds

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

themeSelector.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const theme = event.target.dataset.theme;
        setTheme(theme);
    }
});

function createGrid() {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => Math.random() > 0.8 ? 1 : 0));
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1) {
                ctx.beginPath();
                const x = j * cellWidth + cellWidth / 2;
                const y = i * cellHeight + cellHeight / 2;
                const radius = Math.min(cellWidth, cellHeight) / 2 - 1;
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = getRandomColor();
                ctx.fill();
            }
        }
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function updateGrid() {
    const newGrid = createGrid();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const neighbors = countNeighbors(i, j);
            if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                newGrid[i][j] = 0;
            } else if (grid[i][j] === 0 && neighbors === 3) {
                newGrid[i][j] = 1;
            } else {
                newGrid[i][j] = grid[i][j];
            }
        }
    }
    grid = newGrid;
}

function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const x = (col + j + cols) % cols;
            const y = (row + i + rows) % rows;
            count += grid[y][x];
        }
    }
    return count;
}

function gameLoop() {
    if (running) {
        updateGrid();
        drawGrid();
        setTimeout(gameLoop, speed * 1000);
    }
}

startButton.addEventListener('click', () => {
    running = true;
    gameLoop();
});

pauseButton.addEventListener('click', () => {
    running = false;
});

resetButton.addEventListener('click', () => {
    running = false;
    grid = createGrid();
    drawGrid();
});

speedSlider.addEventListener('input', () => {
    speed = speedSlider.value;
    speedLabel.textContent = `Speed: ${speed}s`;
});

drawGrid();
