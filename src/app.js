let canvas = document.getElementById("board");
let ctx = canvas.getContext("2d");
let nextCanvas = document.getElementById("next-tetrominoes");
let nextCtx = nextCanvas.getContext("2d");
let board = new Board(ctx, nextCtx);
movePieces();
initNext();
let bestStatsArr = [];
let bestStatsEl = null;
renderStats();

const moves = {
  ["ArrowRight"]: (p) => ({ ...p, x: p.x + 1 }),
  ["ArrowLeft"]: (p) => ({ ...p, x: p.x - 1 }),
  ["ArrowDown"]: (p) => ({ ...p, y: p.y + 1 }),
  ["ArrowUp"]: (p) => board.rotate(board.tetromino),
  ["Space"]: (p) => ({ ...p, y: p.y + 1 }),
};

let userStats = {
  name: userName.value,
  score: 0,
  lines: 0,
  level: 0,
};

function updateUserStats(key, value) {
  let elem = document.getElementById(key);
  elem.textContent = value;
}

let stats = new Proxy(userStats, {
  set: (target, key, value) => {
    target[key] = value;
    updateUserStats(key, value);
    return true;
  },
});

let requestId;

function initNext() {
  nextCtx.canvas.width = 6 * BLOCK_SIZE;
  nextCtx.canvas.height = 6 * BLOCK_SIZE;
  nextCtx.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function resetGame() {
  stats.name = userName.value;
  stats.score = 0;
  stats.lines = 0;
  stats.level = 0;
  board.resetBoard();
  time = {
    start: 0,
    elapsed: 0,
    level: LEVELS[stats.level],
  };
}

function play() {
  if (gameOverModal.classList.contains("active")) {
    gameOverModal.classList.remove("active");
  }
  if (!userName.value) {
    const label = document.querySelector('label');
    label.style.color = 'red';
    return;
  }
  resetGame();
  time.start = Date.now();
  animate();
}
playButtons.forEach((playButton) => playButton.addEventListener("click", play));

function animate(now = 0) {
  now = Date.now();
  time.elapsed = now - time.start;
  if (time.elapsed > time.level) {
    board.drop();
    time.start = now;
    if (!board.drop()) {
      gameOver();
      return;
    }
  }
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  board.draw();
  requestId = requestAnimationFrame(animate);
}

function movePieces() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "p") {
      pause();
    }
    if (e.key === "Escape") {
      gameOver();
    }
    if (moves[e.code]) {
      e.preventDefault();
      let p = moves[e.code](board.tetromino);
      if (e.code === "Space") {
        while (board.collisionDetection(p)) {
          stats.score += POINTS.HARD_DROP;
          board.tetromino.move(p);
          p = moves["ArrowDown"](board.tetromino);
        }
      } else if (board.collisionDetection(p)) {
        board.tetromino.move(p);
        if (e.code === "ArrowDown") {
          stats.score += POINTS.SOFT_DROP;
        }
      }
    }
  });
}

function pause() {
  if (!requestId) {
    pauseModal.classList.remove("active");
    animate();
    return;
  }
  cancelAnimationFrame(requestId);
  requestId = null;
  pauseModal.classList.add("active");
}

function updateStats() {
  if (bestStatsEl) {
    removeStats(bestStats);
  }
  bestStatsArr.push({ ...stats })
  bestStatsArr.sort((a, b) => b.score - a.score);
    localStorage.setItem('bestStats', JSON.stringify(bestStatsArr));
}

function removeStats(bestStats) {
  while (bestStats.firstChild) {
    bestStats.removeChild(bestStats.firstChild);
  }
}

function gameOver() {
  cancelAnimationFrame(requestId);
  requestId = null;
  gameOverModal.classList.add("active");
  finalScore.textContent = `Your final score is ${stats.score}`;
  updateStats();
  renderStats();
}

function renderStats() {
  bestStatsArr = JSON.parse(localStorage.getItem('bestStats'));
  for (const elem of bestStatsArr.slice(0, 3)) {
    bestStatsEl = document.createElement("li");
    bestStatsEl.innerHTML = 
    `<p>Name: \`${elem.name}\`</p>
  <p>Score: \`${elem.score}\`</p>
   <p>Level: \`${elem.level}\`</p>`;
    bestStats.appendChild(bestStatsEl);
}
}
