import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { FlatList, Image, ImageBackground, ImageSourcePropType, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRewardAsset, mysteryAssets } from '../assets/mysteryAssets';
import { EvidenceItemCard } from '../components/EvidenceItemCard';
import { MainBottomNav, MAIN_BOTTOM_NAV_HEIGHT } from '../components/MainBottomNav';
import { MysteryHeader } from '../components/MysteryHeader';
import { chapters } from '../data/chapters';
import { useGameProgress } from '../hooks/useGameProgress';
import { getLocalizedRoom, useI18n } from '../i18n';
import { RootStackParamList } from '../navigation/types';
import { mysteryColors, mysteryRadii, mysteryShadows, mysterySpacing, mysteryTypography } from '../theme';
import { getProgressSummary, getUnlockedStops } from '../utils/progressSelectors';

type Props = NativeStackScreenProps<RootStackParamList, 'Evidence'>;

type JournalTrace = {
  id: string;
  order: number;
  title: string;
  description: string;
  imageAsset: ImageSourcePropType;
  sourceRoomId: string;
  sourceRoomName: string;
  code: string;
  isUnlocked: boolean;
};

const getTraceCode = (chapter: (typeof chapters)[number]) =>
  chapter.clueCells.map((cell) => chapter.solution[cell.row][cell.col]).join('');

const formatProgressCount = (template: string, found: number, total: number) =>
  template.replace('{{found}}', `${found}`).replace('{{total}}', `${total}`);

