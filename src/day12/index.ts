import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const increaseSize = (input: string, size: number) =>
  Array.from({ length: size - 1 }).reduce(
    (total: string) => total + total,
    input,
  );

const createRegex = (count: string[]) => {
  const regex = count.reduce((total, value, index) => {
    const end = index === count.length - 1 ? '*' : '+';

    return `${total}#{${value}}\\.${end}`;
  }, '');

  return new RegExp(`^\\.*${regex}$`, 'm');
};

const getPossibleArrangements = (input: string, regex: RegExp, initial = 0) => {
  if (input.match(regex)?.length) {
    return 1;
  }

  let sum = 0;

  for (let i = initial; i < input.length; i++) {
    if (input[i] === '#' || input[i] === '.') {
      continue;
    }

    const dashInput = input.substring(0, i) + '#' + input.substring(i + 1);
    const dotInput = input.substring(0, i) + '.' + input.substring(i + 1);

    sum += getPossibleArrangements(dashInput, regex, i + 1);
    sum += getPossibleArrangements(dotInput, regex, i + 1);
  }

  return sum;
};

const calculateArrangements = (input: string[], size = 1) => {
  return input.reduce((total, row) => {
    const [springs, groups] = row.split(' ');

    const increasedSprings = increaseSize(springs, size);
    const increasedGroups = increaseSize(groups, size).split(',');

    const regex = createRegex(increasedGroups);
    const value = getPossibleArrangements(increasedSprings, regex);

    return total + value;
  }, 0);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // return calculateArrangements(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return calculateArrangements(input, 5);
};

const testInput = `
  ???.### 1,1,3
  .??..??...?##. 1,1,3
  ?#?#?#?#?#?#?#? 1,3,1,6
  ????.#...#... 4,1,1
  ????.######..#####. 1,6,5
  ?###???????? 3,2,1
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
