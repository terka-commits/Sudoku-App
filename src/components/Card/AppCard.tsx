import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

type AppCardProps = PropsWithChildren<{
  style: ViewStyle;
  paper: boolean;
}>;

export function AppCard({ children, style, paper }: AppCardProps) {
  return <View style={[styles.card, paper && styles.paper, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(176, 141, 87, 0.24)',
  },
  paper: {
    backgroundColor: colors.paper,
    borderColor: colors.paperDark,
  },
});
