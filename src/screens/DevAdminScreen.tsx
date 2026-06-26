import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mysteryAssets } from '../assets/mysteryAssets';
import { GoldButton, ToolButton } from '../components/MysteryButtons';
import { MysteryHeader } from '../components/MysteryHeader';
import { MysteryScreen } from '../components/MysteryScreen';
import { OrnateCard } from '../components/OrnateCard';
import { StatusBadge } from '../components/StatusBadge';
import { chapters, gameChapters } from '../data/chapters';
import { useGameProgress } from '../hooks/useGameProgress';
import { getLocalizedGameChapter, getLocalizedRoom, useI18n } from '../i18n';
import { RootStackParamList } from '../navigation/types';
import { mysteryColors, mysterySpacing, mysteryTypography } from '../theme';
import type { Difficulty } from '../types/sudoku';
import { DEFAULT_DIFFICULTY, DIFFICULTIES } from '../utils/difficulty';
import { getProgressSummary, getRoomStatus } from '../utils/progressSelectors';

type Props = NativeStackScreenProps<RootStackParamList, 'DevAdmin'>;

const getCodeForChapter = (chapterId: string, difficulty: Difficulty = DEFAULT_DIFFICULTY) => {
  const chapter = chapters.find((item) => item.id === chapterId) ?? chapters[0];
  const puzzle = chapter.sudokuPuzzles[difficulty] ?? chapter.sudokuPuzzles[DEFAULT_DIFFICULTY];
  return chapter.clueCells.map((cell) => puzzle.solution[cell.row][cell.col]).join('');
};

