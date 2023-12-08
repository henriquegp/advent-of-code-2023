import run from 'aocrunner';

type Network = Record<string, string[]>;

interface GetNavigationStepsProps {
  directions: string[];
  endsInZ?: boolean;
  network: Network;
  start: string;
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
  endsInZ = false,
  network,
  start,
}: GetNavigationStepsProps) => {
  let count = 0;
  let currentValue = start;
  let currentDirection = 0;

  const foundZ = (value: string) =>
    endsInZ ? value[2] === 'Z' : value === 'ZZZ';

  while (!foundZ(currentValue)) {
    count++;

    const nextDirection = directions[currentDirection] === 'L' ? 0 : 1;
    currentValue = network[currentValue][nextDirection];

    if (currentDirection >= directions.length - 1) {
      currentDirection = 0;
    } else {
      currentDirection++;
    }
  }

  return count;
};

const gcd = (max: number, min: number): number => {
  let rem = max % min;

  max = min;
  min = rem;

  return rem === 0 ? max : gcd(max, min);
};

const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const { directions, network } = getDirectionsAndNetwork(input);

  return getNavigationSteps({ directions, network, start: 'AAA' });
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const { directions, network } = getDirectionsAndNetwork(input);

  const startValues = Object.keys(network)
    .filter((key) => key[2] === 'A')
    .map((start) =>
      getNavigationSteps({
        directions,
        endsInZ: true,
        network,
        start,
      }),
    );

  const [firstValue] = startValues.splice(0, 1);

  return startValues.reduce((total, item) => lcm(total, item), firstValue);
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
