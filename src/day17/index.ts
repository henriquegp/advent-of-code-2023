import run from 'aocrunner';

enum Direction {
  UP = 'U',
  DOWN = 'D',
  LEFT = 'L',
  RIGHT = 'R',
}

type Position = [number, number];

interface QueueNode {
  direction: Direction;
  heat: number;
  position: Position;
  steps: number;
}

class PriorityQueue {
  elements: { item: QueueNode; priority: number }[];

  constructor() {
    this.elements = [];
  }

  put(item: QueueNode, priority: number) {
    this.elements.push({ item, priority });
    this.elements = this.elements.sort((a, b) => a.priority - b.priority);
  }

  get() {
    return this.elements.shift()?.item;
  }

  empty() {
    return !this.elements.length;
  }
}

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((row) => row.split('').map(Number));

const formatKey = ({ direction, steps, position }: QueueNode) =>
  [...position, direction, steps].join(',');

const getNeighbors = (grid: number[][], node: QueueNode, isUltra = false) => {
  const neighbors: QueueNode[] = [];
  const {
    position: [x, y],
    direction,
    steps,
    heat,
  } = node;

  if (x === 0 && y === 0) {
    const rightNode: QueueNode = {
      direction: Direction.RIGHT,
      heat: grid[x][y + 1],
      position: [x, y + 1],
      steps: 1,
    };

    const downNode: QueueNode = {
      direction: Direction.DOWN,
      heat: grid[x + 1][y],
      position: [x + 1, y],
      steps: 1,
    };

    neighbors.push(rightNode);
    neighbors.push(downNode);

    return neighbors;
  }

  const addNeighbor = (x: number, y: number, newDirection: Direction) => {
    const value = grid[x]?.[y] || null;

    if (value === null) {
      return;
    }

    neighbors.push({
      direction: newDirection,
      heat: value + heat,
      position: [x, y],
      steps: newDirection === direction ? steps + 1 : 1,
    } as QueueNode);
  };

  if (direction !== Direction.RIGHT) {
    addNeighbor(x, y - 1, Direction.LEFT);
  }
  if (direction !== Direction.LEFT) {
    addNeighbor(x, y + 1, Direction.RIGHT);
  }
  if (direction !== Direction.DOWN) {
    addNeighbor(x - 1, y, Direction.UP);
  }
  if (direction !== Direction.UP) {
    addNeighbor(x + 1, y, Direction.DOWN);
  }

  return neighbors.filter(({ direction: newDirection }) => {
    if (isUltra) {
      if (steps < 4) {
        return newDirection === direction;
      }
      if (steps > 9) {
        return newDirection !== direction;
      }
      return true;
    }
    return !(steps > 2 && newDirection === direction);
  });
};

const getHeatLostAmount = (grid: number[][], isUltra = false) => {
  const queue = new PriorityQueue();
  const costSoFar: Record<string, number> = {};

  const endX = grid.length - 1;
  const endY = grid[0].length - 1;

  const startNode: QueueNode = {
    direction: Direction.RIGHT,
    heat: 0,
    position: [0, 0],
    steps: 1,
  };
  queue.put(startNode, 0);

  const startKey = formatKey(startNode);
  costSoFar[startKey] = 0;

  let amount = 0;

  while (!queue.empty()) {
    const current = queue.get()!;
    const { position } = current;

    if (position[0] === endX && position[1] === endY) {
      if (isUltra && current.steps < 4) {
        continue;
      }

      amount = current.heat;
      break;
    }

    for (const next of getNeighbors(grid, current, isUltra)) {
      const newCost = next.heat;
      const nextKey = formatKey(next);

      if (!costSoFar[nextKey] || newCost < costSoFar[nextKey]) {
        costSoFar[nextKey] = newCost;

        const priority = newCost;
        queue.put(next, priority);
      }
    }
  }

  return amount;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return getHeatLostAmount(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return getHeatLostAmount(input, true);
};

const testInput = `
  2413432311323
  3215453535623
  3255245654254
  3446585845452
  4546657867536
  1438598798454
  4457876987766
  3637877979653
  4654967986887
  4564679986453
  1224686865563
  2546548887735
  4322674655533
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 102,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 94,
      },
      {
        input: `
          111111111111
          999999999991
          999999999991
          999999999991
          999999999991
        `,
        expected: 71,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
