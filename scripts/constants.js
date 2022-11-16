const GAME_TIME = 1000;
const MAIN_WIDTH = 10;
const MAIN_HEIGHT = 20;
const NEXT_WIDTH = 4;
const NEXT_HEIGHT = 4;
const MAIN_CELL_COUNT = MAIN_WIDTH * MAIN_HEIGHT;
const NEXT_CELL_COUNT = NEXT_WIDTH * NEXT_HEIGHT;
const MAIN_CELLS = [];
const NEXT_CELLS = [];
const INITIAL_ROTATION_CELL = 15;

const TOP_ROW = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const SHAPES = ["i", "j", "l", "s", "z", "t", "o"];

const DOM_ELEMENTS = {
  mainGrid: document.querySelector(".main_grid"),
  nextGrid: document.querySelector(".next_grid"),
  startButton: document.querySelector("#start"),
};

export {
  GAME_TIME,
  MAIN_WIDTH,
  MAIN_CELL_COUNT,
  NEXT_CELL_COUNT,
  MAIN_CELLS,
  NEXT_CELLS,
  INITIAL_ROTATION_CELL,
  TOP_ROW,
  SHAPES,
  DOM_ELEMENTS,
};
