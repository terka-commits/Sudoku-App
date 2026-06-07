import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { mysteryColors, mysteryRadii, mysterySpacing, mysteryTypography } from '../theme';

type MysteryButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const BUTTON_ICON_SIZE = 22;

export function GoldButton({ title, onPress, disabled, icon, style }: MysteryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.buttonShadow, disabled && styles.disabled, pressed && !disabled && styles.pressed, style]}
    >
      <LinearGradient colors={[mysteryColors.goldLight, mysteryColors.gold, mysteryColors.goldDeep]} style={styles.goldFill}>
        <View style={styles.iconSlot}>
          {icon ? <Ionicons name={icon} size={BUTTON_ICON_SIZE} color={mysteryColors.paperInk} /> : null}
        </View>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.goldText}>
          {title}
        </Text>
        <View style={styles.iconSlot}>
          <Ionicons name="chevron-forward" size={BUTTON_ICON_SIZE} color={mysteryColors.paperInk} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export function SecondaryButton({ title, onPress, disabled, icon, style }: MysteryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.secondary, disabled && styles.disabled, pressed && !disabled && styles.pressed, style]}
    >
      <View style={styles.iconSlot}>
        {icon ? <Ionicons name={icon} size={BUTTON_ICON_SIZE} color={mysteryColors.gold} /> : null}
      </View>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.secondaryText}>
        {title}
      </Text>
      <View style={styles.iconSlot}>
        <Ionicons name="chevron-forward" size={BUTTON_ICON_SIZE} color={mysteryColors.gold} />
      </View>
    </Pressable>
  );
}

export function ToolButton({ title, onPress, active, disabled, icon, style }: MysteryButtonProps & { active?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tool,
        active && styles.toolActive,
        disabled && styles.disabled,
        pressed && !disabled && styles.toolPressed,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          {icon ? <Ionicons name={icon} size={19} color={active || pressed ? mysteryColors.paperInk : mysteryColors.gold} /> : null}
          <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.toolText, (active || pressed) && styles.toolTextActive]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonShadow: {
    borderRadius: mysteryRadii.md,
    elevation: 7,
  },
  goldFill: {
    minHeight: 58,
    borderRadius: mysteryRadii.md,
    borderWidth: 0,
    paddingHorizontal: mysterySpacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: mysterySpacing.sm,
  },
  iconSlot: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  goldText: {
    color: mysteryColors.paperInk,
    flex: 1,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.body,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  secondary: {
    minHeight: 58,
    borderRadius: mysteryRadii.md,
    borderWidth: 0.7,
    borderColor: 'rgba(201, 167, 92, 0.34)',
    backgroundColor: 'rgba(7, 16, 20, 0.48)',
    paddingHorizontal: mysterySpacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: mysterySpacing.sm,
  },
  secondaryText: {
    color: mysteryColors.goldLight,
    flex: 1,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.body,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  tool: {
    minHeight: 46,
    flex: 1,
    minWidth: 98,
    borderRadius: mysteryRadii.sm,
    borderWidth: 0.7,
    borderColor: 'rgba(201, 167, 92, 0.28)',
    backgroundColor: 'rgba(7, 16, 20, 0.62)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: mysterySpacing.sm,
    paddingHorizontal: mysterySpacing.sm,
  },
  toolActive: {
    backgroundColor: mysteryColors.gold,
    borderColor: mysteryColors.goldLight,
  },
  toolPressed: {
    backgroundColor: mysteryColors.gold,
    borderColor: mysteryColors.goldLight,
  },
  toolText: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.small,
    fontWeight: '800',
  },
  toolTextActive: {
    color: mysteryColors.paperInk,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.88,
  },
});
