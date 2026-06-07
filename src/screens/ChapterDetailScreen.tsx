import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, ImageBackground, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { getRewardAsset, mysteryAssets } from '../assets/mysteryAssets';
import { GoldButton } from '../components/MysteryButtons';
import { MysteryScreen } from '../components/MysteryScreen';
import { StatusBadge } from '../components/StatusBadge';
import { getChapterById } from '../data/chapters';
import { useGameProgress } from '../hooks/useGameProgress';
import { getLocalizedRoom, useI18n } from '../i18n';
import { RootStackParamList } from '../navigation/types';
import { mysteryColors, mysteryRadii, mysteryShadows, mysterySpacing, mysteryTypography } from '../theme';
import type { Difficulty } from '../types/sudoku';
import { DEFAULT_DIFFICULTY, DIFFICULTIES } from '../utils/difficulty';
import { getRoomStatus } from '../utils/progressSelectors';

type Props = NativeStackScreenProps<RootStackParamList, 'ChapterDetail'>;

export function ChapterDetailScreen({ route, navigation }: Props) {
  const baseChapter = getChapterById(route.params.chapterId);
  const { text } = useI18n();
  const chapter = getLocalizedRoom(baseChapter, text);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  const { height, width } = useWindowDimensions();
  const { progress } = useGameProgress();
  const status = getRoomStatus(progress, chapter.id);
  const completed = status === 'completed';
  const available = status === 'available' || status === 'completed';
  const rewardAsset = getRewardAsset(chapter.reward.imageKey ?? chapter.reward.id);
  const tablet = width >= 760;
  const compact = height < 820;
  const tiny = height < 720;
  const heroHeight = tiny ? 128 : compact ? 164 : 214;

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  const goBackToMap = () => {
    navigation.navigate('HotelMap');
  };

  return (
    <MysteryScreen
      scroll={tablet}
      backgroundSource={mysteryAssets.mapBackgroundWood}
      contentStyle={StyleSheet.flatten([styles.screen, compact && styles.screenCompact, tablet ? styles.tabletScreen : styles.mobileScreen])}
    >
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" onPress={goBackToMap} style={styles.roundButton}>
          <Ionicons name="chevron-back" size={24} color={mysteryColors.goldLight} />
        </Pressable>

        <View style={styles.ornament} pointerEvents="none">
          <View style={styles.ornamentLine} />
          <View style={styles.ornamentDiamond} />
          <View style={styles.ornamentLine} />
        </View>

        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Evidence')} style={styles.roundButton}>
          <Ionicons name="journal" size={22} color={mysteryColors.goldLight} />
        </Pressable>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.eyebrow}>{text.screens.sudoku.room} {chapter.order}</Text>
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} style={[styles.title, tiny && styles.titleTiny]}>
          {chapter.locationName}
        </Text>
      </View>

      <ImageBackground
        source={mysteryAssets.rooms[chapter.visualKey]}
        resizeMode="cover"
        style={[styles.hero, { height: heroHeight }]}
        imageStyle={styles.heroImage}
      >
        <LinearGradient
          colors={['rgba(7,16,20,0)', 'rgba(7,16,20,0.2)', 'rgba(7,16,20,0.88)']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <View style={[styles.parchment, compact && styles.parchmentCompact, tiny && styles.parchmentTiny]}>
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={styles.parchmentScroll}>
          <Text style={styles.body}>{chapter.detailText}</Text>
        </ScrollView>
      </View>

      <View style={[styles.statusWrap, tablet && styles.statusWrapTablet]}>
        <View style={styles.statusLine} />
        <StatusBadge
          label={completed ? text.labels.completed : available ? text.labels.available : text.labels.locked}
          tone={completed ? 'done' : available ? 'active' : 'locked'}
          icon={completed ? 'checkmark' : available ? 'checkmark-circle-outline' : 'lock-closed'}
        />
        <View style={styles.statusLine} />
      </View>

      <View style={styles.difficultySection}>
        <Text style={styles.difficultyLabel}>{text.screens.chapterDetail.difficulty}</Text>
        <View style={styles.difficultyOptions}>
          {DIFFICULTIES.map((difficulty) => {
            const selected = difficulty === selectedDifficulty;
            return (
              <Pressable
                key={difficulty}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setSelectedDifficulty(difficulty)}
                style={({ pressed }) => [styles.difficultyButton, selected && styles.difficultyButtonActive, pressed && styles.pressed]}
              >
                <Text style={[styles.difficultyText, selected && styles.difficultyTextActive]}>{text.difficulty[difficulty]}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.rewardSection, tablet && styles.rewardSectionTablet, tiny && styles.rewardSectionTiny]}>
        <View style={styles.rewardLabelRow}>
          <View style={styles.rewardLine} />
          <Text style={styles.rewardLabel}>{text.screens.chapterDetail.rewardToFind}</Text>
          <View style={styles.rewardLine} />
        </View>
        <LinearGradient
          colors={['rgba(18, 43, 46, 0.72)', 'rgba(7, 16, 20, 0.9)', 'rgba(3, 8, 10, 0.96)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.rewardCard, compact && styles.rewardCardCompact, tiny && styles.rewardCardTiny]}
        >
          <View style={styles.rewardImageFrameShadow}>
            <LinearGradient
              colors={['rgba(4, 9, 12, 0.98)', 'rgba(15, 32, 35, 0.96)', 'rgba(3, 7, 9, 0.98)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.rewardImageFrame, compact && styles.rewardImageFrameCompact, tiny && styles.rewardImageFrameTiny]}
            >
              <View style={styles.rewardImageInset}>
                {rewardAsset ? <Image source={rewardAsset} resizeMode="contain" style={[styles.rewardImage, compact && styles.rewardImageCompact, tiny && styles.rewardImageTiny]} /> : null}
                <View style={styles.rewardImageShelf} />
              </View>
            </LinearGradient>
          </View>
          <View style={styles.rewardDivider} />
          <View style={styles.rewardTextBlock}>
            <Text numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.86} style={styles.rewardTitle}>
              {chapter.reward.title}
            </Text>
          </View>
        </LinearGradient>
      </View>

      <View style={[styles.actions, tiny && styles.actionsTiny]}>
        <GoldButton
          title={text.buttons.solveClue}
          onPress={() => navigation.navigate('Sudoku', { chapterId: chapter.id, difficulty: selectedDifficulty, returnTo: route.params.returnTo ?? 'map' })}
          disabled={!available}
          icon="key"
        />
      </View>
    </MysteryScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 6,
    paddingHorizontal: mysterySpacing.lg,
    paddingTop: mysterySpacing.sm,
    paddingBottom: mysterySpacing.sm,
  },
  mobileScreen: {
    flex: 1,
    justifyContent: 'space-between',
  },
  screenCompact: {
    gap: 3,
    paddingTop: mysterySpacing.sm,
    paddingBottom: mysterySpacing.xs,
  },
  tabletScreen: {
    maxWidth: 880,
    justifyContent: 'flex-start',
    paddingBottom: mysterySpacing.xl,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  ornament: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: mysterySpacing.lg,
    maxWidth: 190,
  },
  ornamentLine: {
    backgroundColor: 'rgba(226, 194, 117, 0.46)',
    height: 1,
    maxWidth: 72,
    flex: 1,
  },
  ornamentDiamond: {
    borderColor: mysteryColors.goldLight,
    borderWidth: 1,
    height: 9,
    marginHorizontal: mysterySpacing.sm,
    transform: [{ rotate: '45deg' }],
    width: 9,
  },
  titleBlock: {
    alignItems: 'center',
    gap: 0,
  },
  eyebrow: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  title: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: 31,
    fontWeight: '900',
    lineHeight: 36,
    textAlign: 'center',
  },
  titleTiny: {
    fontSize: 25,
    lineHeight: 29,
  },
  hero: {
    borderColor: 'rgba(226, 194, 117, 0.44)',
    borderRadius: mysteryRadii.xl,
    borderWidth: 0.8,
    justifyContent: 'flex-end',
    marginHorizontal: -mysterySpacing.xs,
    overflow: 'hidden',
    ...mysteryShadows.panel,
  },
  heroImage: {
    borderRadius: mysteryRadii.xl,
  },
  parchment: {
    backgroundColor: '#D9BE82',
    borderColor: 'rgba(226, 194, 117, 0.38)',
    borderWidth: 1,
    borderRadius: mysteryRadii.lg,
    marginHorizontal: mysterySpacing.xs,
    height: 132,
    overflow: 'hidden',
    paddingHorizontal: 30,
    paddingVertical: mysterySpacing.md,
  },
  parchmentCompact: {
    height: 118,
    paddingHorizontal: 24,
    paddingVertical: mysterySpacing.sm,
  },
  parchmentTiny: {
    height: 104,
    paddingHorizontal: 20,
    paddingVertical: mysterySpacing.sm,
  },
  body: {
    color: mysteryColors.paperInk,
    fontFamily: mysteryTypography.serif,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
  },
  parchmentScroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  statusWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: mysterySpacing.xl,
    marginTop: -mysterySpacing.xs,
  },
  statusWrapTablet: {
    marginTop: mysterySpacing.xs,
  },
  statusLine: {
    backgroundColor: 'rgba(226, 194, 117, 0.32)',
    flex: 1,
    height: 1,
    marginHorizontal: mysterySpacing.sm,
  },
  difficultySection: {
    backgroundColor: 'rgba(5, 13, 17, 0.58)',
    borderColor: 'rgba(226, 194, 117, 0.22)',
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    gap: mysterySpacing.xs,
    paddingHorizontal: mysterySpacing.md,
    paddingVertical: mysterySpacing.sm,
  },
  difficultyLabel: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  difficultyOptions: {
    flexDirection: 'row',
    gap: mysterySpacing.xs,
  },
  difficultyButton: {
    alignItems: 'center',
    borderColor: 'rgba(226, 194, 117, 0.24)',
    borderRadius: mysteryRadii.sm,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: mysterySpacing.xs,
  },
  difficultyButtonActive: {
    backgroundColor: mysteryColors.gold,
    borderColor: mysteryColors.goldLight,
  },
  difficultyText: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.small,
    fontWeight: '900',
    textAlign: 'center',
  },
  difficultyTextActive: {
    color: mysteryColors.paperInk,
  },
  rewardSection: {
    alignItems: 'center',
    gap: 5,
  },
  rewardSectionTablet: {
    gap: mysterySpacing.sm,
    marginBottom: mysterySpacing.sm,
  },
  rewardSectionTiny: {
    gap: 3,
  },
  rewardLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: mysterySpacing.sm,
    width: '78%',
  },
  rewardLine: {
    backgroundColor: mysteryColors.line,
    flex: 1,
    height: 1,
  },
  rewardLabel: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  rewardCard: {
    alignItems: 'center',
    borderColor: 'rgba(226, 194, 117, 0.46)',
    borderRadius: mysteryRadii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 112,
    overflow: 'hidden',
    padding: mysterySpacing.sm,
    width: '96%',
    ...mysteryShadows.panel,
  },
  rewardCardCompact: {
    minHeight: 92,
    padding: 6,
  },
  rewardCardTiny: {
    minHeight: 78,
    width: '94%',
  },
  rewardImageFrameShadow: {
    borderRadius: mysteryRadii.md,
    backgroundColor: 'rgba(2, 6, 8, 0.72)',
    padding: 3,
  },
  rewardImageFrame: {
    alignItems: 'center',
    borderColor: 'rgba(226, 194, 117, 0.38)',
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    height: 96,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 116,
  },
  rewardImageFrameCompact: {
    height: 78,
    width: 96,
  },
  rewardImageFrameTiny: {
    height: 62,
    width: 78,
  },
  rewardImageInset: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  rewardImage: {
    height: 92,
    width: 110,
    zIndex: 1,
  },
  rewardImageCompact: {
    height: 74,
    width: 90,
  },
  rewardImageTiny: {
    height: 58,
    width: 72,
  },
  rewardImageShelf: {
    position: 'absolute',
    bottom: 13,
    width: 86,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.34)',
  },
  rewardDivider: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(226, 194, 117, 0.22)',
    marginHorizontal: mysterySpacing.sm,
    width: 1,
  },
  rewardTextBlock: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    paddingRight: mysterySpacing.xs,
  },
  rewardTitle: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 21,
  },
  actions: {
    gap: 0,
  },
  actionsTiny: {
    marginTop: -2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.986 }],
  },
});
