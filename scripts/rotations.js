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

export { getRotation };
