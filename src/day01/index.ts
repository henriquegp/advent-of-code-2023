import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .replace(/[^\d\n]/g, "")
    .split("\n")
    .map((numbers) => {
      const firstNumber = numbers[0];
      const lastNumber = numbers[numbers.length - 1];

      return Number(`${firstNumber}${lastNumber}`);
    })
    .reduce((total, value) => total + value, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const numbersData = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  const numberRegex = numbersData.join("|");

  const convertStringToNumber = (value = "") => {
    const numberValue = Number(value);

    if (!isNaN(numberValue)) {
      return numberValue;
    }

    const index = numbersData.indexOf(value);

    return index >= 0 ? index : 0;
  };

  return input
    .split("\n")
    .map((line) => {
      const regex = `(\\d|${numberRegex})`;

      const [firstOccurrence] = line.match(new RegExp(regex, "g")) || [];

      const [lastOccurrence] =
        line
          .match(new RegExp(`${regex}(?!ne|wo|hree|ight|ine)`, "g"))
          ?.reverse() || [];

      const firstNumber = convertStringToNumber(firstOccurrence);
      const lastNumber = convertStringToNumber(lastOccurrence);

      return Number(`${firstNumber}${lastNumber}`);
    })
    .reduce((total, value) => total + value, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
          1abc2
          pqr3stu8vwx
          a1b2c3d4e5f
          treb7uchet
        `,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          two1nine
          eightwothree
          abcone2threexyz
          xtwone3four
          4nineeightseven2
          zoneight234
          7pqrstsixteen
        `,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
