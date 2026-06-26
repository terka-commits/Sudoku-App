import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoldButton } from '../components/MysteryButtons';
import { MysteryHeader } from '../components/MysteryHeader';
import { MysteryScreen } from '../components/MysteryScreen';
import { OrnateCard } from '../components/OrnateCard';
import { useGameProgress } from '../hooks/useGameProgress';
import { useI18n } from '../i18n';
import { RootStackParamList } from '../navigation/types';
import { mysteryColors, mysterySpacing, mysteryTypography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Intro'>;

export function IntroScreen({ navigation }: Props) {
  const { markIntroSeen } = useGameProgress();
  const { text } = useI18n();
  const insets = useSafeAreaInsets();

  const continueToMap = async () => {
    await markIntroSeen();
    navigation.replace('HotelMap');
  };

  return (
    <MysteryScreen contentStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, mysterySpacing.sm) + mysterySpacing.md }]}>
      <MysteryHeader title={text.screens.intro.letterTitle} subtitle={text.screens.intro.letterSubtitle} />
      <OrnateCard paper quiet contentStyle={styles.note}>
        <Text style={styles.body}>{text.intro.body}</Text>
      </OrnateCard>
      <GoldButton title={text.buttons.continue} icon="mail-open-outline" onPress={continueToMap} />
    </MysteryScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  body: {
    color: mysteryColors.paperInk,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.body,
    fontWeight: '700',
    lineHeight: 28,
    textAlign: 'center',
  },
  note: {
    paddingHorizontal: 28,
    paddingVertical: 34,
  },
});
