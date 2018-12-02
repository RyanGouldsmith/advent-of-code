const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const getArrayOfFrequencies = async () => {
  const data = await readFileAsync('./input.txt', 'utf8');
  return data.split('\n');
};

async function getPartOneCount() {
  const arrayOfData = await getArrayOfFrequencies();
  const totalData = arrayOfData.reduce(
    (total, current) => (total += parseInt(current)),
    0
  );
  console.log('totalCount: ', totalData);
}

async function getFirstFrequency() {
  let total = 0;
  let seenFrequencies = [0];
  let notFoundDuplicate = true;

  const arrayOfData = await getArrayOfFrequencies();

  while (notFoundDuplicate) {
    arrayOfData.some(frequency => {
      total += parseInt(frequency);
      if (seenFrequencies.includes(total)) {
        console.log('First Frequency is: ', total);
        notFoundDuplicate = false;
        return true;
      }
      seenFrequencies.push(total);
    });
  }
}

getPartOneCount();
getFirstFrequency();
