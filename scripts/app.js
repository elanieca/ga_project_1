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
  MAIN_GRID_ROWS,
} from "./constants.js";

import { generateRandomShape, getRotation } from "./shapes.js";

function init() {
  let isGameRunning = false;
  let currentShape = null;
  let nextShape = null;
  let shapeIsFalling;

  function createGrid(cellCount, cellArray, grid) {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement("div");
      cell.setAttribute("data-index", i);
      cellArray.push(cell);
      grid.appendChild(cell);
    }
    return cellArray;
  }

  function renderBoards() {
    createGrid(MAIN_CELL_COUNT, MAIN_CELLS, DOM_ELEMENTS.mainGrid);
    createGrid(NEXT_CELL_COUNT, NEXT_CELLS, DOM_ELEMENTS.nextGrid);
  }

  renderBoards();

  function startPauseToggle() {
    !isGameRunning ? startGame() : pauseGame();
  }

  function startGame() {
    isGameRunning = true;
    DOM_ELEMENTS.startButton.textContent = "PAUSE";
    playGame();
  }
  function pauseGame() {
    isGameRunning = false;
    DOM_ELEMENTS.startButton.textContent = "RESUME";
    clearInterval(shapeIsFalling);
  }

  function resetGame() {
    isGameRunning = false;
    clearInterval(shapeIsFalling);
    MAIN_CELLS.forEach((cell) => {
      cell.removeAttribute("class");
    });
    DOM_ELEMENTS.startButton.textContent = "START";
    if (nextShape !== null) {
      removePreviewShape();
    }
  }

  function endGame() {
    DOM_ELEMENTS.gameOverScreen.style.visibility = "visible";
    resetGame();
  }

  function playAgain() {
    DOM_ELEMENTS.gameOverScreen.style.visibility = "hidden";
  }

  function playGame() {
    if (MAIN_CELLS.some((cell) => cell.className.includes("falling"))) {
      shapeIsFalling = setInterval(() => {
        if (
          BOTTOM_ROW.some((i) => MAIN_CELLS[i].className.includes("falling")) ||
          currentShape.newPosition.some((i) =>
            MAIN_CELLS[i].className.includes("dead")
          )
        ) {
          deactivateCurrentShape();
          checkIfLineClear();
          if (TOP_ROW.some((i) => MAIN_CELLS[i].className.includes("dead"))) {
            setTimeout(endGame, 100);
          } else {
            removePreviewShape();
            playGame();
          }
        } else {
          moveShapeToNewPosition();
        }
      }, GAME_TIME);
    } else {
      renderRandomShape();
      addPreviewShape();
      playGame();
    }
  }

  function handleKeyDown(event) {
    const x = currentShape.currentCenter % MAIN_WIDTH;
    const y = Math.floor(currentShape.currentCenter / MAIN_HEIGHT);

    if (
      MAIN_CELLS.some(
        (cell) => cell.className.includes("falling") && isGameRunning
      )
    ) {
      if (event.key === "ArrowUp" && x > 0 && x < MAIN_WIDTH - 1) {
        rotateShape();
      }
      if (event.key === "ArrowDown" && y < MAIN_WIDTH - 1) {
        softDrop(); // still gives me an error in console but not game breaking
      }
      if (event.key === "ArrowRight") {
        moveShapeToRight();
      }
      if (event.key === "ArrowLeft") {
        moveShapeToLeft();
      }
    }
  }

  function rotateShape() {
    if (!TOP_ROW.some((i) => MAIN_CELLS[i].className.includes("falling"))) {
      removeShapeAtPosition();
      setCurrentRotation();

      const currentPosition = currentShape.currentPosition;
      const rotatedShape = getRotation(
        currentShape.currentCenter,
        currentShape.shape,
        currentShape.currentRotation
      );

      if (currentShape.shape !== "o") {
        currentShape.currentPosition = rotatedShape;
      }

      if (
        currentShape.currentPosition.some((i) =>
          MAIN_CELLS[i].className.includes("dead")
        )
      ) {
        currentShape.currentPosition = currentPosition;
      }
      addShapeAtPosition();
    }
  }

  function moveShapeToRight() {
    if (
      !currentShape.currentPosition.some(
        (cell) => cell % MAIN_WIDTH === MAIN_WIDTH - 1
      )
    ) {
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
    if (!currentShape.currentPosition.some((cell) => cell % MAIN_WIDTH === 0)) {
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

  function softDrop() {
    if (
      !currentShape.newPosition.some((i) =>
        MAIN_CELLS[i].className.includes("dead")
      )
    ) {
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
    currentShape.currentPosition = getRotation(
      currentShape.currentCenter,
      currentShape.shape,
      currentShape.currentRotation
    );
    addShapeAtPosition();
  }

  function deactivateCurrentShape() {
    clearInterval(shapeIsFalling);
    removeShapeAtPosition();
    setCurrentShapeToDead();
  }

  function addShapeAtPosition() {
    setCurrentShapeToFalling();
    getNewPosition();
  }

  function removeShapeAtPosition() {
    currentShape.currentPosition.forEach((cell) =>
      MAIN_CELLS[cell].classList.remove(currentShape.falling)
    );
  }

  function setCurrentShapeToDead() {
    currentShape.currentPosition.forEach((cell) =>
      MAIN_CELLS[cell].classList.add(currentShape.dead)
    );
  }

  function setCurrentShapeToFalling() {
    currentShape.currentPosition.forEach((cell) =>
      MAIN_CELLS[cell].classList.add(currentShape.falling)
    );
  }

  function getNewPosition() {
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

  function setCurrentRotation() {
    if (
      !TOP_ROW.some((i) => MAIN_CELLS[i].className.includes("falling")) &&
      currentShape.shape !== "o"
    ) {
      currentShape.incrementRotation();
    }

    if (currentShape.currentRotation >= currentShape.possibleRotations) {
      currentShape.currentRotation = 0;
    }
  }

  function getNewCenter() {
    if (currentShape.currentCenter < MAIN_CELL_COUNT - MAIN_WIDTH) {
      currentShape.currentCenter += MAIN_WIDTH;
    }
  }

  function createArrayOfRows() {
    for (let rows = 0; rows < MAIN_CELL_COUNT; rows += MAIN_WIDTH) {
      MAIN_GRID_ROWS.push(MAIN_CELLS.slice(rows, rows + MAIN_WIDTH));
    }
    return MAIN_GRID_ROWS;
  }

  window.addEventListener("keydown", handleKeyDown);

  DOM_ELEMENTS.resetButton.addEventListener("click", resetGame);
  DOM_ELEMENTS.startButton.addEventListener("click", startPauseToggle);
  DOM_ELEMENTS.gameOverScreen.addEventListener("click", playAgain);
}

window.addEventListener("DOMContentLoaded", init);
