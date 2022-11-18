import { INITIAL_CENTER, SHAPES } from "./constants.js";

class Shape {
  constructor(renderPosition, previewPosition, possibleRotations, shape) {
    this.shape = shape;
    this.renderPosition = renderPosition;
    this.currentPosition = renderPosition;
    this.previewPosition = previewPosition;
    this.currentCenter = INITIAL_CENTER;
    this.currentRotation = 0;
    this.possibleRotations = possibleRotations;
    this.newPosition = [];
    this.falling = `${shape}_falling`;
    this.dead = `${shape}_dead`;
  }
  incrementRotation() {
    this.currentRotation++;
  }
  incrementCurrentCenter() {
    this.currentCenter++;
  }
  decreaseCurrentCenter() {
    this.currentCenter--;
  }
}

function generateRandomShape() {
  switch (getRandomShapeIndex()) {
    case 0:
      return new Shape(
        [
          INITIAL_CENTER - 2,
          INITIAL_CENTER - 1,
          INITIAL_CENTER,
          INITIAL_CENTER + 1,
        ],
        [7, 8, 9, 10],
        2,
        "i"
      );
    case 1:
      return new Shape(
        [
          INITIAL_CENTER - 1,
          INITIAL_CENTER,
          INITIAL_CENTER + 1,
          INITIAL_CENTER + 11,
        ],
        [8, 9, 10, 16],
        4,
        "j"
      );
    case 2:
      return new Shape(
        [
          INITIAL_CENTER - 1,
          INITIAL_CENTER,
          INITIAL_CENTER + 1,
          INITIAL_CENTER + 9,
        ],
        [8, 9, 10, 14],
        4,
        "l"
      );
    case 3:
      return new Shape(
        [
          INITIAL_CENTER,
          INITIAL_CENTER + 1,
          INITIAL_CENTER + 9,
          INITIAL_CENTER + 10,
        ],
        [9, 10, 14, 15],
        2,
        "s"
      );
    case 4:
      return new Shape(
        [
          INITIAL_CENTER - 1,
          INITIAL_CENTER,
          INITIAL_CENTER + 10,
          INITIAL_CENTER + 11,
        ],
        [8, 9, 15, 16],
        2,
        "z"
      );
    case 5:
      return new Shape(
        [
          INITIAL_CENTER - 1,
          INITIAL_CENTER,
          INITIAL_CENTER + 1,
          INITIAL_CENTER + 10,
        ],
        [8, 9, 10, 15],
        4,
        "t"
      );
    case 6:
      return new Shape(
        [
          INITIAL_CENTER - 1,
          INITIAL_CENTER,
          INITIAL_CENTER + 9,
          INITIAL_CENTER + 10,
        ],
        [8, 9, 14, 15],
        1,
        "o"
      );
  }
}
function getRandomShapeIndex() {
  const randomShapeIndex = Math.floor(Math.random() * SHAPES.length);
  return randomShapeIndex;
}

function getRotatedPosition(center, shape, currentRotation) {
  const shapes = {
    // I shape
    i: {
      rotation: [
        [center - 2, center - 1, center, center + 1],
        [center - 10, center, center + 10, center + 20],
      ],
    },

    // J shape
    j: {
      rotation: [
        [center - 1, center, center + 1, center + 11],
        [center - 10, center, center + 9, center + 10],
        [center - 11, center - 1, center, center + 1],
        [center - 10, center - 9, center, center + 10],
      ],
    },
    // L shape
    l: {
      rotation: [
        [center - 1, center, center + 1, center + 9],
        [center - 11, center - 10, center, center + 10],
        [center - 9, center - 1, center, center + 1],
        [center - 10, center, center + 10, center + 11],
      ],
    },

    // S shape
    s: {
      rotation: [
        [center, center + 1, center + 9, center + 10],
        [center - 10, center, center + 1, center + 11],
      ],
    },

    // Z shape
    z: {
      rotation: [
        [center - 1, center, center + 10, center + 11],
        [center - 9, center, center + 1, center + 10],
      ],
    },

    // T shape
    t: {
      rotation: [
        [center - 1, center, center + 1, center + 10],
        [center - 10, center - 1, center, center + 10],
        [center - 10, center - 1, center, center + 1],
        [center - 10, center, center + 1, center + 10],
      ],
    },

    // O shape
    o: {
      rotation: [[center - 1, center, center + 9, center + 10]],
    },
  };
  return shapes[shape].rotation[currentRotation];
}

export { generateRandomShape, getRotatedPosition };
