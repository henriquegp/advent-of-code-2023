import run from 'aocrunner';

type Vertice = [number, number];
type Input = [string, string | number];

enum Direction {
  UP = 'U',
  DOWN = 'D',
  LEFT = 'L',
  RIGHT = 'R',
}

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((row) => row.replace(/\(|\)/g, '').split(' '));

function calculatePolygonArea(vertices: Vertice[]) {
  if (vertices.length < 3) {
    return 0;
  }

  let area = 0;

  for (let i = 0; i < vertices.length - 1; i++) {
    area +=
      vertices[i][0] * vertices[i + 1][1] - vertices[i + 1][0] * vertices[i][1];
  }
  area +=
    vertices[vertices.length - 1][0] * vertices[0][1] -
    vertices[0][0] * vertices[vertices.length - 1][1];

  area = Math.abs(area) / 2;

  return area;
}

const mountVertices = (input: Input[]) => {
  let rowIndex = 0;
  let columnIndex = 0;
  let total = 0;

  const vertices: Vertice[] = input.map((row) => {
    const [direction, steps] = row;

    total += Number(steps);

    switch (direction) {
      case Direction.UP:
        rowIndex -= Number(steps);
        break;
      case Direction.DOWN:
        rowIndex += Number(steps);
        break;
      case Direction.LEFT:
        columnIndex -= Number(steps);
        break;
      case Direction.RIGHT:
        columnIndex += Number(steps);
        break;
    }

    return [rowIndex, columnIndex];
  });

  return { vertices, total };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const { vertices, total } = mountVertices(input as Input[]);

  return calculatePolygonArea(vertices) + Math.round(total / 2) + 1;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const mappedInput: Input[] = input.map((row) => {
    const hexcode = row[2];

    const steps = parseInt(hexcode.substring(1, 6), 16);
    const direction = hexcode.substring(hexcode.length - 1);

    const directions: Record<string, Direction> = {
      '0': Direction.RIGHT,
      '1': Direction.DOWN,
      '2': Direction.LEFT,
      '3': Direction.UP,
    };

    return [directions[direction], steps];
  });

  const { vertices, total } = mountVertices(mappedInput);

  return calculatePolygonArea(vertices) + Math.round(total / 2) + 1;
};

const testInput = `
  R 6 (#70c710)
  D 5 (#0dc571)
  L 2 (#5713f0)
  D 2 (#d2c081)
  R 2 (#59c680)
  D 2 (#411b91)
  L 5 (#8ceee2)
  U 2 (#caa173)
  L 1 (#1b58a2)
  U 2 (#caa171)
  R 2 (#7807d2)
  U 3 (#a77fa3)
  L 2 (#015232)
  U 2 (#7a21e3)
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 62,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 952408144115,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
