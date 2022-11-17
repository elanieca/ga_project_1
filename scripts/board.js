import {
  DOM_ELEMENTS,
  MAIN_CELLS,
  MAIN_CELL_COUNT,
  NEXT_CELLS,
  NEXT_CELL_COUNT,
} from "./constants.js";

function createGrid(cellCount, cellArray, grid) {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement("div");
    cell.setAttribute("data-index", i);
    cellArray.push(cell);
    cell.innerHTML = i;
    grid.appendChild(cell);
  }
  return cellArray;
}

function createGameBoard(cellCount, cellArray, grid) {
  createGrid(MAIN_CELL_COUNT, MAIN_CELLS, DOM_ELEMENTS.mainGrid);
  createGrid(NEXT_CELL_COUNT, NEXT_CELLS, DOM_ELEMENTS.nextGrid);
}

export { createGameBoard };
