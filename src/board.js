class Board {
  constructor(ctx, nextCtx) {
    this.ctx = ctx;
    this.nextCtx = nextCtx;
    this.init();
  }

  init() {
    this.ctx.canvas.width = COLUMNS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  getAwaitingTetromino() {
    this.awaitingTetromino = new Tetromino(this.nextCtx);
    this.nextCtx.clearRect(
      0,
      0,
      this.nextCtx.canvas.width,
      this.nextCtx.canvas.height
    );
    this.awaitingTetromino.drawTetromino();
  }

  resetBoard() {
    this.grid = this.drawEmptyBoard();
    this.tetromino = new Tetromino(this.ctx);
    this.getAwaitingTetromino();
  }

  drawEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
  }

  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value - 1];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  draw() {
    this.drawBoard();
    this.tetromino.drawTetromino();
  }

  rotate(tetromino) {
    //deep clone of tetromino
    let p = JSON.parse(JSON.stringify(tetromino));
    for (let y = 0; y < p.shape.length; y++) {
      for (let x = 0; x < y; x++) {
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
      }
    }
    p.shape.forEach((row) => row.reverse());
    return p;
  }

  collisionDetection(p) {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (
          value === 0 ||
          (this.isBetweenWalls(x) &&
            this.isAboveFloor(y) &&
            this.isCellEmpty(x, y))
        );
      });
    });
  }

  drop() {
    let p = moves["ArrowDown"](this.tetromino);
    if (this.collisionDetection(p)) {
      this.tetromino.move(p);
    } else {
      this.freezeTetromino();
      this.clearLines();
      if (this.tetromino.y === 0) {
        return false;
      }
      this.tetromino = this.awaitingTetromino;
      this.tetromino.ctx = this.ctx;
      this.getAwaitingTetromino();
    }
   return true;
  }

  freezeTetromino() {
    this.tetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[y + this.tetromino.y][x + this.tetromino.x] = value;
        }
      });
    });
  }

  clearLines() {
    let lines = 0;

    this.grid.forEach((row, y) => {
      if (row.every((value) => value > 0)) {
        lines++;
        //remove the row
        this.grid.splice(y, 1);
        //add empty row on the top
        this.grid.unshift(Array(COLUMNS).fill(0));
      }
    });
    if (lines > 0) {
      stats.lines += lines;
      stats.score += this.pointsPerLines(lines);
      if (stats.lines > LINES_FOR_LEVEL * (stats.level + 1)) {
        stats.level ++;
        stats.lines -= stats.lines;
        time.level = LEVELS[stats.level];
      }
    }
  }

  pointsPerLines(lines, level) {
    const pointsPerLines =
      lines === 1
        ? POINTS.SINGLE
        : lines === 2
        ? POINTS.DOUBLE
        : lines === 3
        ? POINTS.TRIPLE
        : lines >= 4
        ? POINTS.TETRIS
        : 0;
    return pointsPerLines * (userStats.level + 1);
  }

  isBetweenWalls(x) {
    return x >= 0 && x <= COLUMNS;
  }

  isAboveFloor(y) {
    return y <= ROWS;
  }

  isCellEmpty(x, y) {
    return this.grid[y] && this.grid[y][x] === 0;
  }
}
