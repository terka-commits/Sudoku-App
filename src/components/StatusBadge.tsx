import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { mysteryColors, mysteryRadii, mysterySpacing, mysteryTypography } from '../theme';

type StatusBadgeProps = {
  label: string;
  tone?: 'active' | 'locked' | 'done';
  icon?: keyof typeof Ionicons.glyphMap;
  compact?: boolean;
};

export function StatusBadge({ label, tone = 'active', icon, compact }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, compact && styles.compactBadge, styles[tone]]}>
      {icon ? <Ionicons name={icon} size={compact ? 12 : 16} color={tone === 'locked' ? mysteryColors.muted : mysteryColors.goldLight} /> : null}
      <Text style={[styles.text, compact && styles.compactText, tone === 'locked' && styles.lockedText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: mysteryRadii.round,
    borderWidth: 1,
    paddingHorizontal: mysterySpacing.md,
    paddingVertical: mysterySpacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: mysterySpacing.xs,
  },
  compactBadge: {
    paddingHorizontal: mysterySpacing.sm,
    paddingVertical: 3,
    gap: 3,
  },
  active: {
    borderColor: mysteryColors.gold,
    backgroundColor: 'rgba(201, 167, 92, 0.13)',
  },
  locked: {
    borderColor: 'rgba(184, 170, 144, 0.28)',
    backgroundColor: 'rgba(184, 170, 144, 0.08)',
  },
  done: {
    borderColor: mysteryColors.success,
    backgroundColor: 'rgba(46, 107, 97, 0.22)',
  },
  text: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.small,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  compactText: {
    fontSize: 9,
    letterSpacing: 0.7,
  },
  lockedText: {
    color: mysteryColors.muted,
  },
});
