import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { canUseDevTools } from '../config/build';
import { chapters } from '../data/chapters';
import { clearRoomSudokuStates, clearSudokuState, defaultProgress, loadProgress, resetProgress, saveProgress } from '../storage/gameStorage';
import { GameProgress } from '../types/game';
import { Difficulty } from '../types/sudoku';
import { DEFAULT_DIFFICULTY, DIFFICULTIES, emptyDifficultyTimes } from '../utils/difficulty';
import { buildProgressForCompletedRooms } from '../utils/progressSelectors';

type GameProgressContextValue = {
  progress: GameProgress;
  isHydrated: boolean;
  hasSavedProgress: boolean;
  setGameMode: (mode: GameProgress['gameMode']) => Promise<void>;
  toggleGameMode: () => Promise<void>;
  markIntroSeen: () => Promise<void>;
  completeChapter: (chapterId: string, elapsedTimeMs: number, hintCount: number, difficulty: Difficulty) => Promise<void>;
  collectReward: (rewardId: string) => Promise<void>;
  removeReward: (rewardId: string) => Promise<void>;
  collectAllRewards: () => Promise<void>;
  unlockAllChapters: () => Promise<void>;
  completeAllChapters: () => Promise<void>;
  setProgressPreset: (completedCount: number) => Promise<void>;
  generateTestTimes: () => Promise<void>;
  resetAllRoomTimes: () => Promise<void>;
  resetChapter: (chapterId: string) => Promise<void>;
  resetGame: () => Promise<void>;
  clearLocalStorage: () => Promise<void>;
};

const GameProgressContext = createContext<GameProgressContextValue | undefined>(undefined);

const getRoomResultWithDifficultyTimes = (roomId: string, result: GameProgress['roomResults'][string] | undefined) => ({
  roomId,
  completed: result?.completed ?? false,
  bestTimes: { ...emptyDifficultyTimes(), ...result?.bestTimes },
  lastTimes: { ...emptyDifficultyTimes(), ...result?.lastTimes },
  bestTimeMs: result?.bestTimeMs,
  lastTimeMs: result?.lastTimeMs,
  completedAt: result?.completedAt,
});

const getFastestBestTime = (bestTimes: ReturnType<typeof emptyDifficultyTimes>) => {
  const times = DIFFICULTIES.map((difficulty) => bestTimes[difficulty]).filter((time): time is number => typeof time === 'number');
  return times.length > 0 ? Math.min(...times) : undefined;
};

const getSequentialUserProgress = (progress: GameProgress): GameProgress => {
  const safeProgress = canUseDevTools ? progress : { ...progress, gameMode: 'user' as const };

  if (canUseDevTools && safeProgress.gameMode === 'dev') {
    return safeProgress;
  }

  if (safeProgress.completedChapterIds.length >= chapters.length) {
    return {
      ...safeProgress,
      hasSeenIntro: true,
      currentChapterId: chapters[chapters.length - 1].id ?? safeProgress.currentChapterId,
      completedChapterIds: chapters.map((chapter) => chapter.id),
      unlockedChapterIds: chapters.map((chapter) => chapter.id),
      collectedRewardIds: chapters.map((chapter) => chapter.reward.id),
    };
  }

  const completedChapterIds: string[] = [];
  const unlockedChapterIds = new Set<string>([chapters[0].id ?? 'room-01']);

  for (const chapter of chapters) {
    if (!safeProgress.completedChapterIds.includes(chapter.id)) {
      break;
    }

    completedChapterIds.push(chapter.id);

    if (chapter.unlocksChapterId) {
      unlockedChapterIds.add(chapter.unlocksChapterId);
    }
  }

  const currentChapter =
    chapters.find((chapter) => !completedChapterIds.includes(chapter.id) && unlockedChapterIds.has(chapter.id)) ??
    chapters[chapters.length - 1];
  const completedRewardIds = new Set(
    chapters.filter((chapter) => completedChapterIds.includes(chapter.id)).map((chapter) => chapter.reward.id),
  );

  return {
    ...safeProgress,
    currentChapterId: currentChapter.id,
    completedChapterIds,
    unlockedChapterIds: Array.from(unlockedChapterIds),
    collectedRewardIds: Array.from(completedRewardIds),
  };
};

