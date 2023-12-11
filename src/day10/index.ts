import run from 'aocrunner';

type Connection = 'top' | 'right' | 'bottom' | 'left';

interface Position {
  x: number;
  y: number;
}

const parseInput = (rawInput: string) => rawInput.split('\n');
/*
J L F 7

JL
7F
*/

const hasConnection = (connection: Connection, pipe = '') => {
  const connections = {
    top: ['|', 'J', 'L'],
    right: ['-', 'F', 'L'],
    bottom: ['|', '7', 'F'],
    left: ['-', '7', 'J'],
  };

  return connections[connection].includes(pipe);
};

const countTileDistance = (
  ground: string[][],
  currentPosition: Position,
  connection: Connection,
): number => {
  let pipe = ground[currentPosition.x]?.[currentPosition.y];
  let count = 1;
  let nextConnection: Connection = connection;
  let { x, y } = currentPosition;

  while (pipe !== 'S' && hasConnection(nextConnection, pipe)) {
    count++;

    switch (pipe) {
      case '|':
        if (nextConnection === 'bottom') {
          x -= 1;
          nextConnection = 'top';
        } else {
          x += 1;
          nextConnection = 'bottom';
        }
        break;
      case '-':
        if (nextConnection === 'left') {
          y += 1;
          nextConnection = 'right';
        } else {
          y -= 1;
          nextConnection = 'left';
        }
        break;
      case 'L':
        if (nextConnection === 'top') {
          y += 1;
          nextConnection = 'right';
        } else {
          x -= 1;
          nextConnection = 'top';
        }
        break;
      case 'J':
        if (nextConnection === 'top') {
          y -= 1;
          nextConnection = 'left';
        } else {
          x -= 1;
          nextConnection = 'top';
        }
        break;
      case '7':
        if (nextConnection === 'bottom') {
          y -= 1;
          nextConnection = 'left';
        } else {
          x += 1;
          nextConnection = 'bottom';
        }
        break;
      case 'F':
        if (nextConnection === 'bottom') {
          y += 1;
          nextConnection = 'right';
        } else {
          x += 1;
          nextConnection = 'bottom';
        }
        break;
    }

    const list: Record<Connection, Connection> = {
      top: 'bottom',
      left: 'right',
      right: 'left',
      bottom: 'top',
    };

    pipe = ground[x]?.[y];
    nextConnection = list[nextConnection];
  }

  return count;
};

const getMappedGroundAndStartingPosition = (rows: string[]) => {
  let startingPosition = {
    x: 0,
    y: 0,
  };

  const ground = rows.map((row, index) => {
    const startIndex = row.indexOf('S');

    if (startIndex >= 0) {
      startingPosition = {
        x: index,
        y: startIndex,
      };
    }

    return row.split('');
  });

  return { ground, startingPosition };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const {
    ground,
    startingPosition: { x, y },
  } = getMappedGroundAndStartingPosition(input);

  const directionValues = [
    { x: x - 1, y, connection: 'bottom' },
    { x, y: y + 1, connection: 'left' },
  ].map(({ x, y, connection }) =>
    countTileDistance(ground, { x, y }, connection as Connection),
  );
  return Math.max(...directionValues) / 2;
};

const convertGroundToString = (ground: string[][]) =>
  ground.map((row) => row.join('')).join('\n');

