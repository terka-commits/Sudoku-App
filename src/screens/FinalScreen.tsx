import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { mysteryAssets } from '../assets/mysteryAssets';
import { GoldButton, SecondaryButton } from '../components/MysteryButtons';
import { MysteryScreen } from '../components/MysteryScreen';
import { useI18n } from '../i18n';
import { RootStackParamList } from '../navigation/types';
import { mysteryColors, mysteryRadii, mysterySpacing, mysteryTypography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Final'>;

export function FinalScreen({ navigation }: Props) {
  const { text } = useI18n();
  const { height, width } = useWindowDimensions();
  const compact = height < 760;
  const tiny = height < 690;
  const parchmentWidth = Math.min(width - mysterySpacing.xl * 2, 390);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  return (
    <MysteryScreen
      scroll={false}
      backgroundSource={mysteryAssets.mapBackgroundWood}
      contentStyle={StyleSheet.flatten([styles.screen, compact && styles.screenCompact, tiny && styles.screenTiny])}
    >
      <View style={styles.header}>
        <View style={styles.statusWrap}>
          <View style={styles.statusLine} />
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={15} color={mysteryColors.paperInk} />
            <Text style={styles.statusText}>{text.final.title}</Text>
          </View>
          <View style={styles.statusLine} />
        </View>
        <Text style={[styles.title, compact && styles.titleCompact]}>{text.final.title}</Text>
        <Text style={styles.subtitle}>{text.final.subtitle}</Text>
      </View>

      <View style={[styles.parchment, { width: parchmentWidth }, compact && styles.parchmentCompact, tiny && styles.parchmentTiny]}>
        <View style={[styles.epilogueInset, compact && styles.epilogueInsetCompact, tiny && styles.epilogueInsetTiny]}>
          <Text style={[styles.epilogue, compact && styles.epilogueCompact, tiny && styles.epilogueTiny]}>{text.final.body}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <GoldButton title={text.buttons.handOverClues} icon="key-outline" onPress={() => navigation.navigate('HotelMap')} />
        <SecondaryButton title={text.buttons.backToMap} icon="map-outline" onPress={() => navigation.navigate('HotelMap')} />
      </View>
    </MysteryScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 6,
    justifyContent: 'space-between',
    paddingBottom: mysterySpacing.sm,
    paddingHorizontal: mysterySpacing.md,
    paddingTop: mysterySpacing.sm,
  },
  screenCompact: {
    gap: 4,
    paddingBottom: mysterySpacing.sm,
  },
  screenTiny: {
    gap: 6,
  },
  header: {
    alignItems: 'center',
    gap: 0,
  },
  statusWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    maxWidth: 360,
    width: '88%',
  },
  statusLine: {
    backgroundColor: 'rgba(226, 194, 117, 0.38)',
    flex: 1,
    height: 1,
    marginHorizontal: mysterySpacing.sm,
  },
  statusBadge: {
    alignItems: 'center',
    backgroundColor: mysteryColors.goldLight,
    borderColor: 'rgba(255, 239, 181, 0.72)',
    borderRadius: mysteryRadii.round,
    borderWidth: 1,
    flexDirection: 'row',
    gap: mysterySpacing.xs,
    paddingHorizontal: mysterySpacing.md,
    paddingVertical: 5,
  },
  statusText: {
    color: mysteryColors.paperInk,
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  title: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 38,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.68)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  titleCompact: {
    fontSize: 30,
    lineHeight: 34,
  },
  subtitle: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.body,
    fontWeight: '800',
    lineHeight: 20,
    textAlign: 'center',
  },
  parchment: {
    alignSelf: 'center',
    backgroundColor: '#D9BE82',
    borderColor: 'rgba(226, 194, 117, 0.38)',
    borderRadius: mysteryRadii.lg,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: mysterySpacing.xs,
    maxHeight: 610,
    minHeight: 500,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  parchmentCompact: {
    maxHeight: 560,
    minHeight: 452,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  parchmentTiny: {
    maxHeight: 500,
    minHeight: 402,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  epilogueInset: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 34,
    paddingHorizontal: 12,
    paddingTop: 52,
  },
  epilogueInsetCompact: {
    paddingBottom: 30,
    paddingHorizontal: 10,
    paddingTop: 46,
  },
  epilogueInsetTiny: {
    paddingBottom: 26,
    paddingHorizontal: 8,
    paddingTop: 40,
  },
  epilogue: {
    color: mysteryColors.paperInk,
    fontFamily: mysteryTypography.serif,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'center',
  },
  epilogueCompact: {
    fontSize: 12,
    lineHeight: 17,
  },
  epilogueTiny: {
    fontSize: 10,
    lineHeight: 14,
  },
  actions: {
    gap: mysterySpacing.sm,
    marginTop: mysterySpacing.xs,
  },
});
