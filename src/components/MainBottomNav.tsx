import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../i18n';
import { mysteryColors, mysterySpacing, mysteryTypography } from '../theme';

export type MainNavKey = 'home' | 'cases' | 'journal' | 'achievements';

type MainBottomNavProps = {
  active: MainNavKey;
  onHome: () => void;
  onCases: () => void;
  onJournal: () => void;
  onAchievements: () => void;
  bottomInset: number;
};

const NAV_ITEMS: Array<{
  key: MainNavKey;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { key: 'home', icon: 'home' },
  { key: 'cases', icon: 'key-outline' },
  { key: 'journal', icon: 'journal-outline' },
  { key: 'achievements', icon: 'trophy-outline' },
];

export const MAIN_BOTTOM_NAV_HEIGHT = 78;

export function MainBottomNav({ active, onHome, onCases, onJournal, onAchievements, bottomInset = 0 }: MainBottomNavProps) {
  const { text } = useI18n();
  const handlers: Record<MainNavKey, (() => void) | undefined> = {
    home: onHome,
    cases: onCases,
    journal: onJournal,
    achievements: onAchievements,
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(bottomInset, mysterySpacing.sm) }]}>
      <LinearGradient colors={['rgba(2, 7, 10, 0.45)', 'rgba(2, 7, 10, 0.92)']} style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          const disabled = !handlers[item.key];

          return (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive, disabled }}
              disabled={disabled}
              onPress={handlers[item.key]}
              style={({ pressed }) => [styles.navItem, pressed && !disabled && styles.pressed, disabled && styles.disabled]}
            >
              <Ionicons name={item.icon} size={23} color={isActive ? mysteryColors.goldLight : mysteryColors.goldDeep} />
              <Text style={[styles.navText, isActive && styles.navTextActive]}>{text.navigation[item.key]}</Text>
            </Pressable>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopColor: 'rgba(226, 194, 117, 0.18)',
    borderTopWidth: 1,
    width: '100%',
  },
  nav: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    minHeight: MAIN_BOTTOM_NAV_HEIGHT,
    paddingHorizontal: mysterySpacing.sm,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    gap: mysterySpacing.xs,
    justifyContent: 'center',
  },
  navText: {
    color: mysteryColors.goldDeep,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 0.9,
  },
  navTextActive: {
    color: mysteryColors.goldLight,
    textShadowColor: 'rgba(226, 194, 117, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  disabled: {
    opacity: 0.46,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
