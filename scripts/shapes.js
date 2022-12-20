import { INITIAL_CENTER, SHAPES } from './constants.js';

class Shape {
  constructor(shape, renderPosition, previewPosition, possibleRotations) {
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
        'i',
        getPosition(INITIAL_CENTER, 'i', 0),
        [7, 8, 9, 10],
        2
      );

    case 1:
      return new Shape(
        'j',
        getPosition(INITIAL_CENTER, 'j', 0),
        [8, 9, 10, 16],
        4
      );

    case 2:
      return new Shape(
        'l',
        getPosition(INITIAL_CENTER, 'l', 0),
        [8, 9, 10, 14],
        4
      );

    case 3:
      return new Shape(
        's',
        getPosition(INITIAL_CENTER, 's', 0),
        [9, 10, 14, 15],
        2
      );

    case 4:
      return new Shape(
        'z',
        getPosition(INITIAL_CENTER, 'z', 0),
        [8, 9, 15, 16],
        2
      );

    case 5:
      return new Shape(
        't',
        getPosition(INITIAL_CENTER, 't', 0),
        [8, 9, 10, 15],
        4
      );

    case 6:
      return new Shape(
        'o',
        getPosition(INITIAL_CENTER, 'o', 0),
        [8, 9, 14, 15],
        1
      );
  }
}

function getRandomShapeIndex() {
  const randomShapeIndex = Math.floor(Math.random() * SHAPES.length);
  return randomShapeIndex;
}

function getPosition(center, shape, currentRotation) {
  const shapes = {
    // I shape
    i: {
      rotation: [
        [center - 2, center - 1, center, center + 1],
        [center - 10, center, center + 10, center + 20]
      ]
    },

    // J shape
    j: {
      rotation: [
        [center - 1, center, center + 1, center + 11],
        [center - 10, center, center + 9, center + 10],
        [center - 11, center - 1, center, center + 1],
        [center - 10, center - 9, center, center + 10]
      ]
    },
    // L shape
    l: {
      rotation: [
        [center - 1, center, center + 1, center + 9],
        [center - 11, center - 10, center, center + 10],
        [center - 9, center - 1, center, center + 1],
        [center - 10, center, center + 10, center + 11]
      ]
    },

    // S shape
    s: {
      rotation: [
        [center, center + 1, center + 9, center + 10],
        [center - 10, center, center + 1, center + 11]
      ]
    },

    // Z shape
    z: {
      rotation: [
        [center - 1, center, center + 10, center + 11],
        [center - 9, center, center + 1, center + 10]
      ]
    },

    // T shape
    t: {
      rotation: [
        [center - 1, center, center + 1, center + 10],
        [center - 10, center - 1, center, center + 10],
        [center - 10, center - 1, center, center + 1],
        [center - 10, center, center + 1, center + 10]
      ]
    },

    // O shape
    o: {
      rotation: [[center - 1, center, center + 9, center + 10]]
    }
  };
  return shapes[shape].rotation[currentRotation];
}

export { generateRandomShape, getPosition };
