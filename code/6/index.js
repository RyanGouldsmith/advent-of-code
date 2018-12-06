const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const getCoordinates = async () => {
  const data = await readFileAsync('./input.txt', 'utf8');
  return data.split('\n');
};

function getMaxSize(coordinates) {
  let maxX = 0;
  let maxY = 0;

  coordinates.forEach(coordinate => {
    const [x, y] = coordinate;
    // add gap to match demo
    if (y > maxY) maxY = parseInt(y);
    if (x > maxX) maxX = parseInt(x);
  });

  return maxX > maxY ? maxX + 1 : maxY + 1;
}

function prettyPrintGrid(grid) {
  let stringGrid = '';
  for (let x = 0; x < grid.length - 1; x++) {
    for (let y = 0; y < grid[x].length - 1; y++) {
      stringGrid += grid[x][y] + ' ';
    }
    stringGrid += '\n';
  }
  console.log(stringGrid);
}

function populateGrid(coords, grid, indexList) {
  coords.forEach((coordString, index) => {
    const [x, y] = coordString;
    const xCoords = parseInt(x);
    const yCoords = parseInt(y);
    grid[yCoords][xCoords] = index;
    indexList.add(index);
  });
}

function calculateManhatten(x, y) {
  const [x0, x1] = x;
  const [y0, y1] = y;
  return Math.abs(x1 - x0) + Math.abs(y1 - y0);
}

function calculateManhattenOnGrid(coords, grid, indexList) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let manhattenDistance = [];
      for (let coord = 0; coord < coords.length; coord++) {
        const [xCoord, yCoord] = coords[coord];
        manhattenDistance.push({
          character: coord,
          distance: calculateManhatten([x, xCoord], [y, yCoord])
        });
      }
      manhattenDistance.sort(
        (item, otherItem) => item.distance - otherItem.distance
      );

      if (manhattenDistance[0].distance === manhattenDistance[1].distance) {
        grid[y][x] = '.';
      } else {
        grid[y][x] = manhattenDistance[0].character;
      }

      if (
        x === 0 ||
        y === 0 ||
        x === grid[x].length - 1 ||
        y === grid[y].length - 1
      ) {
        indexList.delete(grid[y][x]);
      }
    }
  }
}

function calculateLargestNonInfiniteArea(grid, indexList) {
  const flattenGrid = grid.reduce((a, b) => a.concat(b), []);
  return Array.from(indexList).reduce((largestSum, current) => {
    const commonLength = flattenGrid.filter(item => {
      return item === current;
    }).length;
    if (commonLength > largestSum) {
      largestSum = commonLength;
    }
    return largestSum;
  }, 0);
}

async function calculateLargestNonInfiniteSegment() {
  const coords = await getCoordinates();
  const arrayOfCoords = coords.map(coord => coord.split(','));
  const maxSize = getMaxSize(arrayOfCoords);
  const grid = new Array(parseInt(maxSize))
    .fill('.')
    .map(() => new Array(parseInt(maxSize)).fill('.'));

  let indexList = new Set();

  populateGrid(arrayOfCoords, grid, indexList);
  calculateManhattenOnGrid(arrayOfCoords, grid, indexList);
  //prettyPrintGrid(grid); uncomment on smaller sample
  const nonInfiniteArea = calculateLargestNonInfiniteArea(grid, indexList);

  console.log('Largest Non-Infinite area is', nonInfiniteArea);
}

calculateLargestNonInfiniteSegment();
