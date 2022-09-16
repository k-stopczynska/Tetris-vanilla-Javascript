"use strict";
const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 25;
const LINES_FOR_LEVEL = 3;
const COLORS = ["cyan", "blue", "orange", "yellow", "green", "purple", "red"];
const SHAPES = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 2, 0],
    [0, 2, 0],
    [2, 2, 0],
  ],
  [
    [0, 3, 0],
    [0, 3, 0],
    [0, 3, 3],
  ],
  [
    [4, 4, 0],
    [4, 4, 0],
    [0, 0, 0],
  ],
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  [
    [6, 6, 6],
    [0, 6, 0],
    [0, 0, 0],
  ],
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
];

const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2
};

const LEVELS = {
  0: 800,
  1: 720,
  2: 630,
  3: 550,
  4: 470,
  5: 380,
  6: 300,
  7: 220,
  8: 130,
  9: 100,
  10: 80,
  11: 80,
  12: 80,
  13: 70,
  14: 70,
  15: 70,
  16: 50,
  17: 50,
  18: 50,
  19: 30,
  20: 30
}


const playButtons = document.querySelectorAll('.play');

const pauseModal = document.getElementById('pause');

const gameOverModal = document.getElementById('game-over');

const finalScore = document.getElementById('final-score');

const bestStats = document.getElementById('best-stats');

const userName = document.getElementById('user-name');
