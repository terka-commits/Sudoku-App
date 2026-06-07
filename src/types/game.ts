import type { Difficulty, DifficultyTimes } from './sudoku';

export type GameProgress = {
  hasSeenIntro: boolean;
  gameMode: 'user' | 'dev';
  currentChapterId: string;
  completedChapterIds: string[];
  unlockedChapterIds: string[];
  collectedRewardIds: string[];
  chapterTimes: Record<string, number>;
  usedHints: Record<string, number>;
  roomResults: Record<string, RoomResult>;
};

export type RoomResult = {
  roomId: string;
  completed: boolean;
  bestTimes: DifficultyTimes;
  lastTimes: DifficultyTimes;
  bestTimeMs?: number;
  lastTimeMs?: number;
  completedAt?: string;
};

export type ActiveRoomProgress = {
  roomId: string;
  difficulty: Difficulty;
  elapsedTimeMs: number;
  lastSavedAt: string;
  isPaused: boolean;
};

export type ProgressSourceOfTruth = {
  completedRooms: string[];
  unlockedStops: string[];
  currentRoom: string;
  currentChapter: string;
  totalRooms: number;
  totalStops: number;
};
