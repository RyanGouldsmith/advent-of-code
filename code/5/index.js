const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const getPolymers = async () => {
  return await readFileAsync('./input.txt', 'utf8');
};

function isSameLetter(firstCharacter, secondCharacter) {
  return firstCharacter.toLowerCase() === secondCharacter.toLowerCase();
}

function hasOppositePolarity(firstCharacter, secondCharacter) {
  if (
    firstCharacter.toLowerCase() === firstCharacter &&
    secondCharacter.toUpperCase() === secondCharacter
  ) {
    return true;
  } else if (
    firstCharacter.toUpperCase() === firstCharacter &&
    secondCharacter.toLowerCase() === secondCharacter
  ) {
    return true;
  }
  return false;
}

function calculatePolymersLength(polymers) {
  for (let x = 0; x < polymers.length; x++) {
    const firstCharacter = polymers[x];
    const secondCharacter = polymers[x + 1];
    if (
      firstCharacter &&
      secondCharacter &&
      isSameLetter(firstCharacter, secondCharacter) &&
      hasOppositePolarity(firstCharacter, secondCharacter)
    ) {
      // remove the two characters from the string and reset the counter
      // backwards to go back over the string
      polymers = polymers.slice(0, x) + polymers.slice(x + 2, polymers.length);
      x -= x <= 0 ? 1 : 2;
    }
  }
  return polymers.length;
}

async function calculatePolymers() {
  let polymers = await getPolymers();
  const polymerLength = calculatePolymersLength(polymers);
  console.log('Polymer Length minus same character polarity: ', polymerLength);
}

async function calculateShortestPolymer() {
  const alphabet = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ];

  const polymers = await getPolymers();

  const shortest = alphabet.reduce(
    (currentShortest, currentCharacter, currentIndex) => {
      const excludeCharacterRegex = `(?![${currentCharacter}]).`;
      const regex = new RegExp(excludeCharacterRegex, 'gi');
      let differentCharacters = polymers.match(regex).join('');
      const length = calculatePolymersLength(differentCharacters);

      if (currentIndex === 0) {
        currentShortest = length;
      } else if (length < currentShortest) {
        currentShortest = length;
      }

      return currentShortest;
    },
    0
  );

  console.log('Removing characters the shortest polymer is ', shortest);
}

calculatePolymers();
calculateShortestPolymer();
