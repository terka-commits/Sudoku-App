import type { Difficulty, SudokuPuzzleDefinition } from './sudoku';

export type ChapterStatus = 'locked' | 'available' | 'completed';

export type ClueCell = {
  row: number;
  col: number;
};

export type Reward = {
  id: string;
  title: string;
  description: string;
  imageKey?: string;
};

export type GameChapter = {
  id: string;
  title: string;
  subtitle: string;
  tone: string;
  roomIds: string[];
  revealTitle: string;
  revealText: string;
  revealCta?: string;
  revealImage?: string;
  implemented: boolean;
};

export type Room = {
  id: string;
  chapterId: string;
  order: number;
  title: string;
  shortDescription: string;
  detailText: string;
  roomImage: string;
  clueTitle: string;
  clueImage: string;
  clueDescription: string;
  sudokuPuzzleId: string;
  puzzleIds: Record<Difficulty, string>;
  sudokuPuzzles: Record<Difficulty, SudokuPuzzleDefinition>;
  puzzle: number[][];
  solution: number[][];
  clueCells: ClueCell[];
  unlocksChapterId?: string;

  // Compatibility aliases while older screens are migrated to the room model.
  locationName: string;
  introText: string;
  completionTitle: string;
  completionText: string;
  reward: Reward;
  visualKey: RoomVisualKey;
};

export type Chapter = Room;

export type RoomVisualKey =
  | 'reception'
  | 'room'
  | 'office'
  | 'auction'
  | 'secret'
  | 'room214'
  | 'restaurant'
  | 'lobbyBar'
  | 'winterGarden'
  | 'library'
  | 'banquetHall'
  | 'gallery'
  | 'corridorFloor2'
  | 'sideStairs'
  | 'hotelOffice'
  | 'telephoneSwitchboard'
  | 'laundry'
  | 'kitchenCorridor'
  | 'serviceElevator'
  | 'guestArchive'
  | 'billingArchive'
  | 'keyStorage'
  | 'staffRoom'
  | 'managerOffice'
  | 'elevatorMachineRoom'
  | 'closedWing'
  | 'room214Return';
