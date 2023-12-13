import run from 'aocrunner';

enum Direction {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
}

const parseInput = (rawInput: string) => rawInput;

const getColumn = (input: string[], index: number) =>
  input.map((row) => row[index]).join('');

const getDifferenceCount = (leftValue: string, rightValue: string) => {
  let differences = 0;

  for (const chart in leftValue.split('')) {
    if (leftValue[chart] !== rightValue[chart]) {
      differences++;
    }
  }

  return differences;
};

const getDirectionValue = (
  input: string[],
  direction: Direction,
  exception = 0,
) => {
  const isVertical = direction === Direction.VERTICAL;

  const base = isVertical ? 1 : 100;
  const length = isVertical ? input[0].length : input.length;

  for (let i = 0; i < length - 1; i++) {
    let count = 0;
    let differences = 0;

    while (differences <= exception) {
      const left = i - count;
      const right = i + count + 1;

      const leftValue = isVertical ? getColumn(input, left) : input[left];
      const rightValue = isVertical ? getColumn(input, right) : input[right];

      if (!leftValue || !rightValue) {
        break;
      }

      differences += getDifferenceCount(leftValue, rightValue);
      count++;
    }

    if (differences === exception) {
      return (i + 1) * base;
    }
  }
  return 0;
};

const calculateMirrors = (input: string, exception = 0) => {
  const fields = input.split('\n\n');

  return fields.reduce((total, field) => {
    const newInput = field.split('\n');

    const getDirection = (direction: Direction) =>
      getDirectionValue(newInput, direction, exception);

    const horizontal = getDirection(Direction.HORIZONTAL);

    if (horizontal) {
      return total + horizontal;
    }

    const vertical = getDirection(Direction.VERTICAL);

    return total + vertical;
  }, 0);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return calculateMirrors(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return calculateMirrors(input, 1);
};

const testInput = `
  #.##..##.
  ..#.##.#.
  ##......#
  ##......#
  ..#.##.#.
  ..##..##.
  #.#.##.#.

  #...##..#
  #....#..#
  ..##..###
  #####.##.
  #####.##.
  ..##..###
  #....#..#
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 405,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 400,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
