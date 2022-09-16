class Tetromino {
    constructor(ctx, nextCtx) {
      this.ctx = ctx;
      this.nextCtx = nextCtx;
      this.spawnTetromino();
    }

    spawnTetromino() {
      this.typeId = this.getRandomTetromino(COLORS.length);
      this.color = COLORS[this.typeId];
      this.shape = SHAPES[this.typeId];
      this.x = 3;
      this.y = 0;
    }

    drawTetromino() {
      this.ctx.fillStyle = this.color;
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 1;
      this.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            this.ctx.fillRect(this.x + x, this.y + y, 1, 1);

          }
        });
      });
    }

    getRandomTetromino(typesCount) {
      return Math.floor(Math.random() * typesCount);
    }

    move(p) {
      this.x = p.x;
      this.y = p.y;
      this.shape = p.shape;
    }
  }