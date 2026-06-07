import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../i18n';
import { mysteryColors, mysteryRadii, mysteryShadows, mysterySpacing, mysteryTypography } from '../theme';

type EvidenceItemCardProps = {
  source: ImageSourcePropType;
  title: string;
  index?: number;
  found: boolean;
  statusText?: string;
  onPress?: () => void;
  compact?: boolean;
};

function EvidenceItemCardComponent({ source, title, index, found, statusText, onPress, compact }: EvidenceItemCardProps) {
  const { text } = useI18n();
  const status = statusText ?? (found ? text.labels.found : text.labels.missing);

  return (
    <Pressable
      accessibilityRole={found && onPress ? 'button' : undefined}
      disabled={!found || !onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, compact && styles.compact, found ? styles.found : styles.locked, pressed && styles.pressed]}
    >
      <View style={[styles.imageFrame, compact && styles.compactImageFrame, !found && styles.lockedImageFrame]}>
        {found && source ? (
          <Image source={source} resizeMode="contain" style={styles.image} />
        ) : (
          <View style={styles.lockedPanel}>
            <Ionicons name="lock-closed" size={22} color="rgba(226, 194, 117, 0.62)" />
          </View>
        )}
      </View>

      {typeof index === 'number' ? <Text style={styles.label}>{text.screens.evidence.clueLabel} {index}</Text> : null}
      {found ? (
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
      ) : (
        <View style={styles.lockedSpacer} />
      )}
      <View style={[styles.statusPill, found ? styles.foundPill : styles.lockedPill]}>
        <Text style={[styles.statusText, !found && styles.lockedStatusText]}>{status}</Text>
      </View>
    </Pressable>
  );
}

export const EvidenceItemCard = memo(EvidenceItemCardComponent);

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 226,
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    padding: mysterySpacing.sm,
    gap: mysterySpacing.xs,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  compact: {
    width: 118,
    minHeight: 154,
  },
  found: {
    backgroundColor: 'rgba(5, 13, 17, 0.78)',
    borderColor: 'rgba(226, 194, 117, 0.62)',
    ...mysteryShadows.glow,
  },
  locked: {
    backgroundColor: 'rgba(5, 13, 17, 0.5)',
    borderColor: 'rgba(201, 167, 92, 0.22)',
  },
  imageFrame: {
    width: '100%',
    height: 116,
    borderRadius: mysteryRadii.sm,
    borderWidth: 1,
    borderColor: 'rgba(226, 194, 117, 0.24)',
    backgroundColor: 'rgba(2, 6, 8, 0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: mysterySpacing.sm,
  },
  compactImageFrame: {
    height: 76,
  },
  lockedImageFrame: {
    borderColor: 'rgba(184, 170, 144, 0.12)',
    backgroundColor: 'rgba(2, 6, 8, 0.34)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  lockedPanel: {
    width: '100%',
    height: '100%',
    borderRadius: mysteryRadii.sm,
    borderWidth: 1,
    borderColor: 'rgba(226, 194, 117, 0.14)',
    backgroundColor: 'rgba(184, 170, 144, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'rgba(226, 194, 117, 0.86)',
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: mysterySpacing.xs,
  },
  title: {
    minHeight: 38,
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.small,
    fontWeight: '900',
    lineHeight: 18,
    textAlign: 'center',
  },
  lockedSpacer: {
    minHeight: 38,
  },
  statusPill: {
    borderRadius: mysteryRadii.round,
    borderWidth: 1,
    paddingHorizontal: mysterySpacing.sm,
    paddingVertical: 4,
    marginTop: 'auto',
  },
  foundPill: {
    backgroundColor: 'rgba(46, 107, 97, 0.22)',
    borderColor: 'rgba(226, 194, 117, 0.28)',
  },
  lockedPill: {
    backgroundColor: 'rgba(7, 16, 20, 0.28)',
    borderColor: 'rgba(184, 170, 144, 0.16)',
  },
  statusText: {
    color: mysteryColors.goldLight,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  lockedStatusText: {
    color: 'rgba(184, 170, 144, 0.76)',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