export function EvidenceScreen({ navigation }: Props) {
  const { progress } = useGameProgress();
  const { text } = useI18n();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tablet = width >= 760;
  const [selectedTrace, setSelectedTrace] = useState<JournalTrace | null>(null);
  const progressSummary = getProgressSummary(progress);

  const traces: JournalTrace[] = chapters.map((baseChapter) => {
    const chapter = getLocalizedRoom(baseChapter, text);
    return {
      id: chapter.reward.id,
      order: chapter.order,
      title: chapter.reward.title,
      description: chapter.reward.description,
      imageAsset: getRewardAsset(chapter.reward.imageKey ?? chapter.reward.id),
      sourceRoomId: chapter.id,
      sourceRoomName: chapter.locationName,
      code: getTraceCode(chapter),
      isUnlocked: progress.completedChapterIds.includes(chapter.id) || progress.collectedRewardIds.includes(chapter.reward.id),
    };
  });
  const foundCount = getUnlockedStops(progress);

  return (
    <>
      <ImageBackground source={mysteryAssets.mapBackgroundWood} resizeMode="cover" style={styles.background} imageStyle={styles.backgroundImage}>
        <View style={styles.overlay} />
        <FlatList
          data={traces}
          keyExtractor={(item) => item.id}
          numColumns={2}
          style={styles.list}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={[
            styles.listContent,
            tablet && styles.tabletListContent,
            {
              paddingBottom: MAIN_BOTTOM_NAV_HEIGHT + Math.max(insets.bottom, mysterySpacing.sm) + mysterySpacing.xxl,
              paddingTop: insets.top + mysterySpacing.sm,
            },
          ]}
          initialNumToRender={8}
          maxToRenderPerBatch={6}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          windowSize={5}
          ListHeaderComponent={
            <View style={styles.headerContent}>
              <MysteryHeader
                onBack={() => navigation.goBack()}
                title={text.screens.evidence.title}
                subtitle={text.screens.evidence.subtitle}
              />

              <View style={styles.progressPanel}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>{text.screens.evidence.archive}</Text>
                  <Text style={styles.progressCount}>{formatProgressCount(text.screens.evidence.progressCount, progressSummary.unlockedStops, progressSummary.totalStops)}</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${traces.length > 0 ? (foundCount / traces.length) * 100 : 0}%` }]} />
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <EvidenceItemCard
              source={item.imageAsset}
              title={item.title}
              index={item.order}
              found={item.isUnlocked}
              onPress={() => setSelectedTrace(item)}
            />
          )}
        />
        <MainBottomNav
          active="journal"
          bottomInset={insets.bottom}
          onHome={() => navigation.navigate('Splash')}
          onCases={() => navigation.navigate('HotelMap')}
          onJournal={() => undefined}
          onAchievements={() => navigation.navigate('Achievements')}
        />
      </ImageBackground>

      <Modal transparent visible={!!selectedTrace} animationType="fade" onRequestClose={() => setSelectedTrace(null)}>
        {selectedTrace ? (
          <View style={styles.modalBackdrop}>
            <View style={styles.detailPanel}>
              <Pressable accessibilityRole="button" onPress={() => setSelectedTrace(null)} style={styles.closeButton}>
                <Ionicons name="close" size={22} color={mysteryColors.goldLight} />
              </Pressable>
              {selectedTrace.imageAsset ? <Image source={selectedTrace.imageAsset} resizeMode="contain" style={styles.detailImage} /> : null}
              <Text style={styles.detailLabel}>{text.screens.evidence.clueLabel} {selectedTrace.order}</Text>
              <Text style={styles.detailTitle}>{selectedTrace.title}</Text>
              <Text style={styles.detailMeta}>{text.screens.evidence.sourceRoom}: {selectedTrace.sourceRoomName}</Text>
              <Text style={styles.detailCopy}>{selectedTrace.description}</Text>
            </View>
          </View>
        ) : null}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.96,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 8, 0.66)',
  },
  list: {
    flex: 1,
  },
  listContent: {
    alignSelf: 'center',
    maxWidth: 640,
    paddingHorizontal: mysterySpacing.md,
    rowGap: mysterySpacing.md,
    width: '100%',
  },
  tabletListContent: {
    maxWidth: 880,
  },
  headerContent: {
    gap: mysterySpacing.md,
    marginBottom: mysterySpacing.md,
  },
  progressPanel: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    borderRadius: mysteryRadii.md,
    borderWidth: 1,
    borderColor: 'rgba(226, 194, 117, 0.3)',
    backgroundColor: 'rgba(5, 13, 17, 0.62)',
    paddingHorizontal: mysterySpacing.lg,
    paddingVertical: mysterySpacing.sm,
    gap: mysterySpacing.xs,
    ...mysteryShadows.panel,
  },
  progressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: mysterySpacing.sm,
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: 'rgba(226, 194, 117, 0.74)',
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  progressCount: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.body,
    fontWeight: '900',
  },
  progressTrack: {
    height: 8,
    borderRadius: mysteryRadii.round,
    backgroundColor: 'rgba(184, 170, 144, 0.16)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: mysteryRadii.round,
    backgroundColor: mysteryColors.goldLight,
  },
  gridRow: {
    gap: mysterySpacing.sm,
    justifyContent: 'space-between',
    marginBottom: mysterySpacing.md,
  },
  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 6, 8, 0.82)',
    padding: mysterySpacing.lg,
  },
  detailPanel: {
    width: '100%',
    maxWidth: 430,
    borderRadius: mysteryRadii.lg,
    borderWidth: 1,
    borderColor: 'rgba(226, 194, 117, 0.58)',
    backgroundColor: 'rgba(5, 13, 17, 0.96)',
    padding: mysterySpacing.lg,
    gap: mysterySpacing.sm,
    alignItems: 'center',
    ...mysteryShadows.glow,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(226, 194, 117, 0.34)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailImage: {
    width: '100%',
    height: 190,
  },
  detailLabel: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  detailTitle: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.h2,
    fontWeight: '900',
    textAlign: 'center',
  },
  detailMeta: {
    color: mysteryColors.gold,
    fontSize: mysteryTypography.small,
    fontWeight: '800',
  },
  detailCopy: {
    color: mysteryColors.muted,
    fontSize: mysteryTypography.body,
    lineHeight: 22,
    textAlign: 'center',
  },
});
