import { StyleSheet, Text, View } from 'react-native';
import { mysteryColors, mysterySpacing, mysteryTypography } from '../theme';

type ProgressDotsProps = {
  total: number;
  completed: number;
  label: string;
};

export function ProgressDots({ total, completed, label }: ProgressDotsProps) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {Array.from({ length: total }, (_, index) => (
          <View key={index} style={[styles.dot, index < completed && styles.dotActive]} />
        ))}
        <Text style={styles.count}>{completed}/{total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: mysterySpacing.sm,
  },
  label: {
    color: mysteryColors.muted,
    fontSize: mysteryTypography.small,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: mysterySpacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(184, 170, 144, 0.26)',
    borderWidth: 1,
    borderColor: 'rgba(201, 167, 92, 0.2)',
  },
  dotActive: {
    backgroundColor: mysteryColors.goldLight,
    borderColor: mysteryColors.gold,
  },
  count: {
    color: mysteryColors.goldLight,
    fontWeight: '900',
    marginLeft: mysterySpacing.xs,
  },
});
