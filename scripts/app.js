import {
  DOM_ELEMENTS,
  MAIN_WIDTH,
  MAIN_HEIGHT,
  MAIN_CELL_COUNT,
  NEXT_CELL_COUNT,
  MAIN_CELLS,
  NEXT_CELLS,
  GAME_TIME,
  TOP_ROW,
  BOTTOM_ROW,
  MAIN_GRID_ROWS
} from "./constants.js";

import { generateRandomShape, getPosition } from "./shapes.js";

function init() {
  let isGameRunning = false;
  let currentShape = null;
  let nextShape = null;
  let shapeIsFalling;

  renderBoards();

  function renderBoards() {
    createGrid(MAIN_CELL_COUNT, MAIN_CELLS, DOM_ELEMENTS.mainGrid);
    createGrid(NEXT_CELL_COUNT, NEXT_CELLS, DOM_ELEMENTS.nextGrid);
  }

  function createGrid(cellCount, cellArray, grid) {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement("div");
      cell.setAttribute("data-index", i);
      cellArray.push(cell);
      grid.appendChild(cell);
    }
    return cellArray;
  }

  function startPauseToggle() {
    !isGameRunning ? startGame() : pauseGame();
  }

  function startGame() {
    isGameRunning = true;
    DOM_ELEMENTS.startButton.textContent = "PAUSE";
    playGame();
  }

  function endGame() {
    DOM_ELEMENTS.gameOverScreen.style.visibility = "visible";
    resetGame();
  }

  function pauseGame() {
    isGameRunning = false;
    DOM_ELEMENTS.startButton.textContent = "RESUME";
    clearInterval(shapeIsFalling);
  }

  function resetGame() {
    isGameRunning = false;
    DOM_ELEMENTS.startButton.textContent = "START";
    clearInterval(shapeIsFalling);
    clearAllCells();

    if (nextShape !== null) {
      removePreviewShape();
    }
  }

  function removeGameOverScreen() {
    DOM_ELEMENTS.gameOverScreen.style.visibility = "hidden";
  }

  function playGame() {
    if (!isFalling()) {
      renderRandomShape();
      addPreviewShape();
      playGame();
    } else {
      shapeIsFalling = setInterval(() => {
        if (!isColliding()) {
          moveShapeToNewPosition();
        } else {
          deactivateCurrentShape();
          checkIfLineClear();
          if (!isFillingTopOfGrid()) {
            removePreviewShape();
            playGame();
          } else {
            setTimeout(endGame, 100);
          }
        }
      }, GAME_TIME);
    }
  }

  function isFalling() {
    return MAIN_CELLS.some((cell) => cell.className.includes("falling"));
  }

  function isColliding() {
    if (
      BOTTOM_ROW.some((i) => MAIN_CELLS[i].className.includes("falling")) ||
      currentShape.newPosition.some((i) =>
        MAIN_CELLS[i].className.includes("dead")
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  function isFillingTopOfGrid() {
    return TOP_ROW.some((i) => MAIN_CELLS[i].className.includes("dead"));
  }

  function handleKeyDown({ keyCode }) {
    const x = currentShape.currentCenter % MAIN_WIDTH;
    const y = Math.floor(currentShape.currentCenter / MAIN_HEIGHT);

    if (isFalling() && isGameRunning) {
      if ((keyCode === 38 || keyCode === 87) && x > 0 && x < MAIN_WIDTH - 1) {
        rotateShape();
      }
      if ((keyCode === 40 || keyCode === 83) && y < MAIN_WIDTH - 1) {
        softDrop(); // errors in console when dropping "i" shape vertically and hitting bottom of grid, not game breaking
      }
      if (keyCode === 39 || keyCode === 68) {
        moveShapeToRight();
      }
      if (keyCode === 37 || keyCode === 65) {
        moveShapeToLeft();
      }
    }
  }

  function rotateShape() {
    if (!isTopRow()) {
      removeShapeAtPosition();
      setCurrentRotation();

      const currentPosition = currentShape.currentPosition;
      const rotatedShape = getPosition(
        currentShape.currentCenter,
        currentShape.shape,
        currentShape.currentRotation
      );

      if (currentShape.shape !== "o") {
        currentShape.currentPosition = rotatedShape;
      }

      if (isRotatingIntoDeadShape()) {
        currentShape.currentPosition = currentPosition;
      }
      addShapeAtPosition();
    }
  }

  function setCurrentRotation() {
    if (!isTopRow() && currentShape.shape !== "o") {
      currentShape.incrementRotation();
    }

    if (currentShape.currentRotation >= currentShape.possibleRotations) {
      currentShape.currentRotation = 0;
    }
  }

  function isTopRow() {
    return TOP_ROW.some((i) => MAIN_CELLS[i].className.includes("falling"));
  }

  function isRotatingIntoDeadShape() {
    return currentShape.currentPosition.some((i) =>
      MAIN_CELLS[i].className.includes("dead")
    );
  }

  function moveShapeToRight() {
    if (!isMovingOffRight()) {
      removeShapeAtPosition();

      const movedPosition = currentShape.currentPosition.map(
        (cell) => cell + 1
      );

      if (
        !movedPosition.some((i) => MAIN_CELLS[i].className.includes("dead"))
      ) {
        currentShape.currentPosition = movedPosition;
        currentShape.incrementCurrentCenter();
      }
      addShapeAtPosition();
    }
  }

  function moveShapeToLeft() {
    if (!isMovingOffLeft()) {
      removeShapeAtPosition();

      const movedPosition = currentShape.currentPosition.map(
        (cell) => cell - 1
      );

      if (
        !movedPosition.some((i) => MAIN_CELLS[i].className.includes("dead"))
      ) {
        currentShape.currentPosition = movedPosition;
        currentShape.decreaseCurrentCenter();
      }
      addShapeAtPosition();
    }
  }

  function isMovingOffRight() {
    return currentShape.currentPosition.some(
      (cell) => cell % MAIN_WIDTH === MAIN_WIDTH - 1
    );
  }

  function isMovingOffLeft() {
    return currentShape.currentPosition.some((cell) => cell % MAIN_WIDTH === 0);
  }

  function softDrop() {
    if (!isColliding()) {
      removeShapeAtPosition();
      getNewCenter();
      currentShape.currentPosition = currentShape.newPosition;
      addShapeAtPosition();
    }
  }

  function checkIfLineClear() {
    createArrayOfRows();

    for (let row = MAIN_HEIGHT - 1; row > 0; row--) {
      while (
        MAIN_GRID_ROWS[row].every((cell) => cell.className.includes("dead"))
      ) {
        let currentRow = row;
        while (currentRow > 0) {
          for (let cell = 0; cell < MAIN_WIDTH; cell++) {
            MAIN_GRID_ROWS[currentRow][cell].className =
              MAIN_GRID_ROWS[currentRow - 1][cell].className;
          }
          currentRow -= 1;
        }
      }
    }
  }

  function createArrayOfRows() {
    for (let rows = 0; rows < MAIN_CELL_COUNT; rows += MAIN_WIDTH) {
      MAIN_GRID_ROWS.push(MAIN_CELLS.slice(rows, rows + MAIN_WIDTH));
    }
    return MAIN_GRID_ROWS;
  }

  function renderRandomShape() {
    nextShape === null
      ? (currentShape = generateRandomShape())
      : (currentShape = nextShape);
    nextShape = generateRandomShape();
    addShapeAtPosition();
  }

  function moveShapeToNewPosition() {
    getNewCenter();
    removeShapeAtPosition();
    currentShape.currentPosition = getPosition(
      currentShape.currentCenter,
      currentShape.shape,
      currentShape.currentRotation
    );
    addShapeAtPosition();
  }

  function getNewCenter() {
    if (currentShape.currentCenter < MAIN_CELL_COUNT - MAIN_WIDTH) {
      currentShape.currentCenter += MAIN_WIDTH;
    }
  }

  function deactivateCurrentShape() {
    clearInterval(shapeIsFalling);
    removeShapeAtPosition();
    setClassToDead();
  }

  function addShapeAtPosition() {
    setClassToFalling();
    predictNewPosition();
  }

  function removeShapeAtPosition() {
    currentShape.currentPosition.forEach((cell) =>
      MAIN_CELLS[cell].removeAttribute("class")
    );
  }

  function setClassToDead() {
    currentShape.currentPosition.forEach((cell) =>
      MAIN_CELLS[cell].classList.add(currentShape.dead)
    );
  }

  function setClassToFalling() {
    currentShape.currentPosition.forEach((cell) =>
      MAIN_CELLS[cell].classList.add(currentShape.falling)
    );
  }

  function predictNewPosition() {
    currentShape.newPosition = currentShape.currentPosition.map(
      (cell) => cell + MAIN_WIDTH
    );
    return currentShape.newPosition;
  }

  function addPreviewShape() {
    nextShape.previewPosition.forEach((cell) =>
      NEXT_CELLS[cell].classList.add(nextShape.falling)
    );
  }

  function removePreviewShape() {
    nextShape.previewPosition.forEach((cell) =>
      NEXT_CELLS[cell].classList.remove(nextShape.falling)
    );
  }

  function clearAllCells() {
    MAIN_CELLS.forEach((cell) => {
      cell.removeAttribute("class");
    });
  }

  DOM_ELEMENTS.resetButton.addEventListener("click", resetGame);
  DOM_ELEMENTS.startButton.addEventListener("click", startPauseToggle);
  DOM_ELEMENTS.gameOverScreen.addEventListener("click", removeGameOverScreen);
  window.addEventListener("keydown", handleKeyDown);
}

window.addEventListener("DOMContentLoaded", init);
