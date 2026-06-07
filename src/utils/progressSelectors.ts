import { chapters, gameChapters, TOTAL_ROOMS, TOTAL_STOPS } from '../data/chapters';
import { Chapter, ChapterStatus } from '../types/chapter';
import { GameProgress, ProgressSourceOfTruth } from '../types/game';
import { canUseDevTools } from '../config/build';
import { emptyDifficultyTimes } from './difficulty';

export type ProgressSummary = {
  completedRooms: number;
  unlockedStops: number;
  currentRoomId: string;
  currentChapterId: string;
  nextAvailableRoomId: string;
  totalRooms: number;
  totalStops: number;
  progressValue: string;
  isComplete: boolean;
  homeProgress: string;
  mapProgress: string;
  journalProgress: string;
  hasProgressMismatch: boolean;
};

export const getCompletedRooms = (progress: GameProgress, rooms: Chapter[] = chapters) =>
  rooms.filter((chapter) => progress.completedChapterIds.includes(chapter.id)).length;

export const getUnlockedStops = (progress: GameProgress, rooms: Chapter[] = chapters) =>
  rooms.filter((chapter) => progress.completedChapterIds.includes(chapter.id) || progress.collectedRewardIds.includes(chapter.reward.id)).length;

export const getNextAvailableRoom = (progress: GameProgress, rooms: Chapter[] = chapters) =>
  rooms.find((chapter) => !progress.completedChapterIds.includes(chapter.id) && progress.unlockedChapterIds.includes(chapter.id));

export const getRoomStatus = (progress: GameProgress, roomId: string): ChapterStatus => {
  if (progress.completedChapterIds.includes(roomId)) {
    return 'completed';
  }

  if ((canUseDevTools && progress.gameMode === 'dev') || progress.unlockedChapterIds.includes(roomId)) {
    return 'available';
  }

  return 'locked';
};

export const getProgressSummary = (progress: GameProgress, rooms: Chapter[] = chapters): ProgressSummary => {
  const completedRooms = getCompletedRooms(progress, rooms);
  const unlockedStops = getUnlockedStops(progress, rooms);
  const nextAvailableRoom = getNextAvailableRoom(progress, rooms);
  const totalRooms = rooms.length;
  const totalStops = rooms.length;
  const homeProgress = `${completedRooms} / ${totalStops}`;
  const mapProgress = `${completedRooms} / ${totalRooms}`;
  const journalProgress = `${unlockedStops} / ${totalStops}`;

  return {
    completedRooms,
    unlockedStops,
    currentRoomId: progress.currentChapterId,
    currentChapterId: rooms.find((room) => room.id === progress.currentChapterId)?.chapterId ?? gameChapters[0].id,
    nextAvailableRoomId: nextAvailableRoom?.id ?? progress.currentChapterId,
    totalRooms: totalRooms || TOTAL_ROOMS,
    totalStops: totalStops || TOTAL_STOPS,
    progressValue: `${completedRooms}/${totalStops}`,
    isComplete: completedRooms >= totalRooms && totalRooms > 0,
    homeProgress,
    mapProgress,
    journalProgress,
    hasProgressMismatch: completedRooms !== unlockedStops || homeProgress !== mapProgress,
  };
};

export const getProgressSourceOfTruth = (progress: GameProgress, rooms: Chapter[] = chapters): ProgressSourceOfTruth => {
  const summary = getProgressSummary(progress, rooms);

  return {
    completedRooms: rooms.filter((room) => progress.completedChapterIds.includes(room.id)).map((room) => room.id),
    unlockedStops: rooms
      .filter((room) => progress.completedChapterIds.includes(room.id) || progress.collectedRewardIds.includes(room.reward.id))
      .map((room) => room.reward.id),
    currentRoom: summary.nextAvailableRoomId ?? summary.currentRoomId,
    currentChapter: summary.currentChapterId,
    totalRooms: summary.totalRooms,
    totalStops: summary.totalStops,
  };
};

export const buildProgressForCompletedRooms = (
  completedCount: number,
  baseProgress: GameProgress,
  rooms: Chapter[] = chapters,
): GameProgress => {
  const safeCount = Math.max(0, Math.min(completedCount, rooms.length));
  const completedRooms = rooms.slice(0, safeCount);
  const nextRoom = rooms[safeCount];
  const unlockedRooms = nextRoom ? [...completedRooms, nextRoom] : completedRooms;

  return {
    ...baseProgress,
    hasSeenIntro: safeCount > 0 ? true : baseProgress.hasSeenIntro,
    currentChapterId: nextRoom?.id ?? rooms[rooms.length - 1].id ?? baseProgress.currentChapterId,
    completedChapterIds: completedRooms.map((chapter) => chapter.id),
    unlockedChapterIds: Array.from(new Set([rooms[0].id ?? 'room-01', ...unlockedRooms.map((chapter) => chapter.id)])),
    collectedRewardIds: completedRooms.map((chapter) => chapter.reward.id),
    roomResults: completedRooms.reduce<GameProgress['roomResults']>(
      (results, chapter) => ({
        ...results,
        [chapter.id]: {
          roomId: chapter.id,
          completed: true,
          bestTimes: baseProgress.roomResults[chapter.id]?.bestTimes ?? emptyDifficultyTimes(),
          lastTimes: baseProgress.roomResults[chapter.id]?.lastTimes ?? emptyDifficultyTimes(),
          bestTimeMs: baseProgress.roomResults[chapter.id].bestTimeMs,
          lastTimeMs: baseProgress.roomResults[chapter.id].lastTimeMs,
          completedAt: baseProgress.roomResults[chapter.id].completedAt,
        },
      }),
      {},
    ),
  };
};
