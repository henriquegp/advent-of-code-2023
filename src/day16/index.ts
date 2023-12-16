import run from 'aocrunner';

enum Direction {
  UP = 'up',
  LEFT = 'left',
  RIGHT = 'right',
  DOWN = 'down',
}

interface Slot {
  value: string;
  directions: Direction[];
}

const parseInput = (rawInput: string) =>
  rawInput
    .split('\n')
    .map((line) => line.split('').map((value) => ({ value, directions: [] })));

const convertDirection = (x: number, y: number, direction: Direction) => {
  switch (direction) {
    case Direction.UP:
      return [x - 1, y];
    case Direction.LEFT:
      return [x, y - 1];
    case Direction.RIGHT:
      return [x, y + 1];
    case Direction.DOWN:
      return [x + 1, y];
  }
};

const setEnergy = (
  field: Slot[][],
  x: number,
  y: number,
  direction: Direction,
): void => {
  const isVertical = [Direction.UP, Direction.DOWN].includes(direction);
  const isHorizontal = [Direction.LEFT, Direction.RIGHT].includes(direction);

  let rowIndex = x;
  let columnIndex = y;

  const moveTo = (newDirection: Direction) => {
    const [newRowIndex, newColumnIndex] = convertDirection(
      rowIndex,
      columnIndex,
      newDirection,
    );

    setEnergy(field, newRowIndex, newColumnIndex, newDirection);
  };

  while (
    (rowIndex >= 0 && rowIndex < field.length && isVertical) ||
    (columnIndex >= 0 && columnIndex < field[x]?.length && isHorizontal)
  ) {
    const current = field[rowIndex][columnIndex];

    if (current.directions.includes(direction)) {
      return;
    }

    field[rowIndex][columnIndex] = {
      ...current,
      directions: [...current.directions, direction],
    };

    if (current.value === '|' && isHorizontal) {
      moveTo(Direction.UP);
      moveTo(Direction.DOWN);
      return;
    }

    if (current.value === '-' && isVertical) {
      moveTo(Direction.LEFT);
      moveTo(Direction.RIGHT);
      return;
    }

    if (current.value === '\\') {
      switch (direction) {
        case Direction.UP:
          return moveTo(Direction.LEFT);
        case Direction.LEFT:
          return moveTo(Direction.UP);
        case Direction.RIGHT:
          return moveTo(Direction.DOWN);
        case Direction.DOWN:
          return moveTo(Direction.RIGHT);
      }
    }

    if (current.value === '/') {
      switch (direction) {
        case Direction.UP:
          return moveTo(Direction.RIGHT);
        case Direction.LEFT:
          return moveTo(Direction.DOWN);
        case Direction.RIGHT:
          return moveTo(Direction.UP);
        case Direction.DOWN:
          return moveTo(Direction.LEFT);
      }
    }

    const [newRowIndex, newColumnIndex] = convertDirection(
      rowIndex,
      columnIndex,
      direction,
    );

    rowIndex = newRowIndex;
    columnIndex = newColumnIndex;
  }
};

const getEnergizedAmount = (
  input: Slot[][],
  x: number,
  y: number,
  direction: Direction,
) => {
  const clonedField = JSON.parse(JSON.stringify(input)) as Slot[][];

  setEnergy(clonedField, x, y, direction);

  return clonedField.reduce((total, row) => {
    const value = row.filter((item) => item.directions.length).length;

    return total + value;
  }, 0);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return getEnergizedAmount(input, 0, 0, Direction.RIGHT);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const values: number[] = [];

  input.forEach((_, rowIndex) => {
    const leftValue = getEnergizedAmount(input, rowIndex, 0, Direction.RIGHT);
    const rightValue = getEnergizedAmount(
      input,
      rowIndex,
      input[0].length - 1,
      Direction.LEFT,
    );

    values.push(leftValue);
    values.push(rightValue);
  });

  input[0].forEach((_, columnIndex) => {
    const topValue = getEnergizedAmount(input, 0, columnIndex, Direction.DOWN);
    const bottomValue = getEnergizedAmount(
      input,
      input.length - 1,
      columnIndex,
      Direction.UP,
    );

    values.push(topValue);
    values.push(bottomValue);
  });

  return Math.max(...values);
};

const testInput = String.raw`
  .|...\....
  |.-.\.....
  .....|-...
  ........|.
  ..........
  .........\
  ..../.\\..
  .-.-/..|..
  .|....-|.\
  ..//.|....
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 46,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 51,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
