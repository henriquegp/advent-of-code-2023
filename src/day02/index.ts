import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput;

const limits = {
  red: 12,
  green: 13,
  blue: 14,
};

type CubeName = keyof typeof limits;

const cubeNames = Object.keys(limits) as CubeName[];

const getMaxCubeValue = (game: string, cubeName: CubeName, initial = 0) => {
  const values =
    game
      .match(new RegExp(`[0-9]+(?= ${cubeName})`, 'g'))
      ?.map((value) => Number(value)) || [];

  return Math.max(...values, initial);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.split('\n').reduce((total, game) => {
    const isImpossible = cubeNames.some(
      (cube) => getMaxCubeValue(game, cube) > limits[cube],
    );

    if (isImpossible) {
      return total;
    }

    const [gameId] = game.match(/\d+(?=:)/) || [];

    return total + Number(gameId);
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.split('\n').reduce((total, game) => {
    const calc = cubeNames.reduce(
      (total, cube) => total * getMaxCubeValue(game, cube, 1),
      1,
    );

    return total + calc;
  }, 0);
};

const testInput = `
  Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
  Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
  Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
  Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
