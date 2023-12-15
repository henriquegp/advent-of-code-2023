import run from 'aocrunner';

interface BoxSlot {
  label: string;
  focalLength: number;
}

const parseInput = (rawInput: string) => rawInput.split(',');

const cypher = (data: string) =>
  data
    .split('')
    .reduce((total, char) => ((total + char.charCodeAt(0)) * 17) % 256, 0);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((total, item) => total + cypher(item), 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const boxes: BoxSlot[][] = [];

  input.forEach((item) => {
    if (item.includes('=')) {
      const [label, focalLength] = item.split('=');

      const slot = {
        label,
        focalLength: Number(focalLength),
      };

      const hash = cypher(label);
      const foundSlotIndex = boxes[hash]?.findIndex(
        (slot) => slot.label === label,
      );

      if (foundSlotIndex > -1) {
        boxes[hash][foundSlotIndex] = slot;
      } else {
        boxes[hash] = [...(boxes[hash] || []), slot];
      }
    } else {
      const [label] = item.split('-');
      const hash = cypher(label);

      boxes[hash] = boxes[hash]?.filter((slot) => slot.label !== label);
    }
  });

  return boxes.reduce((total, box, boxIndex) => {
    const boxTotal = box?.reduce((total, slot, slotIndex) => {
      const focusingPower = (boxIndex + 1) * (slotIndex + 1) * slot.focalLength;

      return total + focusingPower;
    }, 0);

    return total + (boxTotal || 0);
  }, 0);
};

const testInput = 'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7';

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
