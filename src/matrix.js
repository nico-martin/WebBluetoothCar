const { arrayToLength } = require('./utils');

const ledMatrix = {
  go: [
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
  ],
  stop: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  hi: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 100, 0, 0, 100, 0, 100, 0, 0, 0],
    [0, 0, 100, 0, 0, 100, 0, 100, 0, 0, 0],
    [0, 0, 100, 100, 100, 100, 0, 100, 0, 0, 0],
    [0, 0, 100, 0, 0, 100, 0, 100, 0, 0, 0],
    [0, 0, 100, 0, 0, 100, 0, 100, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  heart: [
    [0, 0, 0, 0, 100, 0, 100, 0, 0, 0, 0],
    [0, 0, 0, 100, 0, 100, 0, 100, 0, 0, 0],
    [0, 0, 100, 0, 0, 0, 0, 0, 100, 0, 0],
    [0, 0, 100, 0, 0, 0, 0, 0, 100, 0, 0],
    [0, 0, 0, 100, 0, 0, 0, 100, 0, 0, 0],
    [0, 0, 0, 0, 100, 0, 100, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0],
  ],
};

const fixedMatrixSize = (matrix, height, width) =>
  arrayToLength(matrix, height, []).map((row) => arrayToLength(row, width));

const matrixToArray = (rows, height = 7, width = 11) => {
  const cleanSizeMatrix = fixedMatrixSize(rows, height, width);

  return cleanSizeMatrix.reduce(
    (acc, rows) => [...acc, ...rows.map((value) => value)],
    []
  );
};

const arrayToMatrix = (input, height = 7, width = 11) => {
  if (!input || input.length !== height * width) {
    return null;
  }

  return input.reduce((acc, item, index) => {
    const rowRaw = width / index;
    const row = isFinite(rowRaw) ? Math.floor(index / width) : 0;
    const col = index - width * row;

    if (!acc[row]) {
      acc[row] = [];
    }

    acc[row][col] = item;
    return acc;
  }, []);
};

module.exports = {
  ledMatrix,
  matrixToArray,
  arrayToMatrix,
};
