import run from 'aocrunner';
enum Direction {
  NORTH = 'N',
  WEST = 'W',
  SOUTH = 'S',
  EAST = 'E',
}

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((row) => row.split(''));

const moveRocksTo = (input: string[][], direction: Direction) => {
  let field = JSON.parse(JSON.stringify(input)) as string[][];

  if (direction === Direction.SOUTH) {
    field = input.reverse();
  }
  if (direction === Direction.EAST) {
    field = input.map((row) => row.reverse());
  }

  input.forEach((row, index) => {
    const roundedRocks = [...row.join('').matchAll(/O/g)];

    roundedRocks?.forEach((rock) => {
      let rowIndex = index;
      let rockIndex = rock.index as number;

      while (
        field[getRowIndex(rowIndex, direction)]?.[
          getColumnIndex(rockIndex, direction)
        ] === '.'
      ) {
        field[rowIndex][rockIndex] = '.';
        rowIndex = getRowIndex(rowIndex, direction);
        rockIndex = getColumnIndex(rockIndex, direction);
        field[rowIndex][rockIndex] = 'O';
      }
    });
  });

  if (direction === Direction.SOUTH) {
    return field.reverse();
  }
  if (direction === Direction.EAST) {
    return field.map((row) => row.reverse());
  }
  return field;
};

const getRowIndex = (index: number, direction: Direction) => {
  if ([Direction.NORTH, Direction.SOUTH].includes(direction)) {
    return index - 1;
  }
  return index;
};

const getColumnIndex = (index: number, direction: Direction) => {
  if ([Direction.WEST, Direction.EAST].includes(direction)) {
    return index - 1;
  }
  return index;
};

const getFieldTotal = (field: string[][]) =>
  field.reduce((total, value, index) => {
    const rocks = value.filter((value) => value === 'O').length;

    return total + (field.length - index) * rocks;
  }, 0);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const field = moveRocksTo(input, Direction.NORTH);

  return getFieldTotal(field);
};

const part2 = (rawInput: string) => {
  let input = parseInput(rawInput);

  const cache: string[] = [];
  const directions = [
    Direction.NORTH,
    Direction.WEST,
    Direction.SOUTH,
    Direction.EAST,
  ];

  const cycles = 10 ** 9 * directions.length;

  let count = 0;
  let stop = false;

  while (!stop) {
    for (const direction of directions) {
      input = moveRocksTo(input, direction);

      const fieldString = JSON.stringify(input);

      const index = cache.indexOf(fieldString);

      if (index >= 0) {
        const cycle = count - index;
        const remainingCycles = cycles - count;
        const remainingCyclesInCycle = remainingCycles % cycle;

        input = JSON.parse(cache[index + remainingCyclesInCycle - 1]);

        stop = true;
        break;
      }

      cache.push(fieldString);
      count++;
    }
  }

  return getFieldTotal(input);
};

const testInput = `
  O....#....
  O.OO#....#
  .....##...
  OO.#O....O
  .O.....O#.
  O.#..O.#.#
  ..O..#O..O
  .......O..
  #....###..
  #OO..#....
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
