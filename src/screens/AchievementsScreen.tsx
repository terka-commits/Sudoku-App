import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, ImageBackground, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mysteryAssets } from '../assets/mysteryAssets';
import { MainBottomNav, MAIN_BOTTOM_NAV_HEIGHT } from '../components/MainBottomNav';
import { chapters } from '../data/chapters';
import { useGameProgress } from '../hooks/useGameProgress';
import { getLocalizedRoom, useI18n } from '../i18n';
import { RootStackParamList } from '../navigation/types';
import { mysteryColors, mysteryRadii, mysteryShadows, mysterySpacing, mysteryTypography } from '../theme';
import type { Difficulty } from '../types/sudoku';
import { DIFFICULTIES } from '../utils/difficulty';
import { getProgressSummary } from '../utils/progressSelectors';
import { formatDuration } from '../utils/time';

type Props = NativeStackScreenProps<RootStackParamList, 'Achievements'>;
type SortMode = 'story' | 'fastest';

type DifficultyTimeEntry = {
  difficulty: Difficulty;
  timeMs: number;
};

const getRoomBestTimeEntries = (progress: ReturnType<typeof useGameProgress>['progress'], roomId: string): DifficultyTimeEntry[] => {
  const bestTimes = progress.roomResults[roomId]?.bestTimes;

  if (!bestTimes) {
    return [];
  }

  return DIFFICULTIES
    .map((difficulty) => {
      const timeMs = bestTimes[difficulty];
      return typeof timeMs === 'number' ? { difficulty, timeMs } : null;
    })
    .filter((entry): entry is DifficultyTimeEntry => entry !== null);
};

const getFastestRoomTimeMs = (progress: ReturnType<typeof useGameProgress>['progress'], roomId: string) => {
  const roomTimes = getRoomBestTimeEntries(progress, roomId).map((entry) => entry.timeMs);
  return roomTimes.length > 0 ? Math.min(...roomTimes) : null;
};

