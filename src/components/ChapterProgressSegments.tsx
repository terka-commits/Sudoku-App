import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { useI18n } from '../i18n';
import { mysteryColors, mysteryRadii } from '../theme';

type ChapterProgressSegmentsProps = {
  completedRooms: number;
  totalChapters?: number;
  roomsPerChapter?: number;
  totalRooms?: number;
};

export function ChapterProgressSegments({
  completedRooms,
  totalChapters = 5,
  roomsPerChapter = 5,
  totalRooms = totalChapters * roomsPerChapter,
}: ChapterProgressSegmentsProps) {
  const { text } = useI18n();
  const safeCompletedRooms = Math.max(0, Math.min(completedRooms, totalRooms));
  const safeRoomsPerChapter = Math.max(1, roomsPerChapter);
  const accessibilityLabel = text.screens.hotelMap.progressAccessibility
    .replace('{{completed}}', `${safeCompletedRooms}`)
    .replace('{{total}}', `${totalRooms}`);
  const segments = Array.from({ length: totalChapters }, (_, index) => {
    const segmentStart = index * safeRoomsPerChapter;
    const segmentProgress = (safeCompletedRooms - segmentStart) / safeRoomsPerChapter;
    return Math.max(0, Math.min(1, segmentProgress));
  });

  return (
    <View style={styles.segments} accessibilityLabel={accessibilityLabel}>
      {segments.map((segmentFill, index) => (
        <View
          key={`chapter-progress-segment-${index + 1}`}
          style={[styles.segment, segmentFill >= 1 && styles.segmentComplete, segmentFill > 0 && segmentFill < 1 && styles.segmentCurrent]}
        >
          {segmentFill > 0 ? (
            <LinearGradient
              colors={[mysteryColors.goldLight, mysteryColors.gold, mysteryColors.goldDeep]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.segmentFill, { width: `${segmentFill * 100}%` }]}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  segments: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    minWidth: 154,
  },
  segment: {
    backgroundColor: 'rgba(7, 16, 20, 0.66)',
    borderColor: 'rgba(201, 167, 92, 0.24)',
    borderRadius: mysteryRadii.round,
    borderWidth: 1,
    flex: 1,
    height: 9,
    overflow: 'hidden',
  },
  segmentComplete: {
    borderColor: 'rgba(226, 194, 117, 0.66)',
  },
  segmentCurrent: {
    backgroundColor: 'rgba(42, 34, 18, 0.72)',
    borderColor: 'rgba(226, 194, 117, 0.46)',
  },
  segmentFill: {
    height: '100%',
  },
});
