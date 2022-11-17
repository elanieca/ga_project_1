import {
  DOM_ELEMENTS,
  MAIN_WIDTH,
  MAIN_CELL_COUNT,
  NEXT_CELL_COUNT,
  MAIN_CELLS,
  NEXT_CELLS,
  GAME_TIME,
  INITIAL_ROTATION_CELL,
  TOP_ROW,
  SHAPES,
} from "./constants.js";

import { createGameBoard } from "./board.js";
import { getRotation } from "./rotations.js";

function init() {
  let isGameRunning = false;
  let currentShape = null;
  let nextShape = null;
  let shapeFall;

  class Shape {
    constructor(renderPosition, possibleRotations, shape) {
      this.shape = shape;
      this.topRow = TOP_ROW; // if filled with div of class dead -> game over
      this.renderPosition = renderPosition;
      this.currentPosition = renderPosition;
      this.centerCell = Math.floor(MAIN_CELLS / 2) + MAIN_CELLS * 2; // throws back shape to center if moved in first line
      this.currentRotation = 0;
      this.possibleRotations = possibleRotations;
      this.newPosition = [];
      this.falling = `${shape}_falling`;
      this.dead = `${shape}_dead`;
    }
    incrementRotation() {
      this.currentRotation++;
    }
    incrementCenterCell() {
      this.centerCell++;
    }
    decreaseCenterCell() {
      this.centerCell--;
    }
  }

  function generateRandomShape() {
    switch (getRandomShapeIndex()) {
      case 0:
        return new Shape([3, 4, 5, 6], 2, "i");
      case 1:
        return new Shape([4, 5, 6, 16], 4, "j");
      case 2:
        return new Shape([4, 5, 6, 14], 4, "l");
      case 3:
        return new Shape([5, 6, 14, 15], 2, "s");
      case 4:
        return new Shape([4, 5, 15, 16], 2, "z");
      case 5:
        return new Shape([4, 5, 6, 15], 4, "t");
      case 6:
        return new Shape([4, 5, 14, 15], 1, "o");
    }
  }

  function getRandomShapeIndex() {
    const randomShapeIndex = Math.floor(Math.random() * SHAPES.length);
    return randomShapeIndex;
  }

  createGameBoard();

  function letShapeFall() {
    if (MAIN_CELLS.some((cell) => cell.className.includes("falling"))) {
      shapeFall = setInterval(() => {
        if (
          currentShape.newPosition.some((i) => i >= MAIN_CELL_COUNT) ||
          currentShape.newPosition.some((cell) =>
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
            letShapeFall();
          }
        } else {
          move();
        }
      }, GAME_TIME);
    } else {
      renderRandomShape();
      letShapeFall();
    }
  }

  function renderRandomShape() {
    nextShape === null
      ? (currentShape = generateRandomShape())
      : (currentShape = nextShape);
    addShapeAtPosition();
  }

  function move() {
    moveShapeToNewPosition();
    // getNewCenterCell();
  }

  function moveShapeToNewPosition() {
    getNewCenterCell();
    removeShapeAtPosition();
    currentShape.currentPosition = getRotation(
      currentShape.centerCell,
      currentShape.shape,
      currentShape.currentRotation
    );
    addShapeAtPosition();
  }

  function addShapeAtPosition() {
    setCurrentShapeToFalling();
    getNewPosition();
  }

  function deactivateCurrentShape() {
    clearInterval(shapeFall);
    removeShapeAtPosition();
    setCurrentShapeToDead();
  }

  function removeShapeAtPosition() {
    currentShape.currentPosition.forEach((cell) =>
      MAIN_CELLS[cell].classList.remove(currentShape.falling)
    );
  }

  function setCurrentShapeToFalling() {
    currentShape.currentPosition.forEach((cell) =>
      MAIN_CELLS[cell].classList.add(currentShape.falling)
    );
  }

  function setCurrentShapeToDead() {
    currentShape.currentPosition.forEach((cell) =>
      MAIN_CELLS[cell].classList.add(currentShape.dead)
    );
  }

  function getNewPosition() {
    currentShape.newPosition = currentShape.currentPosition.map(
      (cell) => cell + MAIN_WIDTH
    );
    return currentShape.newPosition;
  }

  function startPauseToggle() {
    !isGameRunning ? startGame() : pauseGame();
  }

  function startGame() {
    isGameRunning = true;
    DOM_ELEMENTS.startButton.textContent = "PAUSE";
    letShapeFall();
  }
  function pauseGame() {
    isGameRunning = false;
    DOM_ELEMENTS.startButton.textContent = "RESUME";
    clearInterval(shapeFall);
  }

  function endGame() {
    isGameRunning = false;
    clearInterval(shapeFall);
    MAIN_CELLS.forEach((cell) => {
      cell.removeAttribute("class");
    });
  }

  function getNewCenterCell() {
    if (currentShape.centerCell < MAIN_CELL_COUNT - MAIN_WIDTH * 2) {
      currentShape.centerCell += MAIN_WIDTH;
    } else {
      currentShape.centerCell = INITIAL_ROTATION_CELL;
    }
  }

  function rotateShape() {
    removeShapeAtPosition();
    if (
      currentShape.currentPosition !== currentShape.renderPosition &&
      currentShape.shape !== "o"
    ) {
      currentShape.incrementRotation();
    }

    if (currentShape.currentRotation >= currentShape.possibleRotations) {
      currentShape.currentRotation = 0;
    }

    const currentPosition = currentShape.currentPosition;
    const rotatedShape = getRotation(
      85,
      currentShape.shape,
      currentShape.currentRotation
    );

    if (
      currentShape.currentPosition !== currentShape.renderPosition &&
      currentShape.shape !== "o"
    ) {
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

  function moveShapeToRight() {
    removeShapeAtPosition();
    const movedPosition = currentShape.currentPosition.map((cell) => cell + 1);
    currentShape.currentPosition = movedPosition;
    currentShape.incrementCenterCell();
    addShapeAtPosition();
  }

  function moveShapeToLeft() {
    removeShapeAtPosition();
    const movedPosition = currentShape.currentPosition.map((cell) => cell - 1);
    currentShape.currentPosition = movedPosition;
    currentShape.decreaseCenterCell();
    addShapeAtPosition();
  }

  function handleKeyDown(event) {
    if (
      MAIN_CELLS.some(
        (cell) => cell.className.includes("falling") /* && isGameRunning */
      )
    ) {
      if (event.key === "ArrowUp") {
        rotateShape();
      }
      if (event.key === "ArrowRight") {
        moveShapeToRight();
      }
      if (event.key === "ArrowLeft") {
        moveShapeToLeft();
      }
    }
  }

  //  } else if (event.key === "ArrowDown" && y < cellWidth - 1) {
  //     moveDown();
  //   } else if (event.key === "ArrowUp" && y > 0) {
  // function getRotation(center, shape, currentRotation) {
  //   const rotations = {
  //     // the stick
  //     i: {
  //       rotation: [
  //         [center - 2, center - 1, center, center + 1],
  //         [center - 10, center, center + 10, center + 20],
  //       ],
  //     },

  //     // the J shape
  //     j: {
  //       rotation: [
  //         [center - 1, center, center + 1, center + 11],
  //         [center - 10, center, center + 9, center + 10],
  //         [center - 11, center - 1, center, center + 1],
  //         [center - 10, center - 9, center, center + 10],
  //       ],
  //     },
  //     // the L shape
  //     l: {
  //       rotation: [
  //         [center - 1, center, center + 1, center + 9],
  //         [center - 11, center - 10, center, center + 10],
  //         [center - 9, center - 1, center, center + 1],
  //         [center - 10, center, center + 10, center + 11],
  //       ],
  //     },
  //     // the s shape
  //     s: {
  //       rotation: [
  //         [center, center + 1, center + 9, center + 10],
  //         [center - 10, center, center + 1, center + 11],
  //       ],
  //     },

  //     // the z shape
  //     z: {
  //       rotation: [
  //         [center - 1, center, center + 10, center + 11],
  //         [center - 9, center, center + 1, center + 10],
  //       ],
  //     },

  //     // the t shape
  //     t: {
  //       rotation: [
  //         [center - 1, center, center + 1, center + 10],
  //         [center - 10, center - 1, center, center + 10],
  //         [center - 10, center - 1, center, center + 1],
  //         [center - 10, center, center + 1, center + 10],
  //       ],
  //     },

  //     o: {
  //       rotation: [[center - 1, center, center + 9, center + 10]],
  //     },
  //   };
  //   return rotations[shape].rotation[currentRotation];
  // }

  window.addEventListener("keydown", handleKeyDown);

  DOM_ELEMENTS.startButton.addEventListener("click", startPauseToggle);
}

window.addEventListener("DOMContentLoaded", init);