const fillTemplate = (template: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce((result, [key, value]) => result.replace(`{{${key}}}`, `${value}`), template);

export function AchievementsScreen({ navigation }: Props) {
  const { progress } = useGameProgress();
  const { text } = useI18n();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tablet = width >= 760;
  const [sortMode, setSortMode] = useState<SortMode>('story');
  const progressSummary = getProgressSummary(progress);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  const recordedRoomTimes = chapters
    .map((room) => getFastestRoomTimeMs(progress, room.id))
    .filter((time): time is number => time !== null);
  const bestTime = recordedRoomTimes.length > 0 ? Math.min(...recordedRoomTimes) : undefined;
  const totalTime = recordedRoomTimes.length > 0 ? recordedRoomTimes.reduce((sum, time) => sum + time, 0) : undefined;

  const roomRows = useMemo(() => {
    const sortedRooms = sortMode === 'fastest'
      ? chapters
          .filter((room) => getFastestRoomTimeMs(progress, room.id) !== null)
          .sort(
            (a, b) =>
              (getFastestRoomTimeMs(progress, a.id) ?? Number.POSITIVE_INFINITY) -
              (getFastestRoomTimeMs(progress, b.id) ?? Number.POSITIVE_INFINITY),
          )
      : chapters;

    return sortedRooms.map((room) => getLocalizedRoom(room, text));
  }, [progress, sortMode, text]);

  return (
    <ImageBackground source={mysteryAssets.mapBackgroundWood} resizeMode="cover" style={styles.background} imageStyle={styles.backgroundImage}>
      <View style={styles.overlay} />
      <FlatList
        data={roomRows}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          tablet && styles.tabletListContent,
          {
            paddingBottom: MAIN_BOTTOM_NAV_HEIGHT + Math.max(insets.bottom, mysterySpacing.sm) + mysterySpacing.xl,
            paddingTop: insets.top + mysterySpacing.sm,
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <View style={styles.topActions}>
              <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}>
                <Ionicons name="chevron-back" size={24} color={mysteryColors.goldLight} />
              </Pressable>
              <View style={styles.ornament} pointerEvents="none">
                <View style={styles.ornamentLine} />
                <View style={styles.ornamentDiamond} />
                <View style={styles.ornamentLine} />
              </View>
              <View style={styles.roundButtonGhost} />
            </View>

            <View style={styles.titleBlock}>
              <Text style={styles.title}>{text.screens.achievements.title}</Text>
              <Text style={styles.subtitle}>{text.screens.achievements.subtitle}</Text>
            </View>

            <View style={styles.summaryPanel}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>{text.labels.completed}</Text>
                <Text style={styles.summaryValue}>
                  {fillTemplate(text.screens.achievements.completedSummary, {
                    completed: progressSummary.completedRooms,
                    total: progressSummary.totalRooms,
                  })}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>{text.screens.achievements.bestTime}</Text>
                <Text style={styles.summaryValue}>{formatDuration(bestTime)}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>{text.screens.achievements.totalTime}</Text>
                <Text style={styles.summaryValue}>{formatDuration(totalTime)}</Text>
              </View>
            </View>

            <View style={styles.sortPanel}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: sortMode === 'story' }}
                onPress={() => setSortMode('story')}
                style={({ pressed }) => [styles.sortButton, sortMode === 'story' && styles.sortButtonActive, pressed && styles.pressed]}
              >
                <Text style={[styles.sortText, sortMode === 'story' && styles.sortTextActive]}>{text.screens.achievements.sortStory}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: sortMode === 'fastest' }}
                onPress={() => setSortMode('fastest')}
                style={({ pressed }) => [styles.sortButton, sortMode === 'fastest' && styles.sortButtonActive, pressed && styles.pressed]}
              >
                <Text style={[styles.sortText, sortMode === 'fastest' && styles.sortTextActive]}>{text.screens.achievements.sortFastest}</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyPanel}>
            <Text style={styles.emptyText}>{text.screens.achievements.empty}</Text>
          </View>
        }
        renderItem={({ item }) => {
          const completed = progress.completedChapterIds.includes(item.id);
          const bestTimeEntries = getRoomBestTimeEntries(progress, item.id);

          return (
            <View style={styles.roomCard}>
              <View style={styles.roomTopRow}>
                <Text style={styles.roomKicker}>{text.screens.sudoku.room} {item.order}</Text>
                <Text style={[styles.status, completed ? styles.statusDone : styles.statusIdle]}>
                  {completed ? text.labels.completed : text.screens.achievements.notPlayed}
                </Text>
              </View>
              <Text style={styles.roomTitle}>{item.locationName}</Text>
              {bestTimeEntries.length > 0 ? (
                <View style={styles.timeList}>
                  {bestTimeEntries.map((entry) => (
                    <View key={entry.difficulty} style={styles.timeRow}>
                      <View>
                        <Text style={styles.timeLabel}>{text.screens.achievements.bestTime}</Text>
                        <Text style={styles.bestTime}>{formatDuration(entry.timeMs)}</Text>
                      </View>
                      <View style={styles.difficultyBadge}>
                        <Text style={styles.difficultyBadgeText}>{text.difficulty[entry.difficulty]}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.notPlayed}>{text.screens.achievements.noBestTime}</Text>
              )}
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.itemGap} />}
      />

      <MainBottomNav
        active="achievements"
        bottomInset={insets.bottom}
        onHome={() => navigation.navigate('Splash')}
        onCases={() => navigation.navigate('HotelMap')}
        onJournal={() => navigation.navigate('Evidence')}
        onAchievements={() => undefined}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.96,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 8, 0.68)',
  },
  list: {
    flex: 1,
  },
  listContent: {
    alignSelf: 'center',
    maxWidth: 720,
    paddingHorizontal: mysterySpacing.lg,
    width: '100%',
  },
  tabletListContent: {
    maxWidth: 880,
  },
  headerContent: {
    gap: mysterySpacing.md,
    marginBottom: mysterySpacing.lg,
  },
  topActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  roundButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(7, 16, 20, 0.48)',
    borderColor: 'rgba(226, 194, 117, 0.5)',
    borderRadius: 23,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  roundButtonGhost: {
    width: 46,
  },
  ornament: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: mysterySpacing.lg,
    maxWidth: 190,
  },
  ornamentLine: {
    backgroundColor: 'rgba(226, 194, 117, 0.48)',
    flex: 1,
    height: 1,
  },
  ornamentDiamond: {
    backgroundColor: 'rgba(201, 167, 92, 0.16)',
    borderColor: mysteryColors.goldLight,
    borderWidth: 1,
    height: 9,
    marginHorizontal: mysterySpacing.sm,
    transform: [{ rotate: '45deg' }],
    width: 9,
  },
  titleBlock: {
    alignItems: 'center',
    gap: 2,
  },
  title: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.title,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    color: mysteryColors.muted,
    fontSize: mysteryTypography.body,
    lineHeight: 22,
    textAlign: 'center',
  },
  summaryPanel: {
    backgroundColor: 'rgba(5, 13, 17, 0.68)',
    borderColor: 'rgba(226, 194, 117, 0.3)',
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    gap: mysterySpacing.sm,
    padding: mysterySpacing.md,
    ...mysteryShadows.panel,
  },
  summaryItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: mysterySpacing.md,
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: 'rgba(226, 194, 117, 0.74)',
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.body,
    fontWeight: '900',
    textAlign: 'right',
  },
  summaryDivider: {
    backgroundColor: 'rgba(226, 194, 117, 0.14)',
    height: 1,
  },
  sortPanel: {
    alignSelf: 'center',
    backgroundColor: 'rgba(7, 16, 20, 0.68)',
    borderColor: 'rgba(226, 194, 117, 0.24)',
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: mysterySpacing.xs,
    padding: mysterySpacing.xs,
    width: '100%',
  },
  sortButton: {
    alignItems: 'center',
    borderRadius: mysteryRadii.sm,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: mysterySpacing.sm,
  },
  sortButtonActive: {
    backgroundColor: mysteryColors.gold,
  },
  sortText: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.small,
    fontWeight: '900',
  },
  sortTextActive: {
    color: mysteryColors.paperInk,
  },
  roomCard: {
    backgroundColor: 'rgba(5, 13, 17, 0.64)',
    borderColor: 'rgba(226, 194, 117, 0.22)',
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    padding: mysterySpacing.md,
  },
  roomTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: mysterySpacing.md,
    justifyContent: 'space-between',
  },
  roomKicker: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  status: {
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  statusDone: {
    color: mysteryColors.goldLight,
  },
  statusIdle: {
    color: mysteryColors.muted,
  },
  roomTitle: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.h3,
    fontWeight: '900',
    marginTop: mysterySpacing.xs,
  },
  timeList: {
    gap: mysterySpacing.xs,
    marginTop: mysterySpacing.sm,
  },
  timeRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(226, 194, 117, 0.07)',
    borderColor: 'rgba(226, 194, 117, 0.16)',
    borderRadius: mysteryRadii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: mysterySpacing.sm,
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: mysterySpacing.sm,
    paddingVertical: mysterySpacing.xs,
  },
  timeLabel: {
    color: mysteryColors.muted,
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bestTime: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.small,
    fontWeight: '900',
    marginTop: 2,
  },
  difficultyBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(201, 167, 92, 0.2)',
    borderColor: 'rgba(226, 194, 117, 0.32)',
    borderRadius: mysteryRadii.sm,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 30,
    minWidth: 86,
    paddingHorizontal: mysterySpacing.sm,
  },
  difficultyBadgeText: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
  },
  notPlayed: {
    color: mysteryColors.muted,
    fontSize: mysteryTypography.small,
    fontWeight: '800',
    marginTop: mysterySpacing.sm,
  },
  emptyPanel: {
    backgroundColor: 'rgba(5, 13, 17, 0.64)',
    borderColor: 'rgba(226, 194, 117, 0.22)',
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    padding: mysterySpacing.lg,
  },
  emptyText: {
    color: mysteryColors.muted,
    fontSize: mysteryTypography.body,
    lineHeight: 22,
    textAlign: 'center',
  },
  itemGap: {
    height: mysterySpacing.md,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
});
