import type { Difficulty } from '../types/sudoku';

export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  IntroStory: undefined;
  HotelMap: undefined;
  Achievements: undefined;
  ChapterDetail: { chapterId: string; returnTo: 'home' | 'map' | 'dev' };
  Sudoku: { chapterId: string; difficulty: Difficulty; returnTo: 'home' | 'map' | 'dev' };
  Reward: { chapterId: string; difficulty: Difficulty; code: string; elapsedSeconds: number; hintCount: number; returnTo: 'home' | 'map' | 'dev' };
  ChapterReveal: { chapterId: string; returnTo: 'home' | 'map' | 'dev' };
  Evidence: undefined;
  Final: undefined;
  Settings: undefined;
  DevAdmin: undefined;
};
