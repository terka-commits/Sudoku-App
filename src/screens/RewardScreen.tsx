import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRewardAsset, mysteryAssets } from '../assets/mysteryAssets';
import { GoldButton } from '../components/MysteryButtons';
import { MysteryScreen } from '../components/MysteryScreen';
import { getChapterById, getNextRoom, TOTAL_ROOMS } from '../data/chapters';
import { useGameProgress } from '../hooks/useGameProgress';
import { getLocalizedRoom, useI18n } from '../i18n';
import { RootStackParamList } from '../navigation/types';
import { showInterstitialAd } from '../services/ads';
import { mysteryColors, mysteryRadii, mysteryShadows, mysterySpacing, mysteryTypography } from '../theme';
import { DEFAULT_DIFFICULTY } from '../utils/difficulty';

type Props = NativeStackScreenProps<RootStackParamList, 'Reward'>;

export function RewardScreen({ route, navigation }: Props) {
  const baseChapter = getChapterById(route.params.chapterId);
  const { text } = useI18n();
  const chapter = getLocalizedRoom(baseChapter, text);
  const difficulty = route.params.difficulty ?? DEFAULT_DIFFICULTY;
  const { collectReward, completeChapter, progress } = useGameProgress();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const compact = height < 780 || width < 430;
  const tiny = height < 720 || width < 380;
  const rewardAsset = getRewardAsset(chapter.reward.imageKey ?? chapter.reward.id);
  const rewardDescription = chapter.reward.description.replace(/\s*\n+\s*/g, ' ');
  const completedBadge = text.screens.reward.completedBadge.replace('{{order}}', `${chapter.order}`);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  const continueFlow = async () => {
    if (!progress.completedChapterIds.includes(chapter.id) || progress.roomResults[chapter.id]?.lastTimes?.[difficulty] == null) {
      await completeChapter(chapter.id, route.params.elapsedSeconds * 1000, route.params.hintCount, difficulty);
    }
    await collectReward(chapter.reward.id);
    await showInterstitialAd();

    if (chapter.order % 5 === 0) {
      navigation.replace('ChapterReveal', { chapterId: chapter.chapterId, returnTo: route.params.returnTo ?? 'map' });
      return;
    }

    if (chapter.order >= TOTAL_ROOMS) {
      navigation.replace('Final');
      return;
    }

    const nextChapter = getNextRoom(chapter.id);
    if (nextChapter) {
      navigation.replace('ChapterDetail', { chapterId: nextChapter.id, returnTo: route.params.returnTo ?? 'map' });
    }
  };

  return (
    <MysteryScreen
      backgroundSource={mysteryAssets.mapBackgroundWood}
      contentStyle={StyleSheet.flatten([
        styles.screen,
        compact && styles.screenCompact,
        tiny && styles.screenTiny,
        { paddingBottom: Math.max(insets.bottom, mysterySpacing.sm) + mysterySpacing.md },
      ])}
    >
      <View style={styles.header}>
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={18} color={mysteryColors.goldLight} />
          <Text style={styles.badgeText}>{completedBadge}</Text>
        </View>
        <Text style={[styles.title, compact && styles.titleCompact, tiny && styles.titleTiny]}>{text.screens.reward.title}</Text>
        <View style={[styles.titleOrnament, tiny && styles.titleOrnamentTiny]}>
          <View style={styles.ornamentLine} />
          <Ionicons name="key-outline" size={18} color={mysteryColors.goldLight} />
          <View style={styles.ornamentLine} />
        </View>
      </View>

      <View style={[styles.rewardContent, compact && styles.rewardContentCompact, tiny && styles.rewardContentTiny]}>
        <ImageBackground
          source={mysteryAssets.mapBackgroundWood}
          resizeMode="cover"
          style={[styles.imagePanel, compact && styles.imagePanelCompact, tiny && styles.imagePanelTiny]}
          imageStyle={styles.imagePanelBackground}
        >
          <LinearGradient colors={['rgba(2, 6, 8, 0.6)', 'rgba(2, 6, 8, 0.78)', 'rgba(2, 6, 8, 0.9)']} style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['rgba(226, 194, 117, 0.14)', 'rgba(226, 194, 117, 0)', 'rgba(3, 8, 11, 0.52)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.imageFrame}>
            {rewardAsset ? <Image source={rewardAsset} resizeMode="contain" style={styles.rewardImage} /> : null}
            <View style={styles.imageShelf} />
          </View>
        </ImageBackground>

        <View style={[styles.parchmentPanel, tiny && styles.parchmentPanelTiny]}>
          <View style={styles.paperBorder}>
            <View style={styles.paperOrnament}>
              <View style={styles.paperLine} />
              <View style={styles.paperDiamond} />
              <View style={styles.paperLine} />
            </View>
            <Text numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.82} style={[styles.rewardTitle, tiny && styles.rewardTitleTiny]}>
              {chapter.reward.title}
            </Text>
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={styles.descriptionScroll}>
              <Text style={[styles.rewardDescription, tiny && styles.rewardDescriptionTiny]}>{rewardDescription}</Text>
            </ScrollView>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <GoldButton title={chapter.order >= TOTAL_ROOMS ? text.buttons.handOverClues : text.buttons.continue} onPress={continueFlow} />
      </View>
    </MysteryScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 6,
    justifyContent: 'flex-start',
    minHeight: '100%',
    paddingTop: mysterySpacing.sm,
  },
  screenCompact: {
    gap: 5,
    paddingTop: mysterySpacing.xs,
  },
  screenTiny: {
    gap: 4,
    paddingTop: 2,
  },
  header: {
    alignItems: 'center',
    gap: 2,
    marginTop: mysterySpacing.xs,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(7, 16, 20, 0.58)',
    borderWidth: 0.7,
    borderColor: 'rgba(226, 194, 117, 0.44)',
    borderRadius: mysteryRadii.round,
    flexDirection: 'row',
    gap: mysterySpacing.sm,
    paddingHorizontal: mysterySpacing.md,
    paddingVertical: 6,
  },
  badgeText: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: 42,
    lineHeight: 43,
    textAlign: 'center',
    fontWeight: '900',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(226, 194, 117, 0.24)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 13,
  },
  titleCompact: {
    fontSize: 36,
    lineHeight: 37,
  },
  titleTiny: {
    fontSize: 30,
    lineHeight: 31,
  },
  titleOrnament: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: mysterySpacing.sm,
    marginTop: -8,
    width: 210,
  },
  titleOrnamentTiny: {
    width: 170,
  },
  ornamentLine: {
    backgroundColor: 'rgba(226, 194, 117, 0.52)',
    flex: 1,
    height: 1,
  },
  rewardContent: {
    gap: 6,
    justifyContent: 'flex-start',
    marginTop: 0,
  },
  rewardContentCompact: {
    gap: 6,
  },
  rewardContentTiny: {
    gap: 6,
  },
  imagePanel: {
    alignItems: 'center',
    borderColor: 'rgba(226, 194, 117, 0.46)',
    borderRadius: mysteryRadii.lg,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 166,
    overflow: 'hidden',
    padding: mysterySpacing.sm,
    zIndex: 0,
    ...mysteryShadows.panel,
  },
  imagePanelCompact: {
    minHeight: 112,
  },
  imagePanelTiny: {
    minHeight: 88,
    padding: 6,
  },
  imagePanelBackground: {
    borderRadius: mysteryRadii.lg,
    opacity: 0.92,
  },
  imageFrame: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: 'rgba(226, 194, 117, 0.3)',
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 0,
    overflow: 'hidden',
    padding: mysterySpacing.sm,
  },
  rewardImage: {
    height: '100%',
    width: '100%',
  },
  imageShelf: {
    backgroundColor: 'rgba(0, 0, 0, 0.34)',
    borderRadius: 5,
    bottom: 16,
    height: 10,
    position: 'absolute',
    width: '58%',
  },
  parchmentPanel: {
    backgroundColor: '#D9BE82',
    borderColor: 'rgba(226, 194, 117, 0.38)',
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    maxHeight: 360,
    minHeight: 276,
    overflow: 'hidden',
    padding: mysterySpacing.sm,
    zIndex: 1,
  },
  parchmentPanelTiny: {
    maxHeight: 276,
    minHeight: 230,
    padding: mysterySpacing.xs,
  },
  paperBorder: {
    borderColor: 'rgba(103, 72, 37, 0.34)',
    borderRadius: mysteryRadii.sm,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: mysterySpacing.md,
    paddingTop: mysterySpacing.sm,
    paddingBottom: mysterySpacing.xs,
  },
  rewardTitle: {
    color: mysteryColors.paperInk,
    fontFamily: mysteryTypography.serif,
    fontSize: 21,
    lineHeight: 25,
    marginBottom: mysterySpacing.sm,
    textAlign: 'center',
    fontWeight: '900',
  },
  rewardTitleTiny: {
    fontSize: 18,
    lineHeight: 21,
  },
  paperOrnament: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: mysterySpacing.sm,
    marginTop: 2,
    marginBottom: mysterySpacing.sm,
    width: '42%',
  },
  paperLine: {
    backgroundColor: 'rgba(103, 72, 37, 0.42)',
    flex: 1,
    height: 1,
  },
  paperDiamond: {
    backgroundColor: 'rgba(103, 72, 37, 0.14)',
    borderColor: 'rgba(103, 72, 37, 0.52)',
    borderWidth: 1,
    height: 9,
    transform: [{ rotate: '45deg' }],
    width: 9,
  },
  descriptionScroll: {
    paddingBottom: 2,
  },
  rewardDescription: {
    color: mysteryColors.paperInk,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.small,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
  },
  rewardDescriptionTiny: {
    fontSize: mysteryTypography.small,
    lineHeight: 18,
    marginTop: mysterySpacing.xs,
  },
  actions: {
    gap: mysterySpacing.sm,
    marginTop: 'auto',
  },
});
