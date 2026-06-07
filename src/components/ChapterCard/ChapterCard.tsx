import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { mysteryAssets } from '../../assets/mysteryAssets';
import { useI18n } from '../../i18n';
import { mysteryColors, mysteryRadii, mysteryShadows, mysterySpacing, mysteryTypography } from '../../theme';
import { Chapter } from '../../types/chapter';
import { RoomThumbnailCard } from '../RoomThumbnailCard';
import { StatusBadge } from '../StatusBadge';

type ChapterCardProps = {
  chapter: Chapter;
  status: 'locked' | 'available' | 'completed';
  onPress: () => void;
};

function ChapterCardComponent({ chapter, status, onPress }: ChapterCardProps) {
  const { text } = useI18n();
  const locked = status === 'locked';
  const completed = status === 'completed';
  const available = status === 'available';
  const label = locked ? text.labels.locked : completed ? text.labels.completed : text.labels.available;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: locked }}
      disabled={locked}
      onPress={onPress}
      style={({ pressed }) => [styles.shell, available && styles.shellAvailable, locked && styles.shellLocked, pressed && !locked && styles.pressed]}
    >
      <LinearGradient
        colors={
          locked
            ? ['rgba(9, 17, 21, 0.72)', 'rgba(4, 9, 12, 0.9)']
            : available
              ? ['rgba(23, 54, 57, 0.72)', 'rgba(7, 16, 20, 0.9)', 'rgba(3, 8, 10, 0.96)']
              : ['rgba(14, 31, 34, 0.56)', 'rgba(7, 16, 20, 0.86)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={[styles.previewFrame, locked && styles.previewLocked]}>
          <RoomThumbnailCard source={mysteryAssets.rooms[chapter.visualKey]} locked={locked} />
        </View>

        <View style={styles.copy}>
          <View style={styles.metaRow}>
            <Text style={[styles.kicker, locked && styles.kickerLocked]}>{text.screens.sudoku.room} {chapter.order}</Text>
          </View>
          <Text numberOfLines={2} style={[styles.title, locked && styles.titleLocked]}>
            {chapter.locationName}
          </Text>
          <View style={styles.statusWrap}>
            <StatusBadge label={label} tone={locked ? 'locked' : completed ? 'done' : 'active'} compact />
          </View>
        </View>

        <View style={[styles.affordance, available && styles.affordanceAvailable, completed && styles.affordanceCompleted, locked && styles.affordanceLocked]}>
          <Ionicons name="chevron-forward" size={22} color={locked ? mysteryColors.muted : mysteryColors.goldLight} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export const ChapterCard = memo(ChapterCardComponent);

const styles = StyleSheet.create({
  shell: {
    borderRadius: mysteryRadii.lg,
    width: '100%',
  },
  shellAvailable: {
    ...mysteryShadows.glow,
  },
  shellLocked: {
    opacity: 0.86,
  },
  card: {
    alignItems: 'center',
    borderColor: 'rgba(201, 167, 92, 0.24)',
    borderRadius: mysteryRadii.lg,
    borderWidth: 0.8,
    flexDirection: 'row',
    gap: mysterySpacing.md,
    minHeight: 132,
    overflow: 'hidden',
    padding: mysterySpacing.md,
    paddingRight: mysterySpacing.sm,
    ...mysteryShadows.panel,
  },
  previewFrame: {
    backgroundColor: 'rgba(2, 6, 8, 0.74)',
    borderColor: 'rgba(226, 194, 117, 0.2)',
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    height: 112,
    overflow: 'hidden',
    padding: 3,
    width: 146,
  },
  previewLocked: {
    borderColor: 'rgba(184, 170, 144, 0.16)',
  },
  copy: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    paddingVertical: 2,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: mysterySpacing.sm,
    marginBottom: 2,
  },
  kicker: {
    color: 'rgba(226, 194, 117, 0.78)',
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  kickerLocked: {
    color: 'rgba(184, 170, 144, 0.62)',
  },
  title: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 21,
  },
  titleLocked: {
    color: 'rgba(243, 231, 204, 0.68)',
  },
  statusWrap: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  affordance: {
    alignItems: 'center',
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  affordanceAvailable: {
    backgroundColor: 'rgba(201, 167, 92, 0.16)',
    borderColor: 'rgba(226, 194, 117, 0.34)',
    borderWidth: 1,
  },
  affordanceCompleted: {
    backgroundColor: 'rgba(46, 107, 97, 0.24)',
    borderColor: 'rgba(226, 194, 117, 0.2)',
    borderWidth: 1,
  },
  affordanceLocked: {
    backgroundColor: 'rgba(184, 170, 144, 0.07)',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
