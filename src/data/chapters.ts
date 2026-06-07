import { csStory } from '../locales/csStory';
import { GameChapter, Room, RoomVisualKey } from '../types/chapter';
import { puzzles } from './puzzles';

type GameChapterConfig = Omit<Pick<GameChapter, 'id' | 'roomIds' | 'revealImage' | 'implemented'>, 'id'> & {
  id: keyof typeof csStory.gameChapters;
};

const gameChapterConfigurations: GameChapterConfig[] = [
  {
    id: 'chapter-01-arrival',
    roomIds: ['room-01', 'room-02', 'room-03', 'room-04', 'room-05'],
    revealImage: 'part01',
    implemented: true,
  },
  {
    id: 'chapter-02-exploration',
    roomIds: ['room-06', 'room-07', 'room-08', 'room-09', 'room-10'],
    revealImage: 'part02',
    implemented: true,
  },
  {
    id: 'chapter-03-staff-area',
    roomIds: ['room-11', 'room-12', 'room-13', 'room-14', 'room-15'],
    revealImage: 'part03',
    implemented: true,
  },
  {
    id: 'chapter-04-shift-name',
    roomIds: ['room-16', 'room-17', 'room-18', 'room-19', 'room-20'],
    revealImage: 'part04',
    implemented: true,
  },
  {
    id: 'chapter-05-case-214',
    roomIds: ['room-21', 'room-22', 'room-23', 'room-24', 'room-25'],
    revealImage: 'part05',
    implemented: true,
  },
];

type RoomConfig = {
  id: keyof typeof csStory.rooms;
  roomImage: string;
  visualKey: RoomVisualKey;
  clueImage: string;
};

const roomConfigurations: RoomConfig[] = [
  { id: 'room-01', roomImage: 'room-reception', visualKey: 'reception', clueImage: 'clue-room-card-214' },
  { id: 'room-02', roomImage: 'room-214', visualKey: 'room214', clueImage: 'clue-hotel-notebook' },
  { id: 'room-03', roomImage: 'room-restaurant', visualKey: 'restaurant', clueImage: 'clue-old-menu' },
  { id: 'room-04', roomImage: 'room-lobby-bar', visualKey: 'lobbyBar', clueImage: 'clue-bar-receipt' },
  { id: 'room-05', roomImage: 'room-winter-garden', visualKey: 'winterGarden', clueImage: 'clue-old-photo' },
  { id: 'room-06', roomImage: 'room-library', visualKey: 'library', clueImage: 'clue-library-card' },
  { id: 'room-07', roomImage: 'room-banquet-hall', visualKey: 'banquetHall', clueImage: 'clue-guest-list' },
  { id: 'room-08', roomImage: 'room-gallery', visualKey: 'gallery', clueImage: 'clue-cropped-photo' },
  { id: 'room-09', roomImage: 'room-corridor-floor-2', visualKey: 'corridorFloor2', clueImage: 'clue-map-fragment' },
  { id: 'room-10', roomImage: 'room-side-stairs', visualKey: 'sideStairs', clueImage: 'clue-old-key' },
  { id: 'room-11', roomImage: 'room-hotel-office', visualKey: 'hotelOffice', clueImage: 'clue-internal-note' },
  { id: 'room-12', roomImage: 'room-telephone-switchboard', visualKey: 'telephoneSwitchboard', clueImage: 'clue-call-record' },
  { id: 'room-13', roomImage: 'room-laundry', visualKey: 'laundry', clueImage: 'clue-coat-tag' },
  { id: 'room-14', roomImage: 'room-kitchen-corridor', visualKey: 'kitchenCorridor', clueImage: 'clue-night-shift-sheet' },
  { id: 'room-15', roomImage: 'room-service-elevator', visualKey: 'serviceElevator', clueImage: 'clue-service-slip' },
  { id: 'room-16', roomImage: 'room-guest-archive', visualKey: 'guestArchive', clueImage: 'clue-guest-book' },
  { id: 'room-17', roomImage: 'room-billing-archive', visualKey: 'billingArchive', clueImage: 'clue-closed-bill' },
  { id: 'room-18', roomImage: 'room-key-storage', visualKey: 'keyStorage', clueImage: 'clue-spare-key' },
  { id: 'room-19', roomImage: 'room-staff-room', visualKey: 'staffRoom', clueImage: 'clue-shift-schedule' },
  { id: 'room-20', roomImage: 'room-manager-office', visualKey: 'managerOffice', clueImage: 'clue-manager-note' },
  { id: 'room-21', roomImage: 'room-hotel-office', visualKey: 'hotelOffice', clueImage: 'clue-old-map' },
  { id: 'room-22', roomImage: 'room-elevator-machine-room', visualKey: 'elevatorMachineRoom', clueImage: 'clue-mechanical-record' },
  { id: 'room-23', roomImage: 'room-closed-wing', visualKey: 'closedWing', clueImage: 'clue-forgotten-suitcase' },
  { id: 'room-24', roomImage: 'room-closed-wing', visualKey: 'closedWing', clueImage: 'clue-notebook' },
  { id: 'room-25', roomImage: 'room-214-return', visualKey: 'room214Return', clueImage: 'clue-final-page' },
];

