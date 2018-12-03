const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const getArrayOfClaims = async () => {
  const data = await readFileAsync('./input.txt', 'utf8');
  return data.split('\n');
};

const DEFAULT_MAX_WIDTH = 1000;
const DEFAULT_MAX_HEIGHT = 1000;
const DEFAULT_EMPTY_BOX = '.';
const DUPLICATE_BOX = 'x';

function prettyPrintGrid(grid) {
  let stringGrid = '';
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      stringGrid += grid[x][y] + ' ';
    }
    stringGrid += '\n';
  }
  console.log(stringGrid);
}

async function getGridClaims() {
  const arrayOfClaims = await getArrayOfClaims();
  const gridOfClaims = new Array(DEFAULT_MAX_WIDTH)
    .fill(DEFAULT_EMPTY_BOX)
    .map(() => new Array(DEFAULT_MAX_HEIGHT).fill(DEFAULT_EMPTY_BOX));
  return [arrayOfClaims, gridOfClaims];
}

async function calculateSquareInchOfDuplicateFabric() {
  const [arrayOfClaims, gridOfClaims] = await getGridClaims();

  arrayOfClaims.forEach(elfClaim => {
    const [id, _, location, dimension] = elfClaim.split(' ');
    const [initialX, initialY] = location.split(',');
    const [width, height] = dimension.split('x');
    const xCoordinate = parseInt(initialX);
    const yCoordinate = parseInt(initialY);

    for (let widthToAdd = 0; widthToAdd < width; widthToAdd++) {
      for (let heightToAdd = 0; heightToAdd < height; heightToAdd++) {
        const xPositionToAdd = xCoordinate + widthToAdd;
        const yPositionToAdd = yCoordinate + heightToAdd;
        if (
          gridOfClaims[xPositionToAdd][yPositionToAdd] === DEFAULT_EMPTY_BOX
        ) {
          gridOfClaims[xPositionToAdd][yPositionToAdd] = 1;
        } else {
          gridOfClaims[xPositionToAdd][yPositionToAdd] = DUPLICATE_BOX;
        }
      }
    }
  });

  const foundDuplicateClaims = gridOfClaims.reduce((totalItems, claims) => {
    const foundClaim = claims.filter(item => item === DUPLICATE_BOX);
    totalItems += foundClaim.length;
    return totalItems;
  }, 0);

  prettyPrintGrid(gridOfClaims);

  console.log(
    'Total square inch of Fabric in 2 elf claims are: ',
    foundDuplicateClaims
  );
}

calculateSquareInchOfDuplicateFabric();
