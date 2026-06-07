import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameProgress } from '../types/game';
import type { Difficulty, SudokuGameState } from '../types/sudoku';
import { DEFAULT_DIFFICULTY, DIFFICULTIES, emptyDifficultyTimes } from '../utils/difficulty';

const PROGRESS_KEY = 'sudoku-mystery:progress';
const SUDOKU_PREFIX = 'sudoku-mystery:sudoku:';
const PERSISTED_SETTINGS_KEYS = new Set(['sudoku-mystery:language']);

export const defaultProgress: GameProgress = {
  hasSeenIntro: false,
  gameMode: 'user',
  currentChapterId: 'room-01',
  completedChapterIds: [],
  unlockedChapterIds: ['room-01'],
  collectedRewardIds: [],
  chapterTimes: {},
  usedHints: {},
  roomResults: {},
};

export async function loadProgress() {
  const raw = await AsyncStorage.getItem(PROGRESS_KEY);
  if (!raw) {
    return defaultProgress;
  }

  const parsed = { ...defaultProgress, ...JSON.parse(raw) } as GameProgress;
  const migratedRoomResults = { ...parsed.roomResults };

  parsed.completedChapterIds.forEach((roomId) => {
    const elapsedSeconds = parsed.chapterTimes[roomId];
    const existingResult = migratedRoomResults[roomId];
    const bestTimes = { ...emptyDifficultyTimes(), ...existingResult.bestTimes };
    const lastTimes = { ...emptyDifficultyTimes(), ...existingResult.lastTimes };
    const legacyBestTime = existingResult.bestTimeMs ?? (typeof elapsedSeconds === 'number' ? elapsedSeconds * 1000 : undefined);
    const legacyLastTime = existingResult.lastTimeMs ?? legacyBestTime;

    if (bestTimes.medium === null && typeof legacyBestTime === 'number') {
      bestTimes.medium = legacyBestTime;
    }
    if (lastTimes.medium === null && typeof legacyLastTime === 'number') {
      lastTimes.medium = legacyLastTime;
    }

    migratedRoomResults[roomId] = {
      ...existingResult,
      roomId,
      completed: true,
      bestTimes,
      lastTimes,
      bestTimeMs: legacyBestTime,
      lastTimeMs: legacyLastTime,
    };
  });

  return { ...parsed, roomResults: migratedRoomResults };
}

export async function saveProgress(progress: GameProgress) {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export async function resetProgress() {
  const keys = await AsyncStorage.getAllKeys();
  const appKeys = keys.filter((key) => key.startsWith('sudoku-mystery:') && !PERSISTED_SETTINGS_KEYS.has(key));
  await AsyncStorage.multiRemove(appKeys);
}

const sudokuStateKey = (chapterId: string, difficulty: Difficulty = DEFAULT_DIFFICULTY) => `${SUDOKU_PREFIX}${chapterId}:${difficulty}`;

export async function loadSudokuState(chapterId: string, difficulty: Difficulty = DEFAULT_DIFFICULTY) {
  const raw = await AsyncStorage.getItem(sudokuStateKey(chapterId, difficulty));
  return raw ? (JSON.parse(raw) as SudokuGameState) : undefined;
}

export async function saveSudokuState(state: SudokuGameState) {
  await AsyncStorage.setItem(sudokuStateKey(state.chapterId, state.difficulty), JSON.stringify(state));
}

export async function clearSudokuState(chapterId: string, difficulty: Difficulty = DEFAULT_DIFFICULTY) {
  await AsyncStorage.removeItem(sudokuStateKey(chapterId, difficulty));
}

export async function clearRoomSudokuStates(chapterId: string) {
  await AsyncStorage.multiRemove(DIFFICULTIES.map((difficulty) => sudokuStateKey(chapterId, difficulty)));
}

export async function clearAllSudokuStates() {
  const keys = await AsyncStorage.getAllKeys();
  const sudokuKeys = keys.filter((key) => key.startsWith(SUDOKU_PREFIX));
  await AsyncStorage.multiRemove(sudokuKeys);
}
