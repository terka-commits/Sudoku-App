import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { mysteryAssets } from '../assets/mysteryAssets';
import { GoldButton, SecondaryButton } from '../components/MysteryButtons';
import { MysteryScreen } from '../components/MysteryScreen';
import { getGameChapterById, getNextRoom, rooms } from '../data/chapters';
import { getLocalizedGameChapter, useI18n } from '../i18n';
import { RootStackParamList } from '../navigation/types';
import { mysteryColors, mysteryRadii, mysterySpacing, mysteryTypography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ChapterReveal'>;

export function ChapterRevealScreen({ route, navigation }: Props) {
  const baseChapter = getGameChapterById(route.params.chapterId);
  const { text } = useI18n();
  const chapter = getLocalizedGameChapter(baseChapter, text);
  const { height } = useWindowDimensions();
  const compact = height < 780;
  const tiny = height < 700;
  const lastRoom = rooms.find((room) => room.chapterId === chapter.id && room.order % 5 === 0);
  const nextRoom = lastRoom ? getNextRoom(lastRoom.id) : undefined;
  const nextChapter = nextRoom ? getGameChapterById(nextRoom.chapterId) : undefined;
  const canContinueToNextRoom = !!nextRoom && !!nextChapter?.implemented;
  const revealImage = chapter.revealImage ? mysteryAssets.chapterReveals[chapter.revealImage as keyof typeof mysteryAssets.chapterReveals] : undefined;
  const revealText = chapter.revealText.replace(/\s*\n+\s*/g, ' ');

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  const continueFlow = () => {
    if (canContinueToNextRoom && nextRoom) {
      navigation.replace('ChapterDetail', { chapterId: nextRoom.id, returnTo: route.params.returnTo ?? 'map' });
      return;
    }
    if (nextRoom && !nextChapter?.implemented) {
      navigation.replace('HotelMap');
      return;
    }
    navigation.replace('Final');
  };

  return (
    <MysteryScreen scroll={false} backgroundSource={mysteryAssets.mapBackgroundWood} contentStyle={[styles.screen, compact && styles.screenCompact, tiny && styles.screenTiny]}>
      <View style={[styles.header, tiny && styles.headerTiny]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{chapter.title}</Text>
        </View>
        <Text style={[styles.title, compact && styles.titleCompact, tiny && styles.titleTiny]}>{text.screens.chapterReveal.title}</Text>
        <Text style={[styles.subtitle, tiny && styles.subtitleTiny]}>{chapter.subtitle}</Text>
      </View>

      {revealImage ? (
        <View style={[styles.revealImageFrame, compact && styles.revealImageFrameCompact, tiny && styles.revealImageFrameTiny]}>
          <Image source={revealImage} resizeMode="contain" style={styles.revealImage} />
        </View>
      ) : null}

      <View style={[styles.parchment, compact && styles.parchmentCompact, tiny && styles.parchmentTiny]}>
        <View style={styles.paperBorder}>
          <View style={styles.paperOrnament}>
            <View style={styles.paperLine} />
            <View style={styles.paperDiamond} />
            <View style={styles.paperLine} />
          </View>
          <Text numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.86} style={[styles.revealTitle, tiny && styles.revealTitleTiny]}>{chapter.revealTitle}</Text>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={styles.revealTextBlock} contentContainerStyle={styles.revealTextContent}>
            <Text style={[styles.revealText, tiny && styles.revealTextTiny]}>{revealText}</Text>
            {nextRoom && !nextChapter?.implemented ? <Text style={styles.lockedNext}>{text.screens.chapterReveal.lockedNext}</Text> : null}
          </ScrollView>
        </View>
      </View>

      <View style={[styles.actions, tiny && styles.actionsTiny]}>
        <GoldButton title={chapter.revealCta ?? text.buttons.continueCase} onPress={continueFlow} />
        <SecondaryButton title={text.buttons.backToMap} icon="map-outline" onPress={() => navigation.navigate('HotelMap')} />
      </View>
    </MysteryScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: mysterySpacing.md,
    justifyContent: 'space-between',
    paddingHorizontal: mysterySpacing.lg,
    paddingBottom: mysterySpacing.md,
    paddingTop: mysterySpacing.md,
  },
  screenCompact: {
    gap: mysterySpacing.sm,
    paddingBottom: mysterySpacing.sm,
    paddingTop: mysterySpacing.sm,
  },
  screenTiny: {
    gap: 6,
    paddingBottom: mysterySpacing.xs,
    paddingTop: mysterySpacing.xs,
  },
  header: {
    alignItems: 'center',
    gap: mysterySpacing.xs,
    paddingTop: mysterySpacing.sm,
  },
  headerTiny: {
    paddingTop: mysterySpacing.xs,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(226, 194, 117, 0.92)',
    borderRadius: mysteryRadii.round,
    paddingHorizontal: mysterySpacing.md,
    paddingVertical: 6,
  },
  badgeText: {
    color: mysteryColors.paperInk,
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  title: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.title,
    fontWeight: '900',
    lineHeight: 44,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 36,
    lineHeight: 38,
  },
  titleTiny: {
    fontSize: 29,
    lineHeight: 31,
  },
  subtitle: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.h3,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitleTiny: {
    fontSize: mysteryTypography.body,
    lineHeight: 22,
  },
  parchment: {
    alignSelf: 'stretch',
    backgroundColor: '#D9BE82',
    borderRadius: mysteryRadii.lg,
    borderColor: 'rgba(226, 194, 117, 0.42)',
    borderWidth: 1,
    flex: 1,
    maxHeight: 330,
    minHeight: 250,
    overflow: 'hidden',
    padding: mysterySpacing.md,
  },
  parchmentCompact: {
    maxHeight: 292,
    minHeight: 224,
    padding: mysterySpacing.sm,
  },
  parchmentTiny: {
    maxHeight: 238,
    minHeight: 194,
    padding: mysterySpacing.xs,
  },
  revealImageFrame: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(2, 6, 8, 0.42)',
    borderColor: 'rgba(226, 194, 117, 0.42)',
    borderRadius: mysteryRadii.lg,
    borderWidth: 1,
    height: 196,
    overflow: 'hidden',
    padding: 4,
  },
  revealImageFrameCompact: {
    height: 166,
  },
  revealImageFrameTiny: {
    height: 126,
    padding: 3,
  },
  revealImage: {
    borderRadius: mysteryRadii.md,
    height: '100%',
    width: '100%',
  },
  paperBorder: {
    borderColor: 'rgba(103, 72, 37, 0.38)',
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: mysterySpacing.md,
    paddingTop: mysterySpacing.lg,
    paddingBottom: mysterySpacing.md,
  },
  paperOrnament: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: mysterySpacing.sm,
    marginBottom: mysterySpacing.sm,
    width: '46%',
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
    height: 10,
    transform: [{ rotate: '45deg' }],
    width: 10,
  },
  revealTitle: {
    color: mysteryColors.paperInk,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.h2,
    fontWeight: '900',
    lineHeight: 27,
    marginBottom: mysterySpacing.sm,
    textAlign: 'center',
  },
  revealTitleTiny: {
    fontSize: 18,
    lineHeight: 22,
    marginBottom: mysterySpacing.xs,
  },
  revealTextBlock: {
    alignSelf: 'center',
    flex: 1,
    maxWidth: 460,
    width: '100%',
  },
  revealTextContent: {
    paddingBottom: 2,
  },
  revealText: {
    color: mysteryColors.paperInk,
    fontFamily: mysteryTypography.serif,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    textAlign: 'center',
  },
  revealTextTiny: {
    fontSize: 12,
    lineHeight: 17,
  },
  lockedNext: {
    color: mysteryColors.paperInk,
    fontSize: mysteryTypography.small,
    fontWeight: '900',
    marginTop: mysterySpacing.md,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  actions: {
    gap: mysterySpacing.sm,
  },
  actionsTiny: {
    gap: 6,
  },
});
