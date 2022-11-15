const GAME_TIME = 100;
const MAIN_COLS = 10;
const MAIN_ROWS = 20;
const NEXT_COLS = 4;
const NEXT_ROWS = 4;
const MAIN_CELL_COUNT = MAIN_COLS * MAIN_ROWS;
const NEXT_CELL_COUNT = NEXT_COLS * NEXT_ROWS;
const MAIN_CELLS = [];
const NEXT_CELLS = [];

const TOP_ROW = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const DOM_ELEMENTS = {
  mainGrid: document.querySelector(".main_grid"),
  nextGrid: document.querySelector(".next_grid"),
  startButton: document.querySelector("#start"),
};

const SHAPES = ["i", "j", "l", "s", "z", "t", "o"];

export {
  GAME_TIME,
  MAIN_COLS,
  MAIN_CELL_COUNT,
  NEXT_CELL_COUNT,
  MAIN_CELLS,
  NEXT_CELLS,
  SHAPES,
  TOP_ROW,
  DOM_ELEMENTS,
};
