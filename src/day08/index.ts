import run from 'aocrunner';

type Network = Record<string, string[]>;

interface GetNavigationStepsProps {
  directions: string[];
  network: Network;
  start: string;
  target: string;
}

const parseInput = (rawInput: string) => rawInput.split(`\n`);

const getDirectionsAndNetwork = (input: string[]) => {
  const directions = input[0].split('');

  input.shift();
  input.shift();

  const network = input.reduce((total, row) => {
    const [position, left, right] = row.match(/\w+/g)!;

    return {
      ...total,
      [position]: [left, right],
    };
  }, {} as Network);

  return {
    directions,
    network,
  };
};

const getNavigationSteps = ({
  directions,
  network,
  start,
  target,
}: GetNavigationStepsProps) => {
  let steps = 0;
  let currentValue = start;
  let currentDirection = 0;

  const foundZ = (value: string) =>
    (target.length > 1 ? value : value[2]) === target;

  while (!foundZ(currentValue)) {
    steps++;

    const nextDirection = Number(directions[currentDirection] !== 'L');
    currentValue = network[currentValue][nextDirection];

    currentDirection =
      currentDirection < directions.length - 1 ? currentDirection + 1 : 0;
  }

  return steps;
};

const gcd = (a: number, b: number): number => {
  let rem = a % b;

  a = b;
  b = rem;

  return rem === 0 ? a : gcd(a, b);
};

const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const { directions, network } = getDirectionsAndNetwork(input);

  return getNavigationSteps({
    directions,
    network,
    start: 'AAA',
    target: 'ZZZ',
  });
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const { directions, network } = getDirectionsAndNetwork(input);

  const startValues = Object.keys(network)
    .filter((key) => key[2] === 'A')
    .map((start) =>
      getNavigationSteps({
        directions,
        network,
        start,
        target: 'Z',
      }),
    );

  const firstValue = startValues.shift()!;

  return startValues.reduce(lcm, firstValue);
};

run({
  part1: {
    tests: [
      {
        input: `
          LLR

          AAA = (BBB, BBB)
          BBB = (AAA, ZZZ)
          ZZZ = (ZZZ, ZZZ)
        `,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          LR

          11A = (11B, XXX)
          11B = (XXX, 11Z)
          11Z = (11B, XXX)
          22A = (22B, XXX)
          22B = (22C, 22C)
          22C = (22Z, 22Z)
          22Z = (22B, 22B)
          XXX = (XXX, XXX)
        `,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
