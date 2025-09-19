interface Problem {
  id: number;
  size: number;
  difficulty: number;
  timestamp: string;
  grid: number[][];
}

type CreateProblemResultDTO = {
  success: boolean;
  moves: number;
  timeMs: number;
  solution: Solution;
}