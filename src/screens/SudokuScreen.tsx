import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mysteryAssets } from '../assets/mysteryAssets';
import { AdBanner } from '../components/AdBanner';
import { ToolButton } from '../components/MysteryButtons';
import { MysteryScreen } from '../components/MysteryScreen';
import { SudokuGrid } from '../components/SudokuGrid/SudokuGrid';
import { SudokuNumberPad } from '../components/SudokuNumberPad/SudokuNumberPad';
import { canUseDevTools } from '../config/build';
import { getChapterById } from '../data/chapters';
import { useGameProgress } from '../hooks/useGameProgress';
import { useSudoku } from '../hooks/useSudoku';
import { getLocalizedRoom, useI18n } from '../i18n';
import { RootStackParamList } from '../navigation/types';
import { showHintAd } from '../services/ads';
import { mysteryColors, mysteryRadii, mysterySpacing, mysteryTypography } from '../theme';
import { DEFAULT_DIFFICULTY } from '../utils/difficulty';
import { formatDuration } from '../utils/time';

type Props = NativeStackScreenProps<RootStackParamList, 'Sudoku'>;

const SCREEN_PADDING = mysterySpacing.md;
const BOARD_PADDING = 6;
const HINTS_PER_AD = 3;

export function SudokuScreen({ route, navigation }: Props) {
  const baseChapter = getChapterById(route.params.chapterId);
  const difficulty = route.params.difficulty ?? DEFAULT_DIFFICULTY;
  const { completeChapter, progress } = useGameProgress();
  const { text } = useI18n();
  const insets = useSafeAreaInsets();
  const chapter = getLocalizedRoom(baseChapter, text);
  const { width, height } = useWindowDimensions();
  const tablet = width >= 760;
  const returnTo = route.params.returnTo ?? 'map';
  const sudoku = useSudoku(baseChapter, difficulty);
  const [visibleMessage, setVisibleMessage] = useState('');
  const [hintsUsedSinceLastAd, setHintsUsedSinceLastAd] = useState(0);
  const [isHintBusy, setHintBusy] = useState(false);
  const compact = height < 740;
  const tiny = height < 690;
  const availableWidth = tablet ? width - SCREEN_PADDING * 2 - 280 - BOARD_PADDING * 2 : width - SCREEN_PADDING * 2 - BOARD_PADDING * 2;
  const controlsWidth = tablet ? 260 : width - SCREEN_PADDING * 2;
  const controlGap = tiny ? mysterySpacing.sm : mysterySpacing.md;
  const numberPadSize = tablet
    ? 186
    : Math.floor(Math.min(Math.max(controlsWidth * 0.52, tiny ? 146 : 158), tiny ? 158 : compact ? 172 : 184));
  const actionButtonHeight = tablet ? 42 : Math.floor((numberPadSize - controlGap * 2) / 3);
  const maxAllowedGridHeight = tablet ? Math.max(300, height - 210) : tiny ? 282 : compact ? 312 : 346;
  const gridSize = Math.floor(Math.min(availableWidth, maxAllowedGridHeight));

  const goToRoomDetail = () => {
    navigation.replace('ChapterDetail', { chapterId: chapter.id, returnTo });
  };

  const isDevMode = canUseDevTools && progress.gameMode === 'dev';

  useEffect(() => {
    setHintsUsedSinceLastAd(0);
    setHintBusy(false);
  }, [chapter.id, difficulty]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  const finishChapter = async () => {
    const isComplete = sudoku.submitSolution();

    if (!isComplete) {
      return;
    }

    const elapsedTimeMs = sudoku.state.activeProgress.elapsedTimeMs ?? sudoku.state.elapsedSeconds * 1000;
    await completeChapter(chapter.id, elapsedTimeMs, sudoku.hintCount, difficulty);
    navigation.replace('Reward', {
      chapterId: chapter.id,
      difficulty,
      code: sudoku.clueCode,
      elapsedSeconds: sudoku.state.elapsedSeconds,
      hintCount: sudoku.hintCount,
      returnTo,
    });
  };

  const finishChapterForDev = async () => {
    const elapsedTimeMs = sudoku.state.activeProgress.elapsedTimeMs ?? sudoku.state.elapsedSeconds * 1000;
    await completeChapter(chapter.id, elapsedTimeMs, sudoku.hintCount, difficulty);
    navigation.replace('Reward', {
      chapterId: chapter.id,
      difficulty,
      code: sudoku.clueCode,
      elapsedSeconds: sudoku.state.elapsedSeconds,
      hintCount: sudoku.hintCount,
      returnTo,
    });
  };

  const useHintWithAdGate = async () => {
    if (isHintBusy) {
      return;
    }

    if (!sudoku.hasAvailableHint) {
      sudoku.useHint();
      return;
    }

    if (isDevMode) {
      sudoku.useHint();
      return;
    }

    const nextHintCount = hintsUsedSinceLastAd + 1;

    if (nextHintCount < HINTS_PER_AD) {
      if (sudoku.useHint()) {
        setHintsUsedSinceLastAd(nextHintCount);
      }
      return;
    }

    setHintBusy(true);

    try {
      await showHintAd();
    } catch (error) {
      console.warn('Hint ad was not available, continuing with hint fallback.', error);
    }

    try {
      if (sudoku.useHint()) {
        setHintsUsedSinceLastAd(0);
      }
    } finally {
      setHintBusy(false);
    }
  };

  useEffect(() => {
    if (!sudoku.message) {
      setVisibleMessage('');
      return;
    }

    setVisibleMessage(sudoku.message);
    const timeout = setTimeout(() => setVisibleMessage(''), 2800);
    return () => clearTimeout(timeout);
  }, [sudoku.message, sudoku.messageVersion]);

  return (
    <MysteryScreen
      scroll={false}
      backgroundSource={mysteryAssets.mapBackgroundWood}
      contentStyle={StyleSheet.flatten([
        styles.screen,
        tablet && styles.screenTablet,
        tiny && styles.screenTiny,
        { paddingBottom: Math.max(insets.bottom, mysterySpacing.xs) + mysterySpacing.sm },
      ])}
    >
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" onPress={goToRoomDetail} style={styles.roundButton}>
          <Ionicons name="chevron-back" size={24} color={mysteryColors.goldLight} />
        </Pressable>
        <View style={styles.ornament} pointerEvents="none">
          <View style={styles.ornamentLine} />
          <View style={styles.ornamentDiamond} />
          <View style={styles.ornamentLine} />
        </View>
        <View style={styles.topBarSpacer} />
      </View>

      <View style={[styles.headerBlock, tablet && styles.headerBlockTablet]}>
        <View style={[styles.header, tablet && styles.headerTablet]}>
          <Text style={styles.eyebrow}>{`${text.screens.sudoku.room} ${chapter.order}`}</Text>
          <Text style={[styles.title, tablet && styles.titleTablet]}>{chapter.locationName}</Text>
          <Text style={styles.difficulty}>{text.difficulty[difficulty]}</Text>
        </View>

        <View style={[styles.metrics, tablet && styles.metricsTablet]}>
          <View style={styles.metricPill}>
            <Ionicons name="time-outline" size={15} color={mysteryColors.goldLight} />
            <Text style={styles.metricText}>{formatDuration(sudoku.state.activeProgress.elapsedTimeMs ?? sudoku.state.elapsedSeconds * 1000)}</Text>
          </View>
          <View style={styles.metricPill}>
            <Ionicons name="bulb-outline" size={15} color={mysteryColors.goldLight} />
            <Text style={styles.metricText}>{`${text.labels.hints}: ${sudoku.hintCount}`}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.playArea, tablet && styles.playAreaTablet]}>
        <View style={[styles.boardColumn, tablet && styles.boardColumnTablet]}>
          <View style={[styles.boardShell, { width: gridSize + BOARD_PADDING * 2 }]}>
            <SudokuGrid
              size={gridSize}
              values={sudoku.state.values}
              notes={sudoku.state.notes}
              selected={sudoku.selected}
              clueCells={chapter.clueCells}
              errors={sudoku.validatedErrors}
              solved={sudoku.isSolved}
              isFixed={sudoku.isFixed}
              onSelect={sudoku.selectCell}
            />
          </View>

          <View style={styles.messageSlot} pointerEvents="none">
            {visibleMessage ? (
              <View style={styles.hintToast}>
                <Ionicons name="bulb-outline" size={15} color={mysteryColors.goldLight} />
                <Text numberOfLines={2} style={styles.hintToastText}>
                  {visibleMessage}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={[styles.controlsPanel, tablet && styles.controlsPanelTablet, { gap: controlGap }]}>
          <SudokuNumberPad onPress={sudoku.inputNumber} compact={tiny} size={numberPadSize} />
          <View style={[styles.actionColumn, tablet && styles.actionColumnTablet, { gap: controlGap }]}>
            <ToolButton title={text.screens.sudoku.undo} onPress={sudoku.undo} icon="arrow-undo-outline" style={[styles.toolButton, tablet && styles.toolButtonTablet, { minHeight: actionButtonHeight }]} />
            <ToolButton title={text.buttons.hint} onPress={useHintWithAdGate} disabled={isHintBusy} icon="bulb-outline" style={[styles.toolButton, tablet && styles.toolButtonTablet, { minHeight: actionButtonHeight }]} />
            <ToolButton title={text.screens.sudoku.finish} onPress={finishChapter} icon="flag-outline" style={[styles.finishTool, tablet && styles.toolButtonTablet, { minHeight: actionButtonHeight }]} />
          </View>
        </View>
      </View>

      <AdBanner />

      {__DEV__ && canUseDevTools && progress.gameMode === 'dev' && (
        <View style={styles.devControls}>
          <ToolButton title={text.screens.sudoku.fill} icon="checkmark-done-outline" onPress={sudoku.fillSolution} style={styles.devTool} />
          <ToolButton title={text.screens.sudoku.quickFinish} icon="flag-outline" onPress={finishChapterForDev} style={styles.devTool} />
          <ToolButton title={text.screens.sudoku.reset} icon="refresh-outline" onPress={sudoku.resetSudoku} style={styles.devTool} />
        </View>
      )}
    </MysteryScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 5,
    justifyContent: 'flex-start',
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: mysterySpacing.sm,
  },
  screenTablet: {
    maxWidth: 980,
  },
  screenTiny: {
    gap: 3,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(7, 16, 20, 0.48)',
    borderColor: 'rgba(226, 194, 117, 0.5)',
    borderRadius: 23,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  topBarSpacer: {
    height: 46,
    width: 46,
  },
  ornament: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: mysterySpacing.lg,
    maxWidth: 190,
  },
  ornamentLine: {
    backgroundColor: 'rgba(226, 194, 117, 0.48)',
    flex: 1,
    height: 1,
  },
  ornamentDiamond: {
    backgroundColor: 'rgba(201, 167, 92, 0.16)',
    borderColor: mysteryColors.goldLight,
    borderWidth: 1,
    height: 9,
    marginHorizontal: mysterySpacing.sm,
    transform: [{ rotate: '45deg' }],
    width: 9,
  },
  header: {
    alignItems: 'center',
    gap: 0,
    marginTop: -2,
  },
  headerBlock: {
    gap: mysterySpacing.xs,
  },
  headerBlockTablet: {
    alignItems: 'center',
    gap: 4,
  },
  headerTablet: {
    alignItems: 'center',
    marginTop: 0,
  },
  eyebrow: {
    color: mysteryColors.goldLight,
    fontSize: mysteryTypography.tiny,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  title: {
    color: mysteryColors.goldLight,
    fontFamily: mysteryTypography.serif,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 27,
  },
  titleTablet: {
    fontSize: 22,
    lineHeight: 24,
  },
  difficulty: {
    color: mysteryColors.muted,
    fontSize: mysteryTypography.small,
    fontWeight: '900',
    marginTop: 2,
  },
  metrics: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: mysterySpacing.xs,
    justifyContent: 'center',
  },
  metricsTablet: {
    alignSelf: 'center',
  },
  metricPill: {
    alignItems: 'center',
    backgroundColor: 'rgba(7, 16, 20, 0.42)',
    borderColor: 'rgba(201, 167, 92, 0.3)',
    borderRadius: 14,
    borderWidth: 0.7,
    flexDirection: 'row',
    gap: 5,
    minHeight: 26,
    paddingHorizontal: mysterySpacing.sm,
  },
  metricText: {
    color: mysteryColors.cream,
    fontSize: mysteryTypography.tiny,
    fontWeight: '800',
  },
  boardShell: {
    alignSelf: 'center',
    backgroundColor: 'rgba(2, 6, 8, 0.36)',
    borderColor: 'rgba(226, 194, 117, 0.22)',
    borderRadius: mysteryRadii.lg,
    borderWidth: 0.8,
    overflow: 'visible',
    padding: BOARD_PADDING,
  },
  playArea: {
    gap: mysterySpacing.sm,
  },
  playAreaTablet: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: mysterySpacing.lg,
    justifyContent: 'center',
  },
  boardColumn: {
    alignItems: 'center',
  },
  boardColumnTablet: {
    flex: 1,
    minWidth: 0,
  },
  messageSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 30,
    paddingHorizontal: mysterySpacing.xs,
  },
  hintToast: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(7, 16, 20, 0.82)',
    borderColor: 'rgba(226, 194, 117, 0.42)',
    borderRadius: mysteryRadii.md,
    borderWidth: 0.8,
    flexDirection: 'row',
    gap: mysterySpacing.sm,
    justifyContent: 'center',
    minHeight: 30,
    paddingHorizontal: mysterySpacing.md,
    paddingVertical: 4,
  },
  hintToastText: {
    color: mysteryColors.cream,
    flex: 1,
    fontSize: mysteryTypography.small,
    fontWeight: '800',
    lineHeight: 16,
    textAlign: 'center',
  },
  controlsPanel: {
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  controlsPanelTablet: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: 214,
  },
  actionColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  actionColumnTablet: {
    flex: 0,
  },
  toolButton: {
    flex: 0,
    minWidth: 0,
    paddingHorizontal: 6,
  },
  toolButtonTablet: {
    width: '100%',
  },
  finishTool: {
    flex: 0,
    minWidth: 0,
    paddingHorizontal: 6,
  },
  devControls: {
    flexDirection: 'row',
    gap: mysterySpacing.xs,
  },
  devTool: {
    minHeight: 34,
    minWidth: 0,
  },
});
