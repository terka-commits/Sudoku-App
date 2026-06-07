import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mysteryAssets } from '../assets/mysteryAssets';
import { ChapterProgressSegments } from '../components/ChapterProgressSegments';
import { MainBottomNav, MAIN_BOTTOM_NAV_HEIGHT } from '../components/MainBottomNav';
import { GoldButton, SecondaryButton } from '../components/MysteryButtons';
import { canUseDevTools } from '../config/build';
import { useGameProgress } from '../hooks/useGameProgress';
import { useI18n } from '../i18n';
import { RootStackParamList } from '../navigation/types';
import { mysteryColors, mysteryRadii, mysterySpacing, mysteryShadows, mysteryTypography } from '../theme';
import { getProgressSummary } from '../utils/progressSelectors';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { progress, isHydrated, resetGame } = useGameProgress();
  const { text } = useI18n();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const tablet = width >= 760;
  const compact = height < 760;
  const tiny = height < 690;
  const isDevMode = canUseDevTools && progress.gameMode === 'dev';
  const progressSummary = getProgressSummary(progress);

  const startNewStory = async () => {
    if (!isHydrated) {
      return;
    }

    navigation.navigate('IntroStory');
  };

  const openCurrentProgress = () => {
    if (!isHydrated) {
      return;
    }

    if (progressSummary.isComplete) {
      navigation.navigate('Final');
      return;
    }

    navigation.navigate('ChapterDetail', {
      chapterId: progressSummary.nextAvailableRoomId ?? progress.currentChapterId,
      returnTo: 'home',
    });
  };

  const openHotelMap = () => {
    navigation.navigate('HotelMap');
  };

  const openEvidence = () => {
    navigation.navigate('Evidence');
  };

  const restartCase = () => {
    Alert.alert(text.screens.splash.restartTitle, text.screens.splash.restartMessage, [
      { text: text.screens.splash.cancel, style: 'cancel' },
      {
        text: text.screens.splash.restartTitle,
        style: 'destructive',
        onPress: async () => {
          await resetGame();
          navigation.navigate('IntroStory');
        },
      },
    ]);
  };

  return (
    <ImageBackground source={mysteryAssets.homeHero} resizeMode="cover" style={styles.background}>
      <LinearGradient
        colors={['rgba(2, 6, 8, 0.2)', 'rgba(3, 10, 14, 0.46)', 'rgba(3, 8, 11, 0.88)', 'rgba(3, 8, 11, 0.98)']}
        locations={[0, 0.38, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + (compact ? mysterySpacing.sm : mysterySpacing.lg),
            paddingBottom: insets.bottom + MAIN_BOTTOM_NAV_HEIGHT + (tiny ? mysterySpacing.sm : mysterySpacing.lg),
          },
          tablet ? styles.tabletContent : styles.mobileContent,
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={tablet}
      >
        <View style={styles.topIcons}>
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Settings')} style={({ pressed }) => [styles.circleIcon, pressed && styles.pressed]}>
            <Ionicons name="settings-outline" size={compact ? 20 : 23} color={mysteryColors.goldLight} />
          </Pressable>
          {__DEV__ && canUseDevTools && (
            <Pressable accessibilityRole="button" onPress={() => navigation.navigate('DevAdmin')} style={({ pressed }) => [styles.circleIcon, pressed && styles.pressed]}>
              <Ionicons name="construct-outline" size={compact ? 20 : 23} color={mysteryColors.goldLight} />
            </Pressable>
          )}
        </View>

        <View style={[styles.hero, compact && styles.heroCompact, tiny && styles.heroTiny]}>
          <View style={styles.titleOrnament}>
            <View style={styles.ornamentLine} />
            <View style={styles.ornamentDiamond} />
            <View style={styles.ornamentLine} />
          </View>
          <Text style={[styles.title, compact && styles.titleCompact, tiny && styles.titleTiny]}>{text.appName.toUpperCase()}</Text>
          <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>{text.appSubtitle.toUpperCase()}</Text>
        </View>

        <Pressable accessibilityRole="button" onPress={openCurrentProgress} disabled={!isHydrated} style={({ pressed }) => [styles.caseCardShadow, pressed && styles.pressed]}>
          <ImageBackground source={mysteryAssets.mapBlueprint} resizeMode="cover" imageStyle={styles.caseImage} style={[styles.caseCard, compact && styles.caseCardCompact]}>
            <LinearGradient
              colors={['rgba(3, 8, 11, 0.72)', 'rgba(5, 16, 21, 0.9)', 'rgba(2, 6, 8, 0.98)']}
              locations={[0, 0.52, 1]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['rgba(201, 167, 92, 0.18)', 'rgba(201, 167, 92, 0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.caseContent, tablet && styles.caseContentTablet]}>
              <View style={styles.caseCopy}>
                <Text style={[styles.caseTitle, compact && styles.caseTitleCompact]}>{text.screens.splash.caseTitle}</Text>
                <Text style={[styles.caseDescription, tiny && styles.caseDescriptionTiny]}>
                  {progressSummary.isComplete ? text.screens.splash.completeDescription : text.screens.splash.activeDescription}
                </Text>
                <View style={styles.caseProgress}>
                  <ChapterProgressSegments completedRooms={progressSummary.completedRooms} totalRooms={progressSummary.totalRooms} />
                  <Text style={styles.caseProgressText}>{text.screens.splash.revealedClues}: {progressSummary.journalProgress}</Text>
                </View>
              </View>
              <View style={styles.chevronCircle}>
                <Ionicons name="chevron-forward" size={28} color={mysteryColors.goldLight} />
              </View>
            </View>
          </ImageBackground>
        </Pressable>

        <View style={[styles.actions, tiny && styles.actionsTiny]}>
          <GoldButton
            title={progressSummary.isComplete ? text.screens.splash.showFinale : progressSummary.completedRooms > 0 ? text.buttons.continueCase : text.buttons.start}
            icon={progressSummary.isComplete ? 'flag-outline' : 'key-outline'}
            onPress={progressSummary.completedRooms > 0 ? openCurrentProgress : startNewStory}
            disabled={!isHydrated}
          />

          <SecondaryButton title={text.screens.splash.hotelMap} icon="map-outline" onPress={openHotelMap} />

          {progressSummary.isComplete ? (
            <SecondaryButton title={text.screens.splash.restartTitle} icon="refresh-outline" onPress={restartCase} disabled={!isHydrated} />
          ) : null}

          {__DEV__ && canUseDevTools && isDevMode && (
            <Pressable accessibilityRole="button" onPress={() => navigation.navigate('DevAdmin')} hitSlop={10} style={({ pressed }) => pressed && styles.pressed}>
              <Text style={styles.devLink}>DEV ADMIN</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNavWrap}>
        <MainBottomNav
          active="home"
          bottomInset={insets.bottom}
          onHome={() => undefined}
          onCases={openHotelMap}
          onJournal={openEvidence}
          onAchievements={() => navigation.navigate('Achievements')}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  content: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: mysterySpacing.lg,
    gap: mysterySpacing.md,
  },
  contentScroll: {
    flex: 1,
  },
  mobileContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tabletContent: {
    maxWidth: 920,
    justifyContent: 'flex-start',
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: mysterySpacing.sm,
  },
  circleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(226, 194, 117, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(7, 16, 20, 0.32)',
  },
  hero: {
    alignItems: 'center',
    paddingTop: mysterySpacing.xs,
    paddingBottom: mysterySpacing.sm,
    gap: mysterySpacing.xs,
  },
  heroCompact: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  heroTiny: {
    gap: 2,
  },
  titleOrnament: {
    width: 128,
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: mysterySpacing.sm,
  },
  ornamentLine: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(226, 194, 117, 0.68)',
  },
  ornamentDiamond: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: mysteryColors.goldLight,
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'rgba(201, 167, 92, 0.18)',
  },
  title: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: 44,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 46,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  titleCompact: {
    fontSize: 36,
    lineHeight: 39,
  },
  titleTiny: {
    fontSize: 30,
    lineHeight: 33,
  },
  subtitle: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.small,
    fontWeight: '800',
    letterSpacing: 1.6,
    textAlign: 'center',
  },
  subtitleCompact: {
    fontSize: mysteryTypography.tiny,
  },
  caseCardShadow: {
    borderRadius: mysteryRadii.lg,
    ...mysteryShadows.glow,
  },
  caseCard: {
    minHeight: 182,
    borderRadius: mysteryRadii.lg,
    borderWidth: 1,
    borderColor: 'rgba(226, 194, 117, 0.46)',
    overflow: 'hidden',
  },
  caseCardCompact: {
    minHeight: 162,
  },
  caseImage: {
    borderRadius: mysteryRadii.lg,
    opacity: 0.74,
  },
  caseContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: mysterySpacing.lg,
    paddingHorizontal: mysterySpacing.xl,
    paddingVertical: mysterySpacing.lg,
  },
  caseContentTablet: {
    justifyContent: 'space-between',
  },
  caseCopy: {
    flex: 1,
    minWidth: 0,
    maxWidth: 430,
  },
  caseTitle: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: 30,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  caseTitleCompact: {
    fontSize: 24,
  },
  caseDescription: {
    color: '#E6D8BA',
    fontSize: mysteryTypography.body,
    lineHeight: 22,
    marginTop: mysterySpacing.xs,
  },
  caseDescriptionTiny: {
    fontSize: mysteryTypography.small,
    lineHeight: 19,
  },
  caseProgress: {
    marginTop: mysterySpacing.md,
    paddingBottom: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: mysterySpacing.sm,
    flexWrap: 'wrap',
  },
  caseProgressText: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.small,
    fontWeight: '900',
  },
  chevronCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.4,
    borderColor: mysteryColors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201, 167, 92, 0.18)',
    marginLeft: mysterySpacing.lg,
  },
  actions: {
    gap: mysterySpacing.sm,
  },
  actionsTiny: {
    gap: 6,
  },
  devLink: {
    color: 'rgba(226, 194, 117, 0.58)',
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.4,
    textAlign: 'center',
    paddingVertical: 2,
  },
  bottomNavWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },
});
