const GOAL_CANS = 20;
let currentCans = 0;
let gameActive = false;
let spawnInterval;
let timeLeft = 30;
let timerInterval;
let achievementTimeout;

function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
}

function updateScore() {
  const scoreDisplay = document.getElementById('current-cans');
  if (scoreDisplay) {
    scoreDisplay.textContent = currentCans;
  }
}

function updateTimer() {
  const timerDisplay = document.getElementById('timer');
  if (timerDisplay) {
    timerDisplay.textContent = timeLeft;
  }
}

function showAchievement(message) {
  const achievementBox = document.getElementById('achievements');
  if (!achievementBox) return;

  achievementBox.textContent = message;

  clearTimeout(achievementTimeout);
  achievementTimeout = setTimeout(() => {
    achievementBox.textContent = '';
  }, 3500);
}

function spawnWaterCan() {
  if (!gameActive) return;

  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach(cell => (cell.innerHTML = ''));

  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  const wrapper = document.createElement('div');
  wrapper.className = 'water-can-wrapper';

  const can = document.createElement('div');
  can.className = 'water-can';

  wrapper.appendChild(can);
  randomCell.appendChild(wrapper);

  wrapper.addEventListener('click', function () {
    if (!gameActive) return;

    currentCans++;
    updateScore();
    wrapper.remove();

    if (currentCans === 5) {
      showAchievement('Nice start! 5 cans collected.');
    } else if (currentCans === 10) {
      showAchievement('Great job! 10 cans collected.');
    } else if (currentCans === 15) {
      showAchievement('Almost there! 15 cans collected.');
    }

    if (currentCans >= GOAL_CANS) {
      endGame();
      showAchievement('You win! You collected enough water cans!');
    }
  }, { once: true });
}

function startGame() {
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  clearTimeout(achievementTimeout);

  currentCans = 0;
  timeLeft = 30;
  gameActive = true;

  updateScore();
  updateTimer();

  const achievementBox = document.getElementById('achievements');
  if (achievementBox) {
    achievementBox.textContent = '';
  }

  createGrid();
  spawnWaterCan();

  spawnInterval = setInterval(spawnWaterCan, 1500);

  timerInterval = setInterval(function () {
    if (!gameActive) return;

    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      endGame();
      showAchievement('Time is up! Try again.');
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
}

createGrid();
updateScore();
updateTimer();

document.getElementById('start-game').addEventListener('click', startGame);