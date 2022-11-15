import {
  DOM_ELEMENTS,
  MAIN_COLS,
  MAIN_CELL_COUNT,
  NEXT_CELL_COUNT,
  MAIN_CELLS,
  NEXT_CELLS,
  GAME_TIME,
} from "./constants.js";
import { createGameBoard } from "./board.js";
import { generateShape } from "./shapes.js";

function init() {
  let isGameRunning = false;
  let currentShape = null;
  let nextShape = null;
  let letShapeFall;

  createGameBoard();

  function addCurrentShape() {
    currentShape.currentPosition.forEach((cell) =>
      MAIN_CELLS[cell].classList.add(currentShape.falling)
    );
    getNextPosition();
  }

  function removeCurrentShape() {
    currentShape.currentPosition.forEach((cell) =>
      MAIN_CELLS[cell].classList.remove(currentShape.falling)
    );
  }

  function getNextPosition() {
    currentShape.nextPosition = currentShape.currentPosition.map(
      (cell) => cell + MAIN_COLS
    );
    return currentShape.nextPosition;
  }

  function setCurrentShapeToDead() {
    currentShape.currentPosition.forEach((cell) =>
      MAIN_CELLS[cell].classList.remove(currentShape.falling)
    );
    currentShape.currentPosition.forEach((cell) =>
      MAIN_CELLS[cell].classList.add(currentShape.dead)
    );
  }
  function deactivateCurrentShape() {
    clearInterval(letShapeFall);
    setCurrentShapeToDead();
    removeCurrentShape();
  }

  function renderNewShape() {
    nextShape === null
      ? (currentShape = generateShape())
      : (currentShape = nextShape);
    addCurrentShape();
  }

  function endGame() {
    isGameRunning = false;
    clearInterval(letShapeFall);
    MAIN_CELLS.forEach((cell) => {
      cell.removeAttribute("class");
    });
    // DOM_ELEMENTS.mainGrid.style.visibility = "hidden";
  }

  function moveShapeToNewPosition() {
    removeCurrentShape();
    currentShape.currentPosition = currentShape.nextPosition;
    addCurrentShape();
  }

  function moveShape() {
    if (MAIN_CELLS.some((cell) => cell.className.includes("falling"))) {
      letShapeFall = setInterval(() => {
        if (
          currentShape.nextPosition.some((i) => i >= MAIN_CELL_COUNT) ||
          currentShape.nextPosition.some((cell) =>
            MAIN_CELLS[cell].className.includes("dead")
          )
        ) {
          deactivateCurrentShape();
          if (
            currentShape.topRow.some((i) =>
              MAIN_CELLS[i].className.includes("dead")
            )
          ) {
            setTimeout(endGame, 200);
            DOM_ELEMENTS.startButton.textContent = "START";
          } else {
            moveShape();
          }
        } else {
          moveShapeToNewPosition();
        }
      }, GAME_TIME);
    } else {
      renderNewShape();
      moveShape();
    }
  }

  function startGame() {
    isGameRunning = true;
    DOM_ELEMENTS.startButton.textContent = "PAUSE";
    moveShape();
  }
  function pauseGame() {
    isGameRunning = false;
    DOM_ELEMENTS.startButton.textContent = "RESUME";
    clearInterval(letShapeFall);
  }

  function startPauseToggle() {
    !isGameRunning ? startGame() : pauseGame();
  }

  DOM_ELEMENTS.startButton.addEventListener("click", startPauseToggle);
}

window.addEventListener("DOMContentLoaded", init);
