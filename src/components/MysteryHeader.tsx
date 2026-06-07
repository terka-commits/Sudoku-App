import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { mysteryColors, mysterySpacing, mysteryTypography } from '../theme';

type MysteryHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export function MysteryHeader({ eyebrow, title, subtitle, onBack, rightIcon, onRightPress }: MysteryHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.roundButton}>
            <Ionicons name="chevron-back" size={24} color={mysteryColors.goldLight} />
          </Pressable>
        ) : (
          <View style={styles.roundButtonGhost} />
        )}
        <View style={styles.mark}>
          <View style={styles.rule} />
          <View style={styles.diamond} />
          <View style={styles.rule} />
        </View>
        {rightIcon ? (
          <Pressable accessibilityRole="button" onPress={onRightPress} style={styles.roundButton}>
            <Ionicons name={rightIcon} size={21} color={mysteryColors.goldLight} />
          </Pressable>
        ) : (
          <View style={styles.roundButtonGhost} />
        )}
      </View>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: mysterySpacing.xs,
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'rgba(226, 194, 117, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(7, 16, 20, 0.48)',
  },
  roundButtonGhost: {
    width: 46,
  },
  mark: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: mysterySpacing.sm,
    justifyContent: 'center',
    maxWidth: 190,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(226, 194, 117, 0.48)',
  },
  diamond: {
    width: 9,
    height: 9,
    borderWidth: 1,
    borderColor: mysteryColors.goldLight,
    backgroundColor: 'rgba(201, 167, 92, 0.16)',
    transform: [{ rotate: '45deg' }],
  },
  eyebrow: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.small,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginTop: mysterySpacing.xs,
  },
  title: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.title,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: mysteryColors.muted,
    fontSize: mysteryTypography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
});
