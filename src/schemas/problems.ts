export type Problem = {
  id: number;
  size: number;
  difficulty: number;
  timestamp: string;
  moves: number;
  grid: Array<number>;
};

export type CreateProblemResultDTO = {
  success: boolean;
  moves: number;
  timeMs: number;
};
