import { Difficulty, DifficultyTimes } from '../types/sudoku';

export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export const DEFAULT_DIFFICULTY: Difficulty = 'medium';

export const emptyDifficultyTimes = (): DifficultyTimes => ({
  easy: null,
  medium: null,
  hard: null,
});
