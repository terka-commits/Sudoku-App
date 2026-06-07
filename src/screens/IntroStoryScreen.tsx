import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ImageBackground, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mysteryAssets } from '../assets/mysteryAssets';
import { MainBottomNav } from '../components/MainBottomNav';
import { GoldButton } from '../components/MysteryButtons';
import { MysteryScreen } from '../components/MysteryScreen';
import { useGameProgress } from '../hooks/useGameProgress';
import { useI18n } from '../i18n';
import { RootStackParamList } from '../navigation/types';
import { mysteryColors, mysteryRadii, mysteryShadows, mysterySpacing, mysteryTypography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'IntroStory'>;

export function IntroStoryScreen({ navigation }: Props) {
  const { markIntroSeen } = useGameProgress();
  const { text } = useI18n();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const tablet = width >= 760;
  const compact = height < 760;
  const tiny = height < 700;
  const parchmentParagraphs = text.intro.body.split('\n\n');

  const enterHotel = async () => {
    await markIntroSeen();
    navigation.replace('ChapterDetail', { chapterId: 'room-01', returnTo: 'home' });
  };

  return (
    <MysteryScreen
      scroll={tablet}
      backgroundSource={mysteryAssets.mapBackgroundWood}
      contentStyle={[styles.content, compact && styles.contentCompact, tablet && styles.tabletContent]}
      fixedFooter={
        <MainBottomNav
          active="home"
          bottomInset={insets.bottom}
          onAchievements={() => navigation.navigate('Achievements')}
          onCases={() => navigation.navigate('HotelMap')}
          onHome={() => navigation.navigate('Splash')}
          onJournal={() => navigation.navigate('Evidence')}
        />
      }
    >
      <View style={[styles.topBar, tablet && styles.topBarTablet]}>
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Splash')} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Ionicons name="chevron-back" size={24} color={mysteryColors.goldLight} />
        </Pressable>
        <View style={styles.topOrnament} pointerEvents="none">
          <View style={styles.ornamentLine} />
          <View style={styles.ornamentDiamond} />
          <View style={styles.ornamentLine} />
        </View>
        <View style={styles.topSpacer} />
      </View>

      <View style={[styles.storyBlock, compact && styles.storyBlockCompact]}>
        <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>{text.intro.title}</Text>

        <View style={styles.letterWrap}>
          <ImageBackground
            source={mysteryAssets.textures.parchment}
            resizeMode="stretch"
            style={[styles.parchment, compact && styles.parchmentCompact, tiny && styles.parchmentTiny]}
            imageStyle={styles.parchmentImage}
          >
            <View style={styles.paperBorder}>
              <View style={styles.paperOrnament}>
                <View style={styles.paperLine} />
                <View style={styles.paperDiamond} />
                <View style={styles.paperLine} />
              </View>
              <View style={styles.storyCopy}>
                {parchmentParagraphs.map((paragraph, index) => (
                  <Text
                    key={paragraph}
                    style={[
                      styles.storyText,
                      tiny && styles.storyTextTiny,
                      index < parchmentParagraphs.length - 1 && styles.storyParagraph,
                      tiny && index < parchmentParagraphs.length - 1 && styles.storyParagraphTiny,
                    ]}
                  >
                    {paragraph}
                  </Text>
                ))}
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={[styles.actions, tiny && styles.actionsTiny]}>
          <GoldButton title={text.buttons.enterHotel} icon="key-outline" onPress={enterHotel} />
        </View>
      </View>
    </MysteryScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 620,
    paddingBottom: mysterySpacing.md,
    paddingHorizontal: mysterySpacing.lg,
    paddingTop: 0,
  },
  contentCompact: {
    paddingBottom: mysterySpacing.sm,
    paddingTop: 0,
  },
  tabletContent: {
    justifyContent: 'flex-start',
    maxWidth: 880,
    paddingBottom: mysterySpacing.xl,
    paddingTop: mysterySpacing.sm,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: mysterySpacing.lg,
    position: 'absolute',
    right: mysterySpacing.lg,
    top: mysterySpacing.sm,
    zIndex: 2,
  },
  topBarTablet: {
    left: undefined,
    position: 'relative',
    right: undefined,
    top: undefined,
    width: '100%',
  },
  storyBlock: {
    gap: mysterySpacing.md,
    width: '100%',
  },
  storyBlockCompact: {
    gap: mysterySpacing.sm,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(7, 16, 20, 0.48)',
    borderColor: 'rgba(226, 194, 117, 0.5)',
    borderRadius: 23,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  topSpacer: {
    height: 46,
    width: 46,
  },
  topOrnament: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: mysterySpacing.lg,
    maxWidth: 220,
  },
  ornamentLine: {
    backgroundColor: 'rgba(226, 194, 117, 0.42)',
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
  subtitle: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 25,
    marginBottom: mysterySpacing.xs,
    paddingHorizontal: mysterySpacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.62)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitleCompact: {
    fontSize: 17,
    lineHeight: 22,
  },
  letterWrap: {
    alignSelf: 'center',
    flex: 0,
    justifyContent: 'flex-start',
    maxWidth: 540,
    minHeight: 0,
    width: '100%',
  },
  parchment: {
    borderColor: 'rgba(226, 194, 117, 0.42)',
    borderRadius: mysteryRadii.xl,
    borderWidth: 1,
    maxHeight: 506,
    minHeight: 430,
    overflow: 'hidden',
    padding: mysterySpacing.md,
    ...mysteryShadows.panel,
  },
  parchmentCompact: {
    maxHeight: 444,
    minHeight: 382,
    padding: mysterySpacing.sm,
  },
  parchmentTiny: {
    maxHeight: 370,
    minHeight: 330,
  },
  parchmentImage: {
    borderRadius: mysteryRadii.xl,
  },
  paperBorder: {
    borderColor: 'rgba(103, 72, 37, 0.38)',
    borderRadius: mysteryRadii.lg,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: mysterySpacing.lg,
    paddingVertical: mysterySpacing.lg,
  },
  paperOrnament: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: mysterySpacing.sm,
    marginBottom: mysterySpacing.lg,
    width: '48%',
  },
  paperLine: {
    backgroundColor: 'rgba(103, 72, 37, 0.46)',
    flex: 1,
    height: 1,
  },
  paperDiamond: {
    backgroundColor: 'rgba(103, 72, 37, 0.14)',
    borderColor: 'rgba(103, 72, 37, 0.56)',
    borderWidth: 1,
    height: 12,
    transform: [{ rotate: '45deg' }],
    width: 12,
  },
  storyText: {
    color: mysteryColors.paperInk,
    fontFamily: mysteryTypography.serif,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
  },
  storyTextTiny: {
    fontSize: 12,
    lineHeight: 17,
  },
  storyCopy: {
    alignSelf: 'center',
    maxWidth: 430,
  },
  storyParagraph: {
    marginBottom: mysterySpacing.md,
  },
  storyParagraphTiny: {
    marginBottom: mysterySpacing.sm,
  },
  actions: {
    gap: mysterySpacing.sm,
    marginTop: mysterySpacing.md,
  },
  actionsTiny: {
    gap: 6,
    marginTop: mysterySpacing.md,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.986 }],
  },
});
