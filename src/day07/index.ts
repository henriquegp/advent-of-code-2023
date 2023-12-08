import run from 'aocrunner';

enum HandType {
  FIVE_OF_A_KIND = 7,
  FOUR_OF_A_KIND = 6,
  FULL_HOUSE = 5,
  THREE_OF_A_KIND = 4,
  TWO_PAIR = 3,
  ONE_PAIR = 2,
  HIGH_CARD = 1,
}

const parseInput = (rawInput: string) => rawInput.split('\n');

const getHandType = (highestCount: number, secondHighestCount: number) => {
  switch (highestCount) {
    case 5:
      return HandType.FIVE_OF_A_KIND;
    case 4:
      return HandType.FOUR_OF_A_KIND;
    case 3:
      return secondHighestCount === 2
        ? HandType.FULL_HOUSE
        : HandType.THREE_OF_A_KIND;
    case 2:
      return secondHighestCount === 2 ? HandType.TWO_PAIR : HandType.ONE_PAIR;
    case 1:
      return HandType.HIGH_CARD;
  }
};

const prefixZero = (value: number) => `0${value}`.slice(-2);

const calculateCamelCards = (
  hands: string[],
  cards: string[],
  hasJokerCard = false,
) => {
  return hands
    .map((row) => {
      const [hand, bid] = row.split(' ');

      const cardsCount: Record<string, number> = {};

      const handValue = hand
        .split('')
        .map((card) => {
          cardsCount[card] = (cardsCount[card] || 0) + 1;

          return prefixZero(cards.indexOf(card));
        })
        .join('');

      let jokerCards = 0;

      if (hasJokerCard && cardsCount.J) {
        jokerCards = cardsCount.J;
        delete cardsCount.J;
      }

      const [highestCount, secondHighestCount] = Object.values(cardsCount).sort(
        (a, b) => (a > b ? -1 : 1),
      );

      const handType = getHandType(
        (highestCount || 0) + jokerCards,
        secondHighestCount || 0,
      );

      return {
        hand: `${handType}${handValue}`,
        bid: Number(bid),
      };
    })
    .sort((a, b) => {
      if (a.hand < b.hand) return -1;
      if (a.hand > b.hand) return 1;
      return 0;
    })
    .map((item, index) => item.bid * (index + 1))
    .reduce((total, value) => total + value, 0);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const cards = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'T',
    'J',
    'Q',
    'K',
    'A',
  ];

  return calculateCamelCards(input, cards);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const cards = [
    'J',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'T',
    'Q',
    'K',
    'A',
  ];

  return calculateCamelCards(input, cards, true);
};

const testInput = `
  32T3K 765
  T55J5 684
  KK677 28
  KTJJT 220
  QQQJA 483
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