export function GameProgressProvider({ children }: PropsWithChildren) {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);
  const [isHydrated, setHydrated] = useState(false);
  const progressRef = useRef<GameProgress>(defaultProgress);

  useEffect(() => {
    loadProgress()
      .then((loadedProgress) => {
        const normalized = getSequentialUserProgress(loadedProgress);
        progressRef.current = normalized;
        setProgress(normalized);
        if (JSON.stringify(normalized) !== JSON.stringify(loadedProgress)) {
          saveProgress(normalized);
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  const persist = async (next: GameProgress) => {
    const normalized = getSequentialUserProgress(next);
    progressRef.current = normalized;
    setProgress(normalized);
    await saveProgress(normalized);
  };

  const resetToUserStart = async () => {
    await resetProgress();
    progressRef.current = defaultProgress;
    setProgress(defaultProgress);
  };

  const value = useMemo<GameProgressContextValue>(
    () => ({
      progress,
      isHydrated,
      hasSavedProgress:
        progress.hasSeenIntro ||
        progress.completedChapterIds.length > 0 ||
        progress.collectedRewardIds.length > 0,
      setGameMode: async (mode) => {
        if (!canUseDevTools) {
          await persist({ ...progress, gameMode: 'user' });
          return;
        }
        if (progress.gameMode === 'dev' && mode === 'user') {
          await resetToUserStart();
          return;
        }
        await persist({ ...progress, gameMode: mode });
      },
      toggleGameMode: async () => {
        if (!canUseDevTools) {
          await persist({ ...progress, gameMode: 'user' });
          return;
        }
        const nextMode = progress.gameMode === 'dev' ? 'user' : 'dev';
        if (progress.gameMode === 'dev' && nextMode === 'user') {
          await resetToUserStart();
          return;
        }
        await persist({ ...progress, gameMode: nextMode });
      },
      markIntroSeen: async () => {
        await persist({ ...progressRef.current, hasSeenIntro: true });
      },
      collectReward: async (rewardId: string) => {
        const currentProgress = progressRef.current;
        if (currentProgress.collectedRewardIds.includes(rewardId)) {
          return;
        }
        await persist({
          ...currentProgress,
          collectedRewardIds: [...currentProgress.collectedRewardIds, rewardId],
        });
      },
      removeReward: async (rewardId: string) => {
        const currentProgress = progressRef.current;
        await persist({
          ...currentProgress,
          collectedRewardIds: currentProgress.collectedRewardIds.filter((item) => item !== rewardId),
        });
      },
      collectAllRewards: async () => {
        await persist({
          ...progress,
          collectedRewardIds: chapters.map((chapter) => chapter.reward.id),
        });
      },
      unlockAllChapters: async () => {
        await persist({
          ...progress,
          hasSeenIntro: true,
          unlockedChapterIds: chapters.map((chapter) => chapter.id),
        });
      },
      completeAllChapters: async () => {
        await persist({
          ...progress,
          hasSeenIntro: true,
          currentChapterId: chapters[chapters.length - 1].id,
          unlockedChapterIds: chapters.map((chapter) => chapter.id),
          completedChapterIds: chapters.map((chapter) => chapter.id),
          collectedRewardIds: chapters.map((chapter) => chapter.reward.id),
          chapterTimes: chapters.reduce<Record<string, number>>(
            (times, chapter) => ({ ...times, [chapter.id]: progress.chapterTimes[chapter.id] ?? 0 }),
            {},
          ),
          roomResults: chapters.reduce<GameProgress['roomResults']>((results, chapter, index) => {
            const fallbackTimeMs = (index + 4) * 61000 + ((index * 13) % 47) * 1000;
            const currentResult = progress.roomResults[chapter.id];
            const bestTimes = { ...emptyDifficultyTimes(), ...currentResult.bestTimes };
            const lastTimes = { ...emptyDifficultyTimes(), ...currentResult.lastTimes };
            DIFFICULTIES.forEach((difficulty, difficultyIndex) => {
              const difficultyTimeMs = fallbackTimeMs + difficultyIndex * 47000;
              bestTimes[difficulty] = bestTimes[difficulty] ?? difficultyTimeMs;
              lastTimes[difficulty] = lastTimes[difficulty] ?? difficultyTimeMs;
            });
            return {
              ...results,
              [chapter.id]: {
                roomId: chapter.id,
                completed: true,
                bestTimes,
                lastTimes,
                bestTimeMs: currentResult.bestTimeMs ?? getFastestBestTime(bestTimes) ?? fallbackTimeMs,
                lastTimeMs: currentResult.lastTimeMs ?? lastTimes[DEFAULT_DIFFICULTY] ?? fallbackTimeMs,
                completedAt: currentResult.completedAt ?? new Date().toISOString(),
              },
            };
          }, {}),
          usedHints: chapters.reduce<Record<string, number>>(
            (hints, chapter) => ({ ...hints, [chapter.id]: progress.usedHints[chapter.id] ?? 0 }),
            {},
          ),
        });
      },
      setProgressPreset: async (completedCount: number) => {
        await persist(buildProgressForCompletedRooms(completedCount, progress));
      },
      generateTestTimes: async () => {
        const currentProgress = progressRef.current;
        const completedIds = currentProgress.completedChapterIds;
        const roomResults = { ...currentProgress.roomResults };
        const chapterTimes = { ...currentProgress.chapterTimes };
        const now = new Date().toISOString();

        completedIds.forEach((roomId, index) => {
          const bestTimes = { ...emptyDifficultyTimes() };
          const lastTimes = { ...emptyDifficultyTimes() };
          DIFFICULTIES.forEach((difficulty, difficultyIndex) => {
            const testTimeMs = (index + 4 + difficultyIndex * 2) * 61000 + ((index * 17 + difficultyIndex * 19) % 53) * 1000;
            bestTimes[difficulty] = testTimeMs;
            lastTimes[difficulty] = testTimeMs + difficultyIndex * 3000;
          });
          roomResults[roomId] = {
            roomId,
            completed: true,
            bestTimes,
            lastTimes,
            bestTimeMs: getFastestBestTime(bestTimes),
            lastTimeMs: lastTimes[DEFAULT_DIFFICULTY] ?? undefined,
            completedAt: roomResults[roomId].completedAt ?? now,
          };
          chapterTimes[roomId] = Math.floor((lastTimes[DEFAULT_DIFFICULTY] ?? 0) / 1000);
        });

        await persist({ ...currentProgress, roomResults, chapterTimes });
      },
      resetAllRoomTimes: async () => {
        const currentProgress = progressRef.current;
        await persist({
          ...currentProgress,
          chapterTimes: {},
          roomResults: currentProgress.completedChapterIds.reduce<GameProgress['roomResults']>(
            (results, roomId) => ({
              ...results,
              [roomId]: {
                roomId,
                completed: true,
                bestTimes: emptyDifficultyTimes(),
                lastTimes: emptyDifficultyTimes(),
              },
            }),
            {},
          ),
        });
      },
      completeChapter: async (chapterId: string, elapsedTimeMs: number, hintCount: number, difficulty = DEFAULT_DIFFICULTY) => {
        const currentProgress = progressRef.current;
        const chapter = chapters.find((item) => item.id === chapterId);
        const completedChapterIds = currentProgress.completedChapterIds.includes(chapterId)
          ? currentProgress.completedChapterIds
          : [...currentProgress.completedChapterIds, chapterId];
        const unlockedChapterIds =
          chapter?.unlocksChapterId && !currentProgress.unlockedChapterIds.includes(chapter.unlocksChapterId)
            ? [...currentProgress.unlockedChapterIds, chapter.unlocksChapterId]
            : currentProgress.unlockedChapterIds;

        const currentResult = getRoomResultWithDifficultyTimes(chapterId, currentProgress.roomResults[chapterId]);
        const previousBestTime = currentResult.bestTimes[difficulty];
        const bestTimes = {
          ...currentResult.bestTimes,
          [difficulty]: previousBestTime === null || elapsedTimeMs < previousBestTime ? elapsedTimeMs : previousBestTime,
        };
        const lastTimes = {
          ...currentResult.lastTimes,
          [difficulty]: elapsedTimeMs,
        };

        await clearSudokuState(chapterId, difficulty);
        await persist({
          ...currentProgress,
          currentChapterId: chapter?.unlocksChapterId ?? chapterId,
          completedChapterIds,
          unlockedChapterIds,
          collectedRewardIds: chapter
            ? Array.from(new Set([...currentProgress.collectedRewardIds, chapter.reward.id]))
            : currentProgress.collectedRewardIds,
          chapterTimes: { ...currentProgress.chapterTimes, [chapterId]: Math.floor(elapsedTimeMs / 1000) },
          roomResults: {
            ...currentProgress.roomResults,
            [chapterId]: {
              roomId: chapterId,
              completed: true,
              bestTimes,
              lastTimes,
              bestTimeMs: getFastestBestTime(bestTimes),
              lastTimeMs: elapsedTimeMs,
              completedAt: new Date().toISOString(),
            },
          },
          usedHints: { ...currentProgress.usedHints, [chapterId]: hintCount },
        });
      },
      resetChapter: async (chapterId: string) => {
        const chapterIndex = chapters.findIndex((chapter) => chapter.id === chapterId);
        const previousChapters = chapters.slice(0, Math.max(chapterIndex, 0)).map((chapter) => chapter.id);
        const chapter = chapters.find((item) => item.id === chapterId);
        await clearRoomSudokuStates(chapterId);
        const { [chapterId]: _time, ...chapterTimes } = progress.chapterTimes;
        const { [chapterId]: _hints, ...usedHints } = progress.usedHints;
        const { [chapterId]: _result, ...roomResults } = progress.roomResults;
        await persist({
          ...progress,
          currentChapterId: chapterId,
          completedChapterIds: progress.completedChapterIds.filter((item) => item !== chapterId),
          unlockedChapterIds: Array.from(new Set([chapters[0].id ?? 'room-01', ...previousChapters, chapterId])),
          collectedRewardIds: chapter
            ? progress.collectedRewardIds.filter((item) => item !== chapter.reward.id)
            : progress.collectedRewardIds,
          chapterTimes,
          roomResults,
          usedHints,
        });
      },
      resetGame: async () => {
        await resetProgress();
        progressRef.current = defaultProgress;
        setProgress(defaultProgress);
      },
      clearLocalStorage: async () => {
        await resetProgress();
        progressRef.current = defaultProgress;
        setProgress(defaultProgress);
      },
    }),
    [progress, isHydrated],
  );

  return <GameProgressContext.Provider value={value}>{children}</GameProgressContext.Provider>;
}

export function useGameProgress() {
  const context = useContext(GameProgressContext);
  if (!context) {
    throw new Error('useGameProgress must be used inside GameProgressProvider');
  }
  return context;
}
