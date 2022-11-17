import {
  INITIAL_CENTER_CELL,
  MAIN_CELLS,
  MAIN_WIDTH,
  SHAPES,
  TOP_ROW,
} from "./constants.js";

class Shape {
  constructor(renderPosition, previewPosition, possibleRotations, shape) {
    this.shape = shape;
    this.renderPosition = renderPosition;
    this.currentPosition = renderPosition;
    this.previewPosition = previewPosition;
    this.centerCell = INITIAL_CENTER_CELL;
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
      return new Shape([3, 4, 5, 6], [7, 8, 9, 10], 2, "i");
    case 1:
      return new Shape([4, 5, 6, 16], [8, 9, 10, 16], 4, "j");
    case 2:
      return new Shape([4, 5, 6, 14], [8, 9, 10, 14], 4, "l");
    case 3:
      return new Shape([5, 6, 14, 15], [9, 10, 14, 15], 2, "s");
    case 4:
      return new Shape([4, 5, 15, 16], [8, 9, 15, 16], 2, "z");
    case 5:
      return new Shape([4, 5, 6, 15], [8, 9, 10, 15], 4, "t");
    case 6:
      return new Shape([4, 5, 14, 15], [8, 9, 14, 15], 1, "o");
  }
}
function getRandomShapeIndex() {
  const randomShapeIndex = Math.floor(Math.random() * SHAPES.length);
  return randomShapeIndex;
}

function getRotation(center, shape, currentRotation) {
  const rotations = {
    // the stick
    i: {
      rotation: [
        [center - 2, center - 1, center, center + 1],
        [center - 10, center, center + 10, center + 20],
      ],
    },

    // the J shape
    j: {
      rotation: [
        [center - 1, center, center + 1, center + 11],
        [center - 10, center, center + 9, center + 10],
        [center - 11, center - 1, center, center + 1],
        [center - 10, center - 9, center, center + 10],
      ],
    },
    // the L shape
    l: {
      rotation: [
        [center - 1, center, center + 1, center + 9],
        [center - 11, center - 10, center, center + 10],
        [center - 9, center - 1, center, center + 1],
        [center - 10, center, center + 10, center + 11],
      ],
    },
    // the s shape
    s: {
      rotation: [
        [center, center + 1, center + 9, center + 10],
        [center - 10, center, center + 1, center + 11],
      ],
    },

    // the z shape
    z: {
      rotation: [
        [center - 1, center, center + 10, center + 11],
        [center - 9, center, center + 1, center + 10],
      ],
    },

    // the t shape
    t: {
      rotation: [
        [center - 1, center, center + 1, center + 10],
        [center - 10, center - 1, center, center + 10],
        [center - 10, center - 1, center, center + 1],
        [center - 10, center, center + 1, center + 10],
      ],
    },

    o: {
      rotation: [[center - 1, center, center + 9, center + 10]],
    },
  };
  return rotations[shape].rotation[currentRotation];
}

export { generateRandomShape, getRotation };
