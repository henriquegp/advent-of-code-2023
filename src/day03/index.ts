import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const rows = input.split(`\n`);

  const isSymbol = (char?: string) =>
    !!char && !char?.replace(/[^\.\d\s]/g, "");

  const hasSymbolAround = (
    rowIndex: number,
    initialIndex: number,
    length: number,
  ) => {
    const hasSymbolLeft = isSymbol(rows[rowIndex][initialIndex - 1]);
    const hasSymbolRight = isSymbol(rows[rowIndex][initialIndex + length]);

    const hasSymbolAbove = Array.from(
      { length: length + 2 },
      (_, index) => rows[rowIndex - 1]?.[initialIndex - 1 + index],
    ).some((char) => isSymbol(char));

    const hasSymbolBellow = Array.from(
      { length: length + 2 },
      (_, index) => rows[rowIndex + 1]?.[initialIndex - 1 + index],
    ).some((char) => isSymbol(char));

    return hasSymbolLeft || hasSymbolRight || hasSymbolAbove || hasSymbolBellow;
  };

  const value = rows
    .map((row, rowIndex) => {
      const numbers = row.matchAll(/\d+/g);

      const array = [...numbers]?.filter((number) => {
        if (number.index === undefined || number.index < 0) {
          return false;
        }

        return hasSymbolAround(rowIndex, number.index, number[0].length);
      });

      return array?.reduce((total, number) => total + Number(number), 0) || 0;
    })
    .reduce((total, number) => total + Number(number), 0);

  return value;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const rows = input.split(`\n`);

  const isSymbol = (char?: string) => !!char && !char?.replace(/\*/g, "");

  const getSymbolId = (x: number, y: number) =>
    isSymbol(rows[x]?.[y]) ? `${x}${y}` : null;

  const getSymbolIds = (
    rowIndex: number,
    initialIndex: number,
    length: number,
  ) => {
    const leftSymbolId = getSymbolId(rowIndex, initialIndex - 1);
    const rightSymbolId = getSymbolId(rowIndex, initialIndex + length);

    const aboveSymbolIds = Array.from({ length: length + 2 }, (_, index) =>
      getSymbolId(rowIndex - 1, initialIndex - 1 + index),
    );

    const bellowSymbolIds = Array.from({ length: length + 2 }, (_, index) =>
      getSymbolId(rowIndex + 1, initialIndex - 1 + index),
    );

    return [
      leftSymbolId,
      rightSymbolId,
      ...aboveSymbolIds,
      ...bellowSymbolIds,
    ].filter((value) => value !== null) as string[];
  };

  const formatRowValues = (rowIndex: number) => {
    const row = rows[rowIndex];
    const numbers = [...row.matchAll(/\d+/g)];

    return numbers?.map((number) => {
      if (number.index === undefined || number.index < 0) {
        return null;
      }

      return {
        value: number[0],
        symbolIds: getSymbolIds(rowIndex, number.index, number[0].length),
      };
    });
  };

  const valueAndSymbols = rows
    .map((row, rowIndex) => formatRowValues(rowIndex))
    .reduce((total, item) => [...total, ...item], [])
    .filter((value) => value?.symbolIds.length);

  const symbolIds = valueAndSymbols.reduce(
    (total, item) => [...total, ...(item?.symbolIds || [])],
    [] as string[],
  );

  return [...new Set(symbolIds)].reduce((total, symbolId) => {
    let symbolTotal = 0;
    const numbers = valueAndSymbols.filter((number) =>
      number?.symbolIds.includes(symbolId),
    );

    if (numbers.length > 1) {
      symbolTotal = numbers.reduce(
        (total, number) => total * Number(number?.value || 1),
        1,
      );
    }

    return total + symbolTotal;
  }, 0);
};

const testInput = `
  467..114..
  ...*......
  ..35..633.
  ......#...
  617*......
  .....+.58.
  ..592.....
  ......755.
  ...$.*....
  .664.598..
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