const clueCellPatterns = [
  [
    { row: 0, col: 8 },
    { row: 1, col: 3 },
    { row: 0, col: 2 },
  ],
  [
    { row: 2, col: 0 },
    { row: 4, col: 4 },
    { row: 7, col: 8 },
  ],
  [
    { row: 3, col: 4 },
    { row: 6, col: 6 },
    { row: 8, col: 1 },
  ],
  [
    { row: 1, col: 8 },
    { row: 5, col: 4 },
    { row: 8, col: 6 },
  ],
  [
    { row: 0, col: 0 },
    { row: 4, col: 4 },
    { row: 8, col: 8 },
  ],
];

export const gameChapters: GameChapter[] = gameChapterConfigurations.map((chapterConfig) => ({
  ...chapterConfig,
  ...csStory.gameChapters[chapterConfig.id],
}));

export const rooms: Room[] = roomConfigurations.map((configuredRoom, index) => {
  const order = index + 1;
  const chapter = gameChapters[Math.floor(index / 5)];
  const motifIndex = index % 5;
  const sudokuPuzzles = puzzles[index % puzzles.length];
  const nextId = order < roomConfigurations.length ? `room-${(order + 1).toString().padStart(2, '0')}` : undefined;
  const roomText = csStory.rooms[configuredRoom.id];

  return {
    id: configuredRoom.id,
    chapterId: chapter.id,
    order,
    title: configuredRoom.id,
    locationName: roomText.locationName,
    shortDescription: roomText.shortDescription,
    detailText: roomText.detailText,
    roomImage: configuredRoom.roomImage,
    clueTitle: roomText.clueTitle,
    clueImage: configuredRoom.clueImage,
    clueDescription: roomText.clueDescription,
    sudokuPuzzleId: sudokuPuzzles.medium.id,
    puzzleIds: {
      easy: sudokuPuzzles.easy.id,
      medium: sudokuPuzzles.medium.id,
      hard: sudokuPuzzles.hard.id,
    },
    sudokuPuzzles,
    puzzle: sudokuPuzzles.medium.puzzle,
    solution: sudokuPuzzles.medium.solution,
    clueCells: clueCellPatterns[motifIndex],
    unlocksChapterId: nextId,
    introText: roomText.detailText,
    completionTitle: roomText.clueTitle,
    completionText: roomText.clueDescription,
    reward: {
      id: `stop-${order.toString().padStart(2, '0')}`,
      title: roomText.rewardTitle ?? roomText.clueTitle,
      description: roomText.clueDescription,
      imageKey: configuredRoom.clueImage,
    },
    visualKey: configuredRoom.visualKey,
  };
});

export const chapters = rooms;
export const TOTAL_ROOMS = rooms.length;
export const TOTAL_STOPS = rooms.length;

export const getChapterById = (chapterId: string) => rooms.find((room) => room.id === chapterId) ?? rooms[0];
export const getRoomById = getChapterById;
export const getGameChapterById = (chapterId: string) =>
  gameChapters.find((chapter) => chapter.id === chapterId) ?? gameChapters[0];
export const getGameChapterForRoom = (roomId: string) => getGameChapterById(getRoomById(roomId).chapterId);
export const isChapterBoundaryRoom = (roomId: string) => getRoomById(roomId).order % 5 === 0;
export const getNextRoom = (roomId: string) => {
  const currentIndex = rooms.findIndex((room) => room.id === roomId);
  return currentIndex >= 0 ? rooms[currentIndex + 1] : undefined;
};