const mapFlow = (
  ground: string[][],
  currentPosition: Position,
  connection: Connection,
) => {
  const newGround: string[][] = JSON.parse(JSON.stringify(ground));
  let positionIds = [];
  let steps = [];

  let pipe = ground[currentPosition.x]?.[currentPosition.y];
  let count = 1;
  let nextConnection: Connection = connection;
  let { x, y } = currentPosition;

  while (pipe !== 'S' && hasConnection(nextConnection, pipe)) {
    count++;
    // newGround[x][y] = 'X';
    positionIds.push(`${x}${y}`);
    steps.push({ x, y });

    switch (pipe) {
      case '|':
        if (nextConnection === 'bottom') {
          x -= 1;
          nextConnection = 'top';
        } else {
          x += 1;
          nextConnection = 'bottom';
        }
        break;
      case '-':
        if (nextConnection === 'left') {
          y += 1;
          nextConnection = 'right';
        } else {
          y -= 1;
          nextConnection = 'left';
        }
        break;
      case 'L':
        if (nextConnection === 'top') {
          y += 1;
          nextConnection = 'right';
        } else {
          x -= 1;
          nextConnection = 'top';
        }
        break;
      case 'J':
        if (nextConnection === 'top') {
          y -= 1;
          nextConnection = 'left';
        } else {
          x -= 1;
          nextConnection = 'top';
        }
        break;
      case '7':
        if (nextConnection === 'bottom') {
          y -= 1;
          nextConnection = 'left';
        } else {
          x += 1;
          nextConnection = 'bottom';
        }
        break;
      case 'F':
        if (nextConnection === 'bottom') {
          y += 1;
          nextConnection = 'right';
        } else {
          x += 1;
          nextConnection = 'bottom';
        }
        break;
    }

    const list: Record<Connection, Connection> = {
      top: 'bottom',
      left: 'right',
      right: 'left',
      bottom: 'top',
    };

    pipe = ground[x]?.[y];
    nextConnection = list[nextConnection];
  }

  return { newGround, positionIds, steps };
};

function isPositionInside(position: Position, polygon: Position[]) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x,
      yi = polygon[i].y;
    const xj = polygon[j].x,
      yj = polygon[j].y;

    const intersect =
      yi > position.y !== yj > position.y &&
      position.x < ((xj - xi) * (position.y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const {
    ground,
    startingPosition: { x, y },
  } = getMappedGroundAndStartingPosition(input);

  const trueGround = [
    { x: x - 1, y, connection: 'bottom' },
    { x, y: y + 1, connection: 'left' },
    { x, y: y - 1, connection: 'right' },
    { x: x + 1, y, connection: 'top' },
  ]
    .map(({ x, y, connection }) =>
      mapFlow(ground, { x, y }, connection as Connection),
    )
    .sort((a, b) => a.positionIds.length - b.positionIds.length);

  const { newGround, positionIds, steps } = trueGround[trueGround.length - 1];
  positionIds.push(`${x}${y}`);
  steps.push({ x, y });
  let count = 0;

  newGround.forEach((row, xIndex) => {
    row.forEach((column, yIndex) => {
      const id = `${xIndex}${yIndex}`;

      if (
        isPositionInside({ x: xIndex, y: yIndex }, steps) &&
        !positionIds.includes(id)
      ) {
        count++;
        newGround[xIndex][yIndex] = '\x1b[43m' + column + '\x1b[0m';
      }
    });
  });

  return count;
};

run({
  part1: {
    tests: [
      {
        input: `
          .....
          .S-7.
          .|.|.
          .L-J.
          .....
        `,
        expected: 4,
      },
      {
        input: `
          ..F7.
          .FJ|.
          SJ.L7
          |F--J
          LJ...
        `,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          ...........
          .S-------7.
          .|F-----7|.
          .||.....||.
          .||.....||.
          .|L-7.F-J|.
          .|..|.|..|.
          .L--J.L--J.
          ...........
        `,
        expected: 4,
      },
      {
        input: `
          .F----7F7F7F7F-7....
          .|F--7||||||||FJ....
          .||.FJ||||||||L7....
          FJL7L7LJLJ||LJ.L-7..
          L--J.L7...LJS7F-7L7.
          ....F-J..F7FJ|L7L7L7
          ....L7.F7||L7|.L7L7|
          .....|FJLJ|FJ|F7|.LJ
          ....FJL-7.||.||||...
          ....L---J.LJ.LJLJ...
        `,
        expected: 8,
      },
      {
        input: `
          FF7FSF7F7F7F7F7F---7
          L|LJ||||||||||||F--J
          FL-7LJLJ||||||LJL-77
          F--JF--7||LJLJ7F7FJ-
          L---JF-JLJ.||-FJLJJ7
          |F|F-JF---7F7-L7L|7|
          |FFJF7L7F-JF7|JL---7
          7-L-JL7||F7|L7F-7F7|
          L.L7LFJ|||||FJL7||LJ
          L7JLJL-JLJLJL--JLJ.L
        `,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
