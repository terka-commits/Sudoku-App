import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant: 'primary' | 'secondary' | 'ghost';
  disabled: boolean;
  icon: ReactNode;
  style: ViewStyle;
};

export function AppButton({ title, onPress, variant = 'primary', disabled, icon, style }: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.text, variant === 'secondary' && styles.secondaryText, variant === 'ghost' && styles.ghostText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.86,
  },
  text: {
    color: colors.textDark,
    fontSize: typography.body,
    fontWeight: '700',
  },
  secondaryText: {
    color: colors.textPrimary,
  },
  ghostText: {
    color: colors.textMuted,
  },
});
