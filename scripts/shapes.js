import { SHAPES, TOP_ROW } from "./constants.js";

class Shape {
  constructor(renderPosition, shape) {
    this.topRow = TOP_ROW;
    this.currentRotation = renderPosition;
    this.currentPosition = renderPosition;
    this.nextPosition = [];
    this.falling = `${shape}_falling`;
    this.dead = `${shape}_dead`;
  }
  rotateShape() {
    this.currentPosition = iRotation;
  }
}

function generateShape() {
  switch (getRandomShape()) {
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

function getRandomShape() {
  const randomShape = Math.floor(Math.random() * SHAPES.length);
  return randomShape;
}

// const iRotation = {
//   i: {
//     deg0: [3, 4, 5, 6],
//     deg90: [5, 25, 25, 35],
//   },
//   j: {
//     deg0: [4, 5, 6, 16],
//     deg90: [5, 15, 24, 25],
//     deg180: [4, 14, 15, 16],
//   },
// };

// i roation = [5, 15, 25, 35]

export { generateShape };
