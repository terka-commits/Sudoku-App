import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { mysteryColors, mysteryRadii, mysteryShadows, mysterySpacing } from '../theme';

type OrnateCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  paper?: boolean;
  glow?: boolean;
  quiet?: boolean;
}>;

export function OrnateCard({ children, style, contentStyle, paper, glow, quiet }: OrnateCardProps) {
  return (
    <LinearGradient
      colors={
        paper
          ? [mysteryColors.paper, mysteryColors.paperDeep]
          : ['rgba(20, 51, 55, 0.96)', 'rgba(7, 16, 20, 0.96)']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.outer, quiet && styles.quietOuter, glow && mysteryShadows.glow, style]}
    >
      <View style={[styles.inner, paper && styles.paperInner, quiet && styles.quietInner, contentStyle]}>
        {!quiet && <View style={[styles.corner, styles.cornerTL]} />}
        {!quiet && <View style={[styles.corner, styles.cornerBR]} />}
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: mysteryRadii.lg,
    borderWidth: 0.8,
    borderColor: 'rgba(184, 144, 69, 0.42)',
    overflow: 'hidden',
    ...mysteryShadows.panel,
  },
  quietOuter: {
    borderWidth: 0,
    elevation: 4,
  },
  inner: {
    padding: mysterySpacing.lg,
    borderWidth: 0,
    minHeight: 80,
  },
  quietInner: {
    padding: mysterySpacing.lg,
  },
  paperInner: {
    borderColor: 'rgba(43, 33, 23, 0.14)',
  },
  corner: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderColor: mysteryColors.goldLight,
    opacity: 0.42,
  },
  cornerTL: {
    top: 7,
    left: 7,
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  cornerBR: {
    bottom: 7,
    right: 7,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
});
