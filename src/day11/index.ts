import run from 'aocrunner';

type Position = [number, number];

const parseInput = (rawInput: string) => rawInput.split('\n');

const isEmpty = (input: string) => input.replace(/\./g, '') === '';

const getEmptyRowsAndColumns = (input: string[]) => {
  const emptyRows: number[] = [];
  const emptyColumns: number[] = [];

  input.forEach((row, rowIndex) => {
    if (isEmpty(row)) {
      emptyRows.push(rowIndex);
    }
  });

  input[0].split('').forEach((_, columnIndex) => {
    const column = input.map((row) => row[columnIndex]).join('');

    if (isEmpty(column)) {
      emptyColumns.push(columnIndex);
    }
  });

  return { emptyRows, emptyColumns };
};

const expandGalaxyPosition = (
  emptySpaces: number[],
  position: number,
  expansion: number,
) => {
  const emptySpacesBefore = emptySpaces.filter((space) => space < position);

  return emptySpacesBefore.length * expansion + position;
};

const calculateDistance = ([x1, y1]: Position, [x2, y2]: Position) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

const calculateGalaxyDistances = (input: string[], expansion = 1) => {
  let sum = 0;
  let galaxyPositions: Position[] = [];

  const { emptyColumns, emptyRows } = getEmptyRowsAndColumns(input);

  const expandPosition = ([rowIndex, columnIndex]: Position): Position => [
    expandGalaxyPosition(emptyRows, rowIndex, expansion),
    expandGalaxyPosition(emptyColumns, columnIndex, expansion),
  ];

  input.forEach((row, rowIndex) => {
    row.split('').forEach((column, columnIndex) => {
      if (column === '#') {
        galaxyPositions.push(expandPosition([rowIndex, columnIndex]));
      }
    });
  });

  for (let i = 0; i < galaxyPositions.length - 1; i++) {
    const position1 = galaxyPositions[i];

    for (let j = i + 1; j < galaxyPositions.length; j++) {
      const position2 = galaxyPositions[j];

      sum += calculateDistance(position1, position2);
    }
  }

  return sum;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return calculateGalaxyDistances(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return calculateGalaxyDistances(input, Math.pow(10, 6) - 1);
};

const testInput = `
  ...#......
  .......#..
  #.........
  ..........
  ......#...
  .#........
  .........#
  ..........
  .......#..
  #...#.....
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: testInput,
      //   expected: 1030,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
