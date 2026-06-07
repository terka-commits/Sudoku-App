import { Pressable, StyleSheet, Text, View } from 'react-native';
import { mysteryColors, mysteryRadii, mysterySpacing, mysteryTypography } from '../../theme';

type SudokuNumberPadProps = {
  onPress: (number: number) => void;
  compact: boolean;
  size: number;
};

export function SudokuNumberPad({ onPress, compact, size }: SudokuNumberPadProps) {
  const gap = compact ? 6 : 7;
  const keySize = Math.floor((size - gap * 2) / 3);

  return (
    <View style={[styles.pad, { gap, height: size, width: size }]}>
      {Array.from({ length: 9 }, (_, index) => index + 1).map((number) => (
        <Pressable
          key={number}
          onPress={() => onPress(number)}
          style={({ pressed }) => [styles.key, { height: keySize, width: keySize }, pressed && styles.pressed]}
        >
          <Text style={[styles.keyText, compact && styles.keyTextCompact]}>{number}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    alignContent: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  key: {
    alignItems: 'center',
    backgroundColor: 'rgba(7, 16, 20, 0.88)',
    borderColor: 'rgba(201, 167, 92, 0.42)',
    borderRadius: mysteryRadii.sm,
    borderWidth: 0.8,
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: mysteryColors.gold,
  },
  keyText: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 31,
  },
  keyTextCompact: {
    fontSize: 24,
    lineHeight: 28,
  },
});
