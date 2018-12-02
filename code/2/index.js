const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const getArrayOfIds = async () => {
  const data = await readFileAsync('./input.txt', 'utf8');
  return data.split('\n');
};

const TWO = 2;
const THREE = 3;

function hasNumberOfDuplicates(calculatedObject, number) {
  return Object.values(calculatedObject).find(item => item === number);
}

async function getCheckSum() {
  const arrayOfIds = await getArrayOfIds();
  const output = arrayOfIds.reduce(
    (total, currentStringId) => {
      const sortedSplitString = currentStringId.split('').sort();
      const calculatedObject = sortedSplitString.reduce(
        (characterCount, character) => {
          character in characterCount
            ? (characterCount[character] += 1)
            : (characterCount[character] = 1);
          return characterCount;
        },
        {}
      );
      const hasTwoDuplicates = hasNumberOfDuplicates(calculatedObject, TWO);
      const hasThreeDuplicates = hasNumberOfDuplicates(calculatedObject, THREE);
      if (hasTwoDuplicates) {
        total.two += 1;
      }

      if (hasThreeDuplicates) {
        total.three += 1;
      }

      return total;
    },
    { two: 0, three: 0 }
  );
  const checkSum = output.two * output.three;
  console.log('checksum is : ', checkSum);
}

async function getCommonCharacters() {
  const arrayOfIds = await getArrayOfIds();
  const missingStrings = new Set();
  const foundItem = arrayOfIds.reduce((item, current) => {
    const currentId = current;
    const foundSubItem = arrayOfIds.reduce((commonCharacters, subCurrent) => {
      const nextId = subCurrent;
      const missingCharacters = [];

      for (
        let currentIdIndex = 0;
        currentIdIndex < currentId.length;
        currentIdIndex++
      ) {
        if (
          currentId.charAt(currentIdIndex) !== nextId.charAt(currentIdIndex)
        ) {
          missingCharacters.push({
            character: currentId[currentIdIndex],
            position: currentIdIndex
          });
        }
      }
      if (missingCharacters.length === 1) {
        missingStrings.add(nextId);
        missingStrings.add(currentId);

        const firstCommonString = missingStrings.values().next().value;
        const firstMissingCharacterPosition = missingCharacters[0].position;
        const modifiedCommonString =
          firstCommonString.slice(0, firstMissingCharacterPosition) +
          firstCommonString.slice(
            firstMissingCharacterPosition + 1,
            firstCommonString.length
          );
        commonCharacters = modifiedCommonString;
        console.log('firstCommonString', firstCommonString);
        console.log('Missing characters are', missingCharacters);
        console.log('Missing Strings are', missingStrings);
        console.log('Common characters are', modifiedCommonString);
      }
      return commonCharacters;
    }, '');

    if (foundSubItem) {
      item = foundSubItem;
    }
    return item;
  }, '');

  console.log('Total Common characters are: ', foundItem);
}
getCheckSum();
getCommonCharacters();
