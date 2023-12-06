import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const calcNumberOfWays = (time: number, distance: number) => {
  let numberOfWays = 0;

  for (let pressTime = 1; pressTime < time; pressTime++) {
    const remaningTime = time - pressTime;

    if (pressTime * remaningTime > distance) {
      numberOfWays += 1;
    }
  }

  return numberOfWays;
};

const part1 = (rawInput: string) => {
  const [timeRow, distanceRow] = parseInput(rawInput);

  const times = timeRow.match(/\d+/g)!;
  const distances = distanceRow.match(/\d+/g)!;

  return Array.from({ length: times.length }, (_, index) => {
    const time = Number(times[index]);
    const distance = Number(distances[index]);

    return calcNumberOfWays(time, distance);
  }).reduce((total, ways) => total * ways, 1);
};

const part2 = (rawInput: string) => {
  const [timeRow, distanceRow] = parseInput(rawInput);

  const time = timeRow.replace(/[^\d]/g, '');
  const distance = distanceRow.replace(/[^\d]/g, '');

  return calcNumberOfWays(Number(time), Number(distance));
};

const testInput = `
  Time:      7  15   30
  Distance:  9  40  200
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
