import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { mysteryAssets } from '../assets/mysteryAssets';
import { MysteryHeader } from '../components/MysteryHeader';
import { MysteryScreen } from '../components/MysteryScreen';
import { useI18n } from '../i18n';
import { RootStackParamList } from '../navigation/types';
import { mysteryColors, mysteryRadii, mysteryShadows, mysterySpacing, mysteryTypography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { language, setLanguage, text } = useI18n();
  const { width } = useWindowDimensions();
  const tablet = width >= 760;

  return (
    <MysteryScreen backgroundSource={mysteryAssets.mapBackgroundWood} contentStyle={[styles.screen, tablet && styles.tabletScreen]}>
      <MysteryHeader onBack={() => navigation.goBack()} title={text.screens.settings.title} />

      <View style={styles.languagePanel}>
        <Text style={styles.sectionTitle}>{text.screens.settings.languageTitle}</Text>
        <View style={styles.languageGrid}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: language === 'cs' }}
            onPress={() => setLanguage('cs')}
            style={({ pressed }) => [styles.languageButton, language === 'cs' && styles.languageButtonActive, pressed && styles.pressed]}
          >
            <Text style={[styles.languageButtonText, language === 'cs' && styles.languageButtonTextActive]}>{text.screens.settings.czech}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: language === 'en' }}
            onPress={() => setLanguage('en')}
            style={({ pressed }) => [styles.languageButton, language === 'en' && styles.languageButtonActive, pressed && styles.pressed]}
          >
            <Text style={[styles.languageButtonText, language === 'en' && styles.languageButtonTextActive]}>{text.screens.settings.english}</Text>
          </Pressable>
        </View>
      </View>
    </MysteryScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    gap: mysterySpacing.xl,
    justifyContent: 'flex-start',
    maxWidth: 620,
    paddingBottom: mysterySpacing.xl,
    paddingTop: mysterySpacing.md,
  },
  tabletScreen: {
    maxWidth: 880,
  },
  languagePanel: {
    backgroundColor: 'rgba(7, 16, 20, 0.82)',
    borderColor: 'rgba(226, 194, 117, 0.34)',
    borderRadius: mysteryRadii.lg,
    borderWidth: 1,
    paddingHorizontal: mysterySpacing.lg,
    paddingVertical: mysterySpacing.xl,
    ...mysteryShadows.panel,
  },
  sectionTitle: {
    alignSelf: 'center',
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.h2,
    fontWeight: '900',
    marginBottom: mysterySpacing.sm,
    textAlign: 'center',
  },
  languageGrid: {
    flexDirection: 'row',
    gap: mysterySpacing.sm,
    width: '100%',
  },
  languageButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(7, 16, 20, 0.64)',
    borderColor: 'rgba(226, 194, 117, 0.36)',
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 58,
    paddingHorizontal: mysterySpacing.md,
  },
  languageButtonActive: {
    backgroundColor: mysteryColors.gold,
    borderColor: mysteryColors.goldLight,
  },
  languageButtonText: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.body,
    fontWeight: '900',
    textAlign: 'center',
  },
  languageButtonTextActive: {
    color: mysteryColors.paperInk,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
