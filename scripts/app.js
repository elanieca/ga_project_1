import {
  DOM_ELEMENTS,
  MAIN_COLS,
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

function init() {
  let isGameRunning = false;
  let currentShape = null;
  let nextShape = null;
  let shapeFall;
  let rotationCell = 15;

  class Shape {
    constructor(renderPosition, shape) {
      this.shape = shape;
      this.topRow = TOP_ROW; // if filled with div of class dead -> game over
      this.renderPosition = renderPosition;
      this.currentPosition = renderPosition;
      this.rotationCell = 15;
      this.currentRotation = 0;
      this.currentRotationPoint = null;
      this.newPosition = [];
      this.falling = `${shape}_falling`;
      this.dead = `${shape}_dead`;
    }
  }

  function generateRandomShape() {
    switch (getRandomShapeIndex()) {
      case 0:
        return new Shape([3, 4, 5, 6], "i");
      case 1:
        return new Shape([4, 5, 6, 16], "j");
      case 2:
        return new Shape([4, 5, 6, 14], "l");
      case 3:
        return new Shape([5, 6, 14, 15], "s");
      case 4:
        return new Shape([4, 5, 15, 16], "z");
      case 5:
        return new Shape([4, 5, 6, 15], "t");
      case 6:
        return new Shape([4, 5, 14, 15], "o");
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
    updateRotationCell();
  }

  function moveShapeToNewPosition() {
    removeShapeAtPosition();
    currentShape.currentPosition = getNewPosition();
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

  renderRandomShape();
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
      (cell) => cell + MAIN_COLS
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

  // function getNewRotationCell() {
  //   if (
  //     currentShape.rotationCell <
  //     MAIN_CELL_COUNT -
  //       MAIN_COLS * 2 /*  || coliding block has class of dead) */
  //   ) {
  //     currentShape.rotationCell += MAIN_COLS;
  //   } else {
  //     currentShape.rotationCell = INITIAL_ROTATION_CELL;
  //   }
  //   rotationCell = currentShape.rotationCell;
  // }

  function updateRotationCell() {
    rotationCell = rotationCell + 10;
  }

  function checkIfRotated() {
    if (currentShape.currentPosition[2] !== currentShape.rotationCell) {
      currentShape.currentPosition =
        rotations[currentShape.shape].rotation[currentShape.currentRotation];
    }
  }

  function rotateShape() {
    removeShapeAtPosition();
    if (currentShape.shape !== "o") {
      currentShape.currentRotation++;
    }
    if (
      currentShape.currentRotation >=
      rotations[currentShape.shape].rotation.length
    ) {
      currentShape.currentRotation = 0;
    }

    const rotatedShape =
      rotations[currentShape.shape].rotation[currentShape.currentRotation];

    if (
      currentShape.currentPosition !== currentShape.renderPosition &&
      currentShape.shape !== "o"
    ) {
      currentShape.currentPosition = rotatedShape;
    }
    addShapeAtPosition();
  }

  const rotations = {
    i: {
      rotation: [
        [rotationCell - 2, rotationCell - 1, rotationCell, rotationCell + 1],
        [rotationCell - 10, rotationCell, rotationCell + 10, rotationCell + 20],
      ],
    },

    j: {
      rotation: [
        [rotationCell - 1, rotationCell, rotationCell + 1, rotationCell + 11],
        [rotationCell - 10, rotationCell, rotationCell + 9, rotationCell + 10],
        [rotationCell - 11, rotationCell - 1, rotationCell, rotationCell + 1],
        [rotationCell - 10, rotationCell - 9, rotationCell, rotationCell + 10],
      ],
    },

    l: {
      rotation: [
        [rotationCell - 1, rotationCell, rotationCell + 1, rotationCell + 9],
        [rotationCell - 11, rotationCell - 10, rotationCell, rotationCell + 10],
        [rotationCell - 9, rotationCell - 1, rotationCell, rotationCell + 1],
        [rotationCell - 10, rotationCell, rotationCell + 10, rotationCell + 11],
      ],
    },

    s: {
      rotation: [
        [rotationCell, rotationCell + 1, rotationCell + 9, rotationCell + 10],
        [rotationCell - 10, rotationCell, rotationCell + 1, rotationCell + 11],
      ],
    },

    z: {
      rotation: [
        [rotationCell - 1, rotationCell, rotationCell + 10, rotationCell + 11],
        [rotationCell - 9, rotationCell, rotationCell + 1, rotationCell + 10],
      ],
    },

    t: {
      rotation: [
        [rotationCell - 1, rotationCell, rotationCell + 1, rotationCell + 10],
        [rotationCell - 10, rotationCell - 1, rotationCell, rotationCell + 10],
        [rotationCell - 10, rotationCell - 1, rotationCell, rotationCell + 1],
        [rotationCell - 10, rotationCell, rotationCell + 1, rotationCell + 10],
      ],
    },

    o: {
      rotation: [
        [rotationCell - 1, rotationCell, rotationCell + 9, rotationCell + 10],
      ],
    },
  };

  function handleKeyDown(event) {
    if (
      MAIN_CELLS.some(
        (cell) => cell.className.includes("falling") && isGameRunning
      )
    )
      if (event.key === "ArrowUp") {
        rotateShape();
      }
  }

  window.addEventListener("keydown", handleKeyDown);

  console.log(rotations.i.rotation);

  DOM_ELEMENTS.startButton.addEventListener("click", startPauseToggle);
}

window.addEventListener("DOMContentLoaded", init);
