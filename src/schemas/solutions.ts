interface SolutionStep {
  x: number; // index v boardu
  y: number;
  order: number;
}

interface Solution {
  id: number;
  problemId: number;
  steps: SolutionStep[];
}
