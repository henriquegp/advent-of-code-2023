import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split('\n');

  const seeds = input.shift()?.match(/\d+/g);

  let position = -1;
  const maps = [
    'soil',
    'fertilizer',
    'water',
    'light',
    'temperature',
    'humidity',
    'location',
  ];

  const mappedMaps = input.reduce((total, row) => {
    if (!row.trim()) {
      return total;
    }

    if (row.includes('map:')) {
      position += 1;
      return total;
    }

    const key = maps[position];
    const [destinationStart, sourceStart, length] = row.match(/\d+/g) || [];

    if (!destinationStart || !sourceStart || !length) {
      return total;
    }

    return {
      ...total,
      [key]: [
        ...(total[key] || []),
        [Number(destinationStart), Number(sourceStart), Number(length)],
      ],
    };
  }, {} as Record<string, number[][]>);

  const getMapPosition = (map: string, lastPosition: number) =>
    mappedMaps[map].reduce((total, [destination, source, length]) => {
      if (lastPosition >= source && lastPosition <= source + length - 1) {
        return destination + (lastPosition - source);
      }
      return total;
    }, lastPosition);

  const seedLocations = seeds?.map((seed) => {
    let lastPosition = Number(seed);

    maps.forEach((map) => {
      lastPosition = getMapPosition(map, lastPosition);
    });

    return lastPosition;
  });

  return Math.min(...(seedLocations || []));
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split('\n');

  let position = -1;
  const maps = [
    'soil',
    'fertilizer',
    'water',
    'light',
    'temperature',
    'humidity',
    'location',
  ];

  const mappedMaps = input.reduce((total, row) => {
    if (!row.trim()) {
      return total;
    }

    if (row.includes('map:')) {
      position += 1;
      return total;
    }

    const key = maps[position];
    const [destinationStart, sourceStart, length] = row.match(/\d+/g) || [];

    if (!destinationStart || !sourceStart || !length) {
      return total;
    }

    return {
      ...total,
      [key]: [
        ...(total[key] || []),
        [Number(destinationStart), Number(sourceStart), Number(length)],
      ],
    };
  }, {} as Record<string, number[][]>);

  const getMapPosition = (map: string, lastPosition: number) =>
    mappedMaps[map].reduce((total, [destination, source, length]) => {
      if (lastPosition >= source && lastPosition <= source + length - 1) {
        return destination + (lastPosition - source);
      }
      return total;
    }, lastPosition);

  let minValue = 99999999999999;

  const entries = input.shift()?.match(/(\d+ \d+)+/g);

  entries?.map((seedRange, index) => {
    const [seedStart, length] = seedRange.split(' ');
    const start = Number(seedStart);

    for (let seed = start; seed < start + Number(length); seed++) {
      let lastPosition = Number(seed);

      maps.forEach((map) => {
        lastPosition = getMapPosition(map, lastPosition);
      });

      if (lastPosition < minValue) {
        minValue = lastPosition;
      }
    }
  });

  return minValue;
};

const testInput = `
  seeds: 79 14 55 13

  seed-to-soil map:
  50 98 2
  52 50 48

  soil-to-fertilizer map:
  0 15 37
  37 52 2
  39 0 15

  fertilizer-to-water map:
  49 53 8
  0 11 42
  42 0 7
  57 7 4

  water-to-light map:
  88 18 7
  18 25 70

  light-to-temperature map:
  45 77 23
  81 45 19
  68 64 13

  temperature-to-humidity map:
  0 69 1
  1 0 69

  humidity-to-location map:
  60 56 37
  56 93 4        
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
