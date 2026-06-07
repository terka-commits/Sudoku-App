export type SudokuCellNotes = number[];

export type Difficulty = 'easy' | 'medium' | 'hard';

export type DifficultyTimes = Record<Difficulty, number | null>;

export type SudokuPuzzleDefinition = {
  id: string;
  puzzle: number[][];
  solution: number[][];
};

export type SudokuGameState = {
  chapterId: string;
  difficulty: Difficulty;
  values: number[][];
  notes: SudokuCellNotes[][];
  selectedCell?: {
    row: number;
    col: number;
  };
  elapsedSeconds: number;
  activeProgress: {
    roomId: string;
    difficulty: Difficulty;
    elapsedTimeMs: number;
    lastSavedAt: string;
    isPaused: boolean;
  };
  isNoteMode: boolean;
  history: number[][][];
};
