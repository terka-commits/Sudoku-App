import type { LocaleResources } from '../locales';
import type { GameChapter, Room } from '../types/chapter';

type RoomTextId = keyof LocaleResources['rooms'];
type GameChapterTextId = keyof LocaleResources['gameChapters'];

export function getLocalizedRoom(room: Room, text: LocaleResources): Room {
  const roomText = text.rooms[room.id as RoomTextId];

  if (!roomText) {
    return room;
  }

  const rewardTitle = roomText.rewardTitle ?? roomText.clueTitle;

  return {
    ...room,
    locationName: roomText.locationName,
    shortDescription: roomText.shortDescription,
    detailText: roomText.detailText,
    clueTitle: roomText.clueTitle,
    clueDescription: roomText.clueDescription,
    introText: roomText.detailText,
    completionTitle: roomText.clueTitle,
    completionText: roomText.clueDescription,
    reward: {
      ...room.reward,
      title: rewardTitle,
      description: roomText.clueDescription,
    },
  };
}

export function getLocalizedGameChapter(chapter: GameChapter, text: LocaleResources): GameChapter {
  const chapterText = text.gameChapters[chapter.id as GameChapterTextId];

  if (!chapterText) {
    return chapter;
  }

  return {
    ...chapter,
    title: chapterText.title,
    subtitle: chapterText.subtitle,
    tone: chapterText.tone,
    revealTitle: chapterText.revealTitle,
    revealText: chapterText.revealText,
    revealCta: chapterText.revealCta,
  };
}
