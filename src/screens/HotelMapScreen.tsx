import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { mysteryAssets } from '../assets/mysteryAssets';
import { ChapterCard } from '../components/ChapterCard/ChapterCard';
import { ChapterProgressSegments } from '../components/ChapterProgressSegments';
import { MainBottomNav, MAIN_BOTTOM_NAV_HEIGHT } from '../components/MainBottomNav';
import { canUseDevTools } from '../config/build';
import { chapters, gameChapters } from '../data/chapters';
import { useGameProgress } from '../hooks/useGameProgress';
import { getLocalizedGameChapter, getLocalizedRoom, useI18n } from '../i18n';
import { RootStackParamList } from '../navigation/types';
import { mysteryColors, mysteryRadii, mysteryShadows, mysterySpacing, mysteryTypography } from '../theme';
import { getProgressSummary, getRoomStatus } from '../utils/progressSelectors';

type Props = NativeStackScreenProps<RootStackParamList, 'HotelMap'>;

const fillTemplate = (template: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce((result, [key, value]) => result.replace(`{{${key}}}`, `${value}`), template);

export function HotelMapScreen({ navigation }: Props) {
  const { progress } = useGameProgress();
  const { text } = useI18n();
  const insets = useSafeAreaInsets();
  const isDevMode = canUseDevTools && progress.gameMode === 'dev';
  const progressSummary = getProgressSummary(progress);
  const roomsPerChapter = 5;
  const currentPartIndex = Math.min(gameChapters.length - 1, Math.floor(progressSummary.completedRooms / roomsPerChapter));
  const currentPartCompleted = progressSummary.completedRooms - currentPartIndex * roomsPerChapter;
  const currentPartNumber = currentPartIndex + 1;
  const sections = gameChapters.map((baseGameChapter) => {
    const gameChapter = getLocalizedGameChapter(baseGameChapter, text);
    const chapterRooms = chapters
      .filter((chapter) => chapter.chapterId === baseGameChapter.id)
      .map((chapter) => getLocalizedRoom(chapter, text));

    return {
      completed: chapterRooms.filter((chapter) => progress.completedChapterIds.includes(chapter.id)).length,
      data: chapterRooms,
      gameChapter,
    };
  });

  return (
    <ImageBackground source={mysteryAssets.mapBackgroundWood} resizeMode="cover" style={styles.background} imageStyle={styles.backgroundImage}>
      <LinearGradient
        colors={['rgba(2, 6, 8, 0.72)', 'rgba(7, 16, 20, 0.62)', 'rgba(2, 6, 8, 0.88)']}
        locations={[0, 0.48, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView edges={['top']} style={styles.screen}>
        <View style={styles.topSection}>
          <View style={styles.topActions}>
            <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Splash')} style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}>
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
            <Text style={styles.title}>{text.screens.hotelMap.title}</Text>
            <Text style={styles.subtitle}>{text.screens.hotelMap.subtitle}</Text>
          </View>

          {__DEV__ && canUseDevTools && isDevMode && (
            <Pressable accessibilityRole="link" onPress={() => navigation.navigate('DevAdmin')} hitSlop={8} style={({ pressed }) => pressed && styles.pressed}>
              <Text style={styles.devLink}>DEV ADMIN - Dev mode</Text>
            </Pressable>
          )}
        </View>

        <SectionList
          style={styles.scroller}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: MAIN_BOTTOM_NAV_HEIGHT + Math.max(insets.bottom, mysterySpacing.sm) + mysterySpacing.xl }]}
          sections={sections}
          keyExtractor={(item) => item.id}
          initialNumToRender={6}
          maxToRenderPerBatch={5}
          removeClippedSubviews
          stickySectionHeadersEnabled={false}
          windowSize={5}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.progressPanel}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>{text.screens.hotelMap.progressLabel}</Text>
                  <Text style={styles.progressCount}>
                    {fillTemplate(text.screens.hotelMap.completedRooms, { progress: progressSummary.mapProgress })}
                  </Text>
                </View>
                <Text style={styles.partProgress}>
                  {fillTemplate(text.screens.hotelMap.partProgress, {
                    part: currentPartNumber,
                    completed: currentPartCompleted,
                    total: roomsPerChapter,
                  })}
                </Text>
                <ChapterProgressSegments completedRooms={progressSummary.completedRooms} roomsPerChapter={roomsPerChapter} totalChapters={gameChapters.length} totalRooms={progressSummary.totalRooms} />
              </View>

              <View style={styles.map}>
                <ImageBackground source={mysteryAssets.mapBlueprint} resizeMode="cover" style={styles.heroBanner} imageStyle={styles.heroImage}>
                  <LinearGradient
                    colors={['rgba(3, 8, 11, 0.12)', 'rgba(5, 16, 21, 0.42)', 'rgba(2, 6, 8, 0.94)']}
                    locations={[0, 0.46, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                  <LinearGradient
                    colors={['rgba(226, 194, 117, 0.18)', 'rgba(226, 194, 117, 0)', 'rgba(3, 8, 11, 0.4)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                </ImageBackground>
              </View>
            </View>
          }
          renderSectionHeader={({ section }) => (
            <View style={styles.chapterGroupHeader}>
              <View style={styles.chapterGroupTopRow}>
                <Text style={styles.chapterKicker}>{section.gameChapter.title}</Text>
                <Text style={styles.chapterProgress}>{section.completed}/{section.data.length}</Text>
              </View>
              <Text style={styles.chapterTitle}>{section.gameChapter.subtitle}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <ChapterCard
              chapter={item}
              status={getRoomStatus(progress, item.id)}
              onPress={() => navigation.navigate('ChapterDetail', { chapterId: item.id, returnTo: 'map' })}
            />
          )}
          SectionSeparatorComponent={() => <View style={styles.sectionGap} />}
          ItemSeparatorComponent={() => <View style={styles.itemGap} />}
        />

        <MainBottomNav
          active="cases"
          bottomInset={insets.bottom}
          onHome={() => navigation.navigate('Splash')}
          onCases={() => navigation.navigate('HotelMap')}
          onJournal={() => navigation.navigate('Evidence')}
          onAchievements={() => navigation.navigate('Achievements')}
        />
      </SafeAreaView>
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
  screen: {
    flex: 1,
    gap: 0,
    maxWidth: '100%',
    paddingBottom: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  topSection: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: mysterySpacing.sm,
    maxWidth: 880,
    paddingHorizontal: mysterySpacing.lg,
    paddingTop: mysterySpacing.sm,
    width: '100%',
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
  scroller: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignSelf: 'center',
    gap: mysterySpacing.md,
    maxWidth: 880,
    paddingHorizontal: mysterySpacing.lg,
    paddingTop: mysterySpacing.lg,
    width: '100%',
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
  devLink: {
    color: 'rgba(184, 170, 144, 0.58)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    paddingTop: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  progressPanel: {
    alignSelf: 'center',
    backgroundColor: 'rgba(7, 16, 20, 0.46)',
    borderColor: 'rgba(226, 194, 117, 0.2)',
    borderRadius: mysteryRadii.md,
    borderWidth: 0.7,
    gap: mysterySpacing.sm,
    maxWidth: 520,
    paddingHorizontal: mysterySpacing.lg,
    paddingVertical: mysterySpacing.md,
    width: '100%',
  },
  progressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: mysterySpacing.md,
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: 'rgba(226, 194, 117, 0.76)',
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  progressCount: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.small,
    fontWeight: '900',
  },
  partProgress: {
    color: mysteryColors.muted,
    fontSize: mysteryTypography.small,
    fontWeight: '800',
  },
  listHeader: {
    gap: mysterySpacing.md,
  },
  map: {
    gap: mysterySpacing.md,
  },
  heroBanner: {
    borderColor: 'rgba(226, 194, 117, 0.46)',
    borderRadius: mysteryRadii.xl,
    borderWidth: 1,
    justifyContent: 'flex-end',
    minHeight: 238,
    overflow: 'hidden',
    ...mysteryShadows.panel,
  },
  heroImage: {
    borderRadius: mysteryRadii.xl,
    opacity: 0.9,
  },
  itemGap: {
    height: mysterySpacing.md,
  },
  sectionGap: {
    height: mysterySpacing.md,
  },
  chapterGroupHeader: {
    backgroundColor: 'rgba(5, 13, 17, 0.58)',
    borderColor: 'rgba(226, 194, 117, 0.22)',
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    paddingHorizontal: mysterySpacing.md,
    paddingVertical: mysterySpacing.sm,
  },
  chapterGroupTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chapterKicker: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  chapterProgress: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.small,
    fontWeight: '900',
  },
  chapterTitle: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.h3,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
});
