import run from 'aocrunner';

interface Rating {
  x: number;
  m: number;
  a: number;
  s: number;
}

interface Workflow {
  conditations: {
    conditation: string;
    result: string;
  }[];
  defaultResult: string;
}

type Workflows = Record<string, Workflow>;

const parseInput = (rawInput: string) =>
  rawInput.split('\n\n') as [string, string];

const convertInput = ([workflowData, ratingData]: [string, string]) => {
  const workflows: Workflows = workflowData.split('\n').reduce((total, row) => {
    const workflowName = row.match(/\w+(?=\{)/)?.[0] || '';

    const options = row.match(/(?<=\{).+(?=\})/)?.[0].split(',') || [];

    const conditations = options
      .filter((option) => option.includes(':'))
      .map((option) => {
        const [conditation, result] = option.split(':');

        return { conditation, result };
      });

    return {
      ...total,
      [workflowName]: {
        conditations,
        defaultResult: options[options.length - 1],
      },
    };
  }, {} as Workflows);

  const ratings = ratingData.split('\n').map((row) => {
    const rating = row.replace(/\=/g, ':');

    let aux = {} as Rating;
    eval(`aux = ${rating};`);

    return aux;
  });

  return { ratings, workflows };
};

const checkWorkflow = (
  rating: Rating,
  workflows: Workflows,
  initial: string,
): boolean => {
  const { x, m, a, s } = rating;
  const workflow = workflows[initial];

  const checkCondigation = (conditation: string) => {
    switch (conditation) {
      case 'A':
        return true;
      case 'R':
        return false;
      default:
        return checkWorkflow(rating, workflows, conditation);
    }
  };

  for (const { conditation, result } of workflow.conditations) {
    if (eval(conditation)) {
      return checkCondigation(result);
    }
  }

  return checkCondigation(workflow.defaultResult);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const { ratings, workflows } = convertInput(input);

  return ratings.reduce((total, rating) => {
    let value = 0;

    const isAccepted = checkWorkflow(rating, workflows, 'in');

    if (isAccepted) {
      value = Object.values(rating).reduce((total, value) => total + value, 0);
    }

    return total + value;
  }, 0);
};

const calculatePosibilites = (
  workflows: Workflows,
  initial: string,
): number => {
  const workflow = workflows[initial];
  const rating: Record<string, number> = {
    x: 4000,
    m: 4000,
    a: 4000,
    s: 4000,
  };

  const getPosibilites = (signal: string, result: string, value: number) => {
    switch (result) {
      case 'A':
        const approved = signal === '>' ? 4000 - value : value;

        return approved;
      case 'R':
        const approved2 = signal === '>' ? value : 4000 - value;

        return approved2;
      default:
        return calculatePosibilites(workflows, result);
    }
  };

  for (const { conditation, result } of workflow.conditations) {
    const signal = conditation.match(/>|</)?.[0] as string;
    const [key, value] = conditation.split(signal);

    rating[key] = getPosibilites(signal, result, Number(value));
  }

  return Object.values(rating).reduce((total, value) => total * value, 1);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const { workflows } = convertInput(input);

  return calculatePosibilites(workflows, 'in');
};

const testInput = `
  px{a<2006:qkq,m>2090:A,rfg}
  pv{a>1716:R,A}
  lnx{m>1548:A,A}
  rfg{s<537:gd,x>2440:R,A}
  qs{s>3448:A,lnx}
  qkq{x<1416:A,crn}
  crn{x>2662:A,R}
  in{s<1351:px,qqz}
  qqz{s>2770:qs,m<1801:hdj,R}
  gd{a>3333:R,R}
  hdj{m>838:A,pv}

  {x=787,m=2655,a=1222,s=2876}
  {x=1679,m=44,a=2067,s=496}
  {x=2036,m=264,a=79,s=2244}
  {x=2461,m=1339,a=466,s=291}
  {x=2127,m=1623,a=2188,s=1013}
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 19114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 167409079868000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
