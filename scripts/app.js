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
} from './constants.js';

import { generateRandomShape, getPosition } from './shapes.js';

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
      const cell = document.createElement('div');
      cell.setAttribute('data-index', i);
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
    DOM_ELEMENTS.startButton.textContent = 'PAUSE';
    playGame();
  }

  function endGame() {
    DOM_ELEMENTS.gameOverScreen.style.visibility = 'visible';
    DOM_ELEMENTS.startButton.disabled = true;
    DOM_ELEMENTS.resetButton.disabled = true;
    resetGame();
  }

  function pauseGame() {
    isGameRunning = false;
    DOM_ELEMENTS.startButton.textContent = 'RESUME';
    clearInterval(shapeIsFalling);
  }

  function resetGame() {
    isGameRunning = false;
    DOM_ELEMENTS.startButton.textContent = 'START';
    clearInterval(shapeIsFalling);
    clearAllCells();

    if (nextShape !== null) {
      removePreviewShape();
    }
  }

  function removeGameOverScreen() {
    DOM_ELEMENTS.gameOverScreen.style.visibility = 'hidden';
    DOM_ELEMENTS.startButton.disabled = false;
    DOM_ELEMENTS.resetButton.disabled = false;
  }

  function playGame() {
    const isFalling = MAIN_CELLS.some((cell) =>
      cell.className.includes('falling')
    );

    const isFillingTopOfGrid = someInRowHasClassName(TOP_ROW, 'dead');

    if (!isFalling) {
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

          if (!isFillingTopOfGrid) {
            removePreviewShape();
            playGame();
          } else {
            endGame();
          }
        }
      }, GAME_TIME);
    }
  }

  function someInRowHasClassName(row, className) {
    return row.some((i) => MAIN_CELLS[i].className.includes(className));
  }

  function isColliding() {
    return (
      someInRowHasClassName(BOTTOM_ROW, 'falling') ||
      someInRowHasClassName(currentShape.newPosition, 'dead')
    );
  }

  function handleKeyDown({ keyCode }) {
    if (isGameRunning) {
      // arrow up or w
      if (keyCode === 38 || keyCode === 87) {
        rotateShape();
      }
      // arrow down or s
      if (keyCode === 40 || keyCode === 83) {
        softDrop();
      }
      // arrow right or d
      if (keyCode === 39 || keyCode === 68) {
        moveShapeToRight();
      }
      // arrow left or a
      if (keyCode === 37 || keyCode === 65) {
        moveShapeToLeft();
      }
    }
  }

  function rotateShape() {
    const x = currentShape.currentCenter % MAIN_WIDTH;
    const y = Math.floor(currentShape.currentCenter / MAIN_HEIGHT);

    const isRow = (row) => row.includes(currentShape.currentCenter);

    const isInsideGrid =
      (currentShape.shape === 'i' ? y < MAIN_WIDTH - 1 && x > 1 : x > 0) &&
      x < MAIN_WIDTH - 1;

    const isRotateable = !isRow(TOP_ROW) && !isRow(BOTTOM_ROW) && isInsideGrid;

    if (isRotateable) {
      removeShapeAtPosition();
      setCurrentRotation();

      const rotatedShape = getPosition(
        currentShape.currentCenter,
        currentShape.shape,
        currentShape.currentRotation
      );

      const isRotatingIntoDeadShape = someInRowHasClassName(
        rotatedShape,
        'dead'
      );

      if (!isRotatingIntoDeadShape) {
        currentShape.currentPosition = rotatedShape;
      }

      addShapeAtPosition();
    }
  }

  function setCurrentRotation() {
    if (currentShape.shape !== 'o') {
      currentShape.incrementRotation();
    }

    if (currentShape.currentRotation === currentShape.possibleRotations) {
      currentShape.currentRotation = 0;
    }
  }

  function moveShapeToRight() {
    const isMovingOffRight = currentShape.currentPosition.some(
      (cell) => cell % MAIN_WIDTH === MAIN_WIDTH - 1
    );

    if (!isMovingOffRight) {
      removeShapeAtPosition();

      const movedPosition = currentShape.currentPosition.map(
        (cell) => cell + 1
      );

      const isColliding = someInRowHasClassName(movedPosition, 'dead');

      if (!isColliding) {
        currentShape.currentPosition = movedPosition;
        currentShape.incrementCurrentCenter();
      }

      addShapeAtPosition();
    }
  }

  function moveShapeToLeft() {
    const isMovingOffLeft = currentShape.currentPosition.some(
      (cell) => cell % MAIN_WIDTH === 0
    );

    if (!isMovingOffLeft) {
      removeShapeAtPosition();

      const movedPosition = currentShape.currentPosition.map(
        (cell) => cell - 1
      );

      const isColliding = someInRowHasClassName(movedPosition, 'dead');

      if (!isColliding) {
        currentShape.currentPosition = movedPosition;
        currentShape.decreaseCurrentCenter();
      }

      addShapeAtPosition();
    }
  }

  function softDrop() {
    if (!isColliding()) {
      removeShapeAtPosition();
      getNewCenter();

      const isOffGrid = currentShape.newPosition.some(
        (cell) => cell > MAIN_CELL_COUNT - 1
      );

      if (!isOffGrid) {
        currentShape.currentPosition = currentShape.newPosition;
        addShapeAtPosition();
      }
    }
  }

  function checkIfLineClear() {
    createArrayOfRows();

    for (let row = MAIN_HEIGHT - 1; row > 0; row--) {
      while (
        MAIN_GRID_ROWS[row].every((cell) => cell.className.includes('dead'))
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
    const isInsideGrid =
      currentShape.currentCenter < MAIN_CELL_COUNT - MAIN_WIDTH;

    if (isInsideGrid) {
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
    getNewPosition();
  }

  function removeShapeAtPosition() {
    currentShape.currentPosition.forEach((i) =>
      MAIN_CELLS[i].removeAttribute('class')
    );
  }

  function setClassToDead() {
    currentShape.currentPosition.forEach((i) =>
      MAIN_CELLS[i].classList.add(currentShape.dead)
    );
  }

  function setClassToFalling() {
    currentShape.currentPosition.forEach((i) =>
      MAIN_CELLS[i].classList.add(currentShape.falling)
    );
  }

  function getNewPosition() {
    currentShape.newPosition = currentShape.currentPosition.map(
      (cell) => cell + MAIN_WIDTH
    );

    return currentShape.newPosition;
  }

  function addPreviewShape() {
    nextShape.previewPosition.forEach((i) =>
      NEXT_CELLS[i].classList.add(nextShape.falling)
    );
  }

  function removePreviewShape() {
    nextShape.previewPosition.forEach((i) =>
      NEXT_CELLS[i].classList.remove(nextShape.falling)
    );
  }

  function clearAllCells() {
    MAIN_CELLS.forEach((cell) => {
      cell.removeAttribute('class');
    });
  }

  DOM_ELEMENTS.resetButton.addEventListener('click', resetGame);
  DOM_ELEMENTS.startButton.addEventListener('click', startPauseToggle);
  DOM_ELEMENTS.gameOverScreen.addEventListener('click', removeGameOverScreen);
  window.addEventListener('keydown', handleKeyDown);
}

window.addEventListener('DOMContentLoaded', init);
