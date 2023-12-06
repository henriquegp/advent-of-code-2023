import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const splitCard = (card: string) => {
  const [winners, numbers] = card.split(':')?.[1].split(' | ');

  return {
    winners: winners.match(/\d+/g) || ([] as string[]),
    numbers: numbers.match(/\d+/g) || ([] as string[]),
  };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .map((card) => {
      const { winners, numbers } = splitCard(card);

      return numbers.reduce((total, value) => {
        if (!winners.includes(value)) {
          return total;
        }

        return total > 0 ? total + total : 1;
      }, 0);
    })
    .reduce((total, value) => total + Number(value), 0);
};

const part2 = (rawInput: string) => {
  let instances = 0;
  const input = parseInput(rawInput);

  const cardMatches = input.reduce((total, card, cardIndex) => {
    const cardId = cardIndex + 1;
    const { winners, numbers } = splitCard(card);

    return {
      ...total,
      [cardId]: numbers
        .filter((value) => winners.includes(value))
        .map((_, index) => cardId + index + 1),
    };
  }, {} as Record<number, number[]>);

  const getCardCopies = (cardId: number) => {
    instances += 1;

    cardMatches[cardId].forEach((id) => getCardCopies(id));
  };

  Object.keys(cardMatches).forEach((cardId) => getCardCopies(+cardId));

  return instances;
};

const testInput = `
  Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
  Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
  Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
  Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
  Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
