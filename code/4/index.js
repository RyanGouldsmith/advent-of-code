const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const getArrayOfGuardShifts = async () => {
  const data = await readFileAsync('./input.txt', 'utf8');
  return data.split('\n');
};

function getSleepiestGuard(guards) {
  const guardWhoIsMostAsleep = Object.keys(guards).reduce(
    (sleepiestGuard, nextGuard) =>
      guards[sleepiestGuard].totalMinutesAsleep >
      guards[nextGuard].totalMinutesAsleep
        ? sleepiestGuard
        : nextGuard
  );

  const sleepiestGuardsMinuteLog = guards[guardWhoIsMostAsleep].minuteSleepLog;

  const mostCommonSleepMinute = Object.keys(sleepiestGuardsMinuteLog).sort(
    (guardMinute, otherGuardMinute) =>
      sleepiestGuardsMinuteLog[otherGuardMinute] -
      sleepiestGuardsMinuteLog[guardMinute]
  )[0];

  return [guardWhoIsMostAsleep, mostCommonSleepMinute];
}

async function calculateSleepiestGuard() {
  const guardShifts = await getArrayOfGuardShifts();
  const sortedGuardShifts = guardShifts.sort();
  const guards = {};
  let currentGuard;
  let currentSleepTime;
  for (
    let guardIndex = 0;
    guardIndex < sortedGuardShifts.length;
    guardIndex++
  ) {
    const currentInput = sortedGuardShifts[guardIndex];
    const [date, guardAction] = currentInput.split(']');
    const clockedMinutes = date.split(':')[1];

    if (guardAction.includes('Guard')) {
      currentGuard = guardAction.match(/\d+/g)[0];
      if (!guards.hasOwnProperty(currentGuard)) {
        guards[currentGuard] = {
          totalMinutesAsleep: 0,
          daysSeen: 1,
          minuteSleepLog: {}
        };
      }
    }

    if (guardAction.includes('asleep')) {
      currentSleepTime = clockedMinutes;
    }

    if (guardAction.includes('wakes')) {
      const duration = clockedMinutes - currentSleepTime;
      guards[currentGuard].totalMinutesAsleep += duration;

      for (let i = currentSleepTime; i < clockedMinutes; i++) {
        guards[currentGuard].minuteSleepLog[i] =
          guards[currentGuard].minuteSleepLog[i] !== undefined
            ? (guards[currentGuard].minuteSleepLog[i] += 1)
            : (guards[currentGuard].minuteSleepLog[i] = 1);
      }
    }
  }

  const [guardWhoIsMostAsleep, mostCommonSleepMinute] = getSleepiestGuard(
    guards
  );

  const guardCommonMinuteChecksum =
    guardWhoIsMostAsleep * mostCommonSleepMinute;

  console.log('Guard ID with the most minutes asleep: ', guardWhoIsMostAsleep);
  console.log("Sleepiest Guard's most minute asleep: ", mostCommonSleepMinute);
  console.log('Guard to Minute Checksum: ', guardCommonMinuteChecksum);

  // part 2
  calculateFrequentMinuteChecksum(guards);
}

function getReccuringTime(combinedTimes) {
  const maxTime = Object.keys(combinedTimes).sort(
    (smallTime, nextTime) => combinedTimes[nextTime] - combinedTimes[smallTime]
  )[0];
  const recurringTime = combinedTimes[maxTime];

  return [maxTime, recurringTime];
}

function calculateFrequentMinuteChecksum(guards) {
  const combinedTimes = Object.keys(guards).reduce((total, currentGuard) => {
    Object.keys(guards[currentGuard].minuteSleepLog).forEach(item => {
      const exisitingTime = total[item];
      const currentTime = guards[currentGuard].minuteSleepLog[item];

      const updated =
        exisitingTime === undefined || currentTime > exisitingTime
          ? currentTime
          : exisitingTime;
      total = {
        ...total,
        [item]: updated
      };
    });
    return total;
  }, {});

  const [maxTime, recurringTime] = getReccuringTime(combinedTimes);

  const foundGuard = Object.keys(guards).find(guard => {
    const currentGuard = guards[guard];
    return currentGuard.minuteSleepLog[maxTime] === recurringTime;
  });

  const commonChecksum = foundGuard * maxTime;
  console.log('Common checksum of guard and common minute: ', commonChecksum);
}

calculateSleepiestGuard();