export function DevAdminScreen({ navigation }: Props) {
  const { text } = useI18n();
  const insets = useSafeAreaInsets();
  const devText = text.screens.devAdmin;
  const {
    progress,
    toggleGameMode,
    completeChapter,
    resetChapter,
    resetGame,
    clearLocalStorage,
    setProgressPreset,
    generateTestTimes,
    resetAllRoomTimes,
  } = useGameProgress();
  const progressSummary = getProgressSummary(progress);
  const isDevMode = progress.gameMode === 'dev';
  const localizedChapters = chapters.map((chapter) => getLocalizedRoom(chapter, text));
  const localizedGameChapters = gameChapters.map((chapter) => getLocalizedGameChapter(chapter, text));
  const difficultyLabelsDev: Record<Difficulty, string> = {
    easy: text.difficulty.easy,
    medium: text.difficulty.medium,
    hard: text.difficulty.hard,
  };

  const confirmReset = (action: () => Promise<void>, label = devText.resetAction) => {
    Alert.alert(devText.resetTitle, devText.resetMessage, [
      { text: devText.cancel, style: 'cancel' },
      { text: label, style: 'destructive', onPress: action },
    ]);
  };

  const readoutRows = [
    [devText.currentMode, progress.gameMode],
    [devText.readoutCompletedRooms, `${progressSummary.completedRooms}`],
    [devText.readoutUnlockedClues, `${progressSummary.unlockedStops}`],
    [devText.readoutCurrentRoom, progressSummary.currentRoomId],
    [devText.readoutNextRoom, progressSummary.nextAvailableRoomId ?? devText.none],
    [devText.readoutTotalRooms, `${progressSummary.totalRooms}`],
    [devText.readoutTotalClues, `${progressSummary.totalStops}`],
    [devText.readoutProgressValue, progressSummary.progressValue],
    [devText.readoutStoredProgress, 'AsyncStorage:sudoku-mystery:progress'],
    [devText.readoutHomeProgress, progressSummary.homeProgress],
    [devText.readoutMapProgress, progressSummary.mapProgress],
    [devText.readoutJournalProgress, progressSummary.journalProgress],
    [
      devText.readoutTimedRooms,
      `${Object.values(progress.roomResults).filter((result) => Object.values(result.bestTimes ?? {}).some((time) => time !== null)).length}`,
    ],
  ];

  return (
    <MysteryScreen
      backgroundSource={mysteryAssets.mapBackgroundWood}
      contentStyle={[styles.screen, { paddingBottom: Math.max(insets.bottom, mysterySpacing.sm) + mysterySpacing.md }]}
    >
      <MysteryHeader onBack={() => navigation.goBack()} title={devText.title} subtitle={devText.subtitle} />

      <OrnateCard glow>
        <Text style={styles.warning}>{devText.currentMode}: {isDevMode ? devText.devMode : devText.userMode}</Text>
        <Text style={styles.copy}>{devText.modeCopy}</Text>
        <View style={styles.grid}>
          <ToolButton title={isDevMode ? devText.userMode : devText.devMode} icon="swap-horizontal-outline" onPress={toggleGameMode} active={isDevMode} />
          <ToolButton title={devText.resetProgress} icon="refresh-outline" onPress={() => confirmReset(resetGame)} />
          <ToolButton title={devText.clearStorage} icon="trash-outline" onPress={() => confirmReset(clearLocalStorage, devText.delete)} />
          <ToolButton title={devText.testTimes} icon="time-outline" onPress={generateTestTimes} disabled={!isDevMode} />
          <ToolButton title={devText.resetTimes} icon="hourglass-outline" onPress={() => confirmReset(resetAllRoomTimes)} disabled={!isDevMode} />
        </View>
      </OrnateCard>

      <Text style={styles.section}>{devText.debug}</Text>
      <OrnateCard>
        {progressSummary.hasProgressMismatch ? <Text style={styles.mismatch}>{devText.mismatch}</Text> : <Text style={styles.ok}>{devText.ok}</Text>}
        {readoutRows.map(([label, value]) => (
          <View key={label} style={styles.readoutRow}>
            <Text style={styles.readoutLabel}>{label}</Text>
            <Text style={styles.readoutValue}>{value}</Text>
          </View>
        ))}
      </OrnateCard>

      <Text style={styles.section}>{devText.presets}</Text>
      <View style={styles.grid}>
        {chapters.map((_, index) => (
          <ToolButton key={index} title={`${devText.setProgress} ${index}/${chapters.length}`} icon="analytics-outline" onPress={() => setProgressPreset(index)} disabled={!isDevMode} />
        ))}
        <ToolButton
          title={`${devText.setProgress} ${chapters.length}/${chapters.length}`}
          icon="checkmark-done-outline"
          onPress={() => setProgressPreset(chapters.length)}
          disabled={!isDevMode}
        />
      </View>

      {localizedGameChapters.map((chapter, chapterIndex) => (
        <View key={chapter.id}>
          <Text style={styles.section}>{chapter.title} {devText.progress}</Text>
          <View style={styles.grid}>
            {Array.from({ length: 6 }, (_, index) => {
              const completedCount = chapterIndex * 5 + index;
              return (
                <ToolButton
                  key={index}
                  title={`${chapter.title} ${index}/5`}
                  icon="analytics-outline"
                  onPress={() => setProgressPreset(completedCount)}
                  disabled={!isDevMode}
                />
              );
            })}
          </View>
        </View>
      ))}

      <Text style={styles.section}>{devText.quickNav}</Text>
      <View style={styles.grid}>
        <ToolButton title={devText.home} icon="home-outline" onPress={() => navigation.navigate('Splash')} />
        <ToolButton title={devText.intro} icon="book-outline" onPress={() => navigation.navigate('IntroStory')} />
        <ToolButton title={text.screens.hotelMap.title} icon="map-outline" onPress={() => navigation.navigate('HotelMap')} />
        <ToolButton title={devText.journal} icon="journal-outline" onPress={() => navigation.navigate('Evidence')} />
        <ToolButton title={devText.achievements} icon="trophy-outline" onPress={() => navigation.navigate('Achievements')} />
        <ToolButton title={devText.finale} icon="sparkles" onPress={() => navigation.navigate('Final')} />
      </View>

      <Text style={styles.section}>{devText.reveals}</Text>
      <View style={styles.grid}>
        {localizedGameChapters.map((chapter) => (
          <ToolButton
            key={chapter.id}
            title={chapter.title}
            icon="newspaper-outline"
            onPress={() => navigation.navigate('ChapterReveal', { chapterId: chapter.id, returnTo: 'dev' })}
          />
        ))}
      </View>

      <Text style={styles.section}>{devText.rooms}</Text>
      {localizedChapters.map((chapter) => {
        const status = getRoomStatus(progress, chapter.id);
        const rewardFound = progress.completedChapterIds.includes(chapter.id) || progress.collectedRewardIds.includes(chapter.reward.id);

        return (
          <OrnateCard key={chapter.id}>
            <View style={styles.chapterHead}>
              <View style={styles.chapterTitleWrap}>
                <Text style={styles.chapterKicker}>{devText.room} {chapter.order}</Text>
                <Text style={styles.chapterTitle}>{chapter.locationName}</Text>
                <Text style={styles.copy}>{chapter.reward.title}: {rewardFound ? devText.found : devText.hidden}</Text>
              </View>
              <StatusBadge
                label={status === 'completed' ? devText.completed : status === 'available' ? devText.available : devText.locked}
                tone={status === 'completed' ? 'done' : status === 'available' ? 'active' : 'locked'}
                icon={status === 'completed' ? 'checkmark' : status === 'available' ? 'lock-open-outline' : 'lock-closed'}
              />
            </View>
            <View style={styles.grid}>
              <ToolButton title={devText.detail} icon="document-text-outline" onPress={() => navigation.navigate('ChapterDetail', { chapterId: chapter.id, returnTo: 'dev' })} />
              {DIFFICULTIES.map((difficulty) => (
                <ToolButton
                  key={difficulty}
                  title={difficultyLabelsDev[difficulty]}
                  icon="grid-outline"
                  onPress={() => navigation.navigate('Sudoku', { chapterId: chapter.id, difficulty, returnTo: 'dev' })}
                />
              ))}
              <ToolButton
                title={devText.gainedClue}
                icon="gift-outline"
                onPress={() =>
                  navigation.navigate('Reward', {
                    chapterId: chapter.id,
                    difficulty: DEFAULT_DIFFICULTY,
                    code: getCodeForChapter(chapter.id),
                    elapsedSeconds: progress.chapterTimes[chapter.id] ?? 0,
                    hintCount: progress.usedHints[chapter.id] ?? 0,
                    returnTo: 'dev',
                  })
                }
              />
              {DIFFICULTIES.map((difficulty) => (
                <ToolButton
                  key={`complete-${difficulty}`}
                  title={`${devText.complete} ${difficultyLabelsDev[difficulty]}`}
                  icon="checkmark-circle-outline"
                  onPress={() => completeChapter(chapter.id, (progress.chapterTimes[chapter.id] ?? 0) * 1000, progress.usedHints[chapter.id] ?? 0, difficulty)}
                  disabled={!isDevMode}
                />
              ))}
              <ToolButton title={devText.resetRoom} icon="refresh-outline" onPress={() => resetChapter(chapter.id)} disabled={!isDevMode} />
            </View>
          </OrnateCard>
        );
      })}

      <GoldButton title={text.buttons.backToMap} icon="map-outline" onPress={() => navigation.navigate('HotelMap')} />
    </MysteryScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    maxWidth: 880,
    width: '100%',
  },
  warning: {
    color: mysteryColors.goldLight,
    fontWeight: '900',
    letterSpacing: 1.4,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  copy: {
    color: mysteryColors.muted,
    lineHeight: 21,
    marginTop: mysterySpacing.xs,
  },
  section: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.h2,
    fontWeight: '900',
    marginTop: mysterySpacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: mysterySpacing.sm,
    marginTop: mysterySpacing.md,
  },
  mismatch: {
    color: '#F4A6A6',
    fontWeight: '900',
    marginBottom: mysterySpacing.sm,
  },
  ok: {
    color: mysteryColors.goldLight,
    fontWeight: '900',
    marginBottom: mysterySpacing.sm,
  },
  readoutRow: {
    borderTopColor: 'rgba(226, 194, 117, 0.12)',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: mysterySpacing.md,
    justifyContent: 'space-between',
    paddingVertical: mysterySpacing.xs,
  },
  readoutLabel: {
    color: mysteryColors.muted,
    flex: 1,
    fontSize: mysteryTypography.small,
  },
  readoutValue: {
    color: mysteryColors.cream,
    flex: 1,
    fontSize: mysteryTypography.small,
    fontWeight: '800',
    textAlign: 'right',
  },
  chapterHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: mysterySpacing.md,
  },
  chapterTitleWrap: {
    flex: 1,
  },
  chapterKicker: {
    color: mysteryColors.gold,
    fontSize: mysteryTypography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  chapterTitle: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.h3,
    fontWeight: '900',
  },
});
