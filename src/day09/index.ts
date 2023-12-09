import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const getNextValue = (numbers: number[]): number => {
  const diff = Array.from(
    { length: numbers.length - 1 },
    (_, index) => numbers[index + 1] - numbers[index],
  );

  const isEmpty = diff.every((value) => value === 0);
  const nextInstanceValue = !isEmpty ? getNextValue(diff) : 0;

  return numbers[numbers.length - 1] + nextInstanceValue;
};

const getNextValueTotal = (rows: string[], shouldReverse = false) =>
  rows
    .map((row) => {
      let numbers = row.split(' ')?.map((value) => Number(value));

      if (shouldReverse) {
        numbers = numbers?.reverse();
      }

      return getNextValue(numbers || []);
    })
    .reduce((total, value) => total + value, 0);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return getNextValueTotal(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return getNextValueTotal(input, true);
};

const inputTest = `
  0 3 6 9 12 15
  1 3 6 10 15 21
  10 13 16 21 30 45
`;

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
