export type SolutionStep = {
  x: number;
  y: number;
};

export type Solution = {
  id: number;
  problemId: number;
  steps: SolutionStep[];
};
