import { Pressable, StyleSheet, Text, View } from 'react-native';
import { mysteryColors, mysteryRadii, mysteryTypography } from '../../theme';
import { ClueCell } from '../../types/chapter';
import { SudokuCellNotes } from '../../types/sudoku';

type SudokuGridProps = {
  values: number[][];
  notes: SudokuCellNotes[][];
  selected?: { row: number; col: number };
  clueCells: ClueCell[];
  errors: string[];
  solved: boolean;
  size: number;
  isFixed: (row: number, col: number) => boolean;
  onSelect: (row: number, col: number) => void;
};

export function SudokuGrid({ values, notes, selected, clueCells, errors, solved, size, isFixed, onSelect }: SudokuGridProps) {
  const cellSize = size / 9;
  const valueFontSize = Math.round(cellSize * 0.6);
  const valueLineHeight = Math.round(cellSize * 0.92);
  const selectedValue = selected ? values[selected.row][selected.col] : 0;

  const isRelated = (row: number, col: number) => {
    if (!selected) {
      return false;
    }
    const sameRow = row === selected.row;
    const sameCol = col === selected.col;
    const sameBlock = Math.floor(row / 3) === Math.floor(selected.row / 3) && Math.floor(col / 3) === Math.floor(selected.col / 3);
    return sameRow || sameCol || sameBlock;
  };

  const isClue = (row: number, col: number) => clueCells.some((cell) => cell.row === row && cell.col === col);

  return (
    <View style={[styles.grid, { width: size, height: size }]}>
      {values.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((value, colIndex) => {
          const fixed = isFixed(rowIndex, colIndex);
          const selectedCell = selected ? selected.row === rowIndex && selected.col === colIndex : false;
          const sameNumber = !!value && value === selectedValue;
          const key = `${rowIndex}-${colIndex}`;

          return (
            <Pressable
              key={key}
              onPress={() => onSelect(rowIndex, colIndex)}
              style={[
                styles.cell,
                { width: cellSize, height: cellSize },
                isRelated(rowIndex, colIndex) && styles.related,
                sameNumber && styles.sameNumber,
                selectedCell && styles.selected,
                errors.includes(key) && styles.error,
                solved && isClue(rowIndex, colIndex) && styles.solvedClue,
              ]}
            >
              {isClue(rowIndex, colIndex) && <View style={styles.clueMark} />}
              {value ? (
                <Text
                  style={[
                    styles.value,
                    { fontSize: valueFontSize, height: cellSize, lineHeight: valueLineHeight, width: cellSize },
                    fixed ? styles.fixed : styles.player,
                  ]}
                >
                  {value}
                </Text>
              ) : (
                <View style={styles.notes}>
                  {Array.from({ length: 9 }, (_, index) => index + 1).map((note) => (
                    <Text key={note} style={styles.note}>
                      {notes[rowIndex][colIndex].includes(note) ? note : ' '}
                    </Text>
                  ))}
                </View>
              )}
            </Pressable>
          );
          })}
        </View>
      ))}
      {Array.from({ length: 10 }, (_, index) => {
        const strong = index % 3 === 0;
        const lineWidth = strong ? 2 : 0.7;
        const offset = index === 0 ? 0 : index === 9 ? size - lineWidth : cellSize * index - lineWidth / 2;

        return [
          <View key={`v-${index}`} pointerEvents="none" style={[styles.verticalLine, { left: offset, width: lineWidth }, strong && styles.strongLine]} />,
          <View key={`h-${index}`} pointerEvents="none" style={[styles.horizontalLine, { top: offset, height: lineWidth }, strong && styles.strongLine]} />,
        ];
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    alignSelf: 'center',
    backgroundColor: mysteryColors.night,
    borderRadius: mysteryRadii.md,
    overflow: 'visible',
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D1B20',
  },
  related: {
    backgroundColor: '#172D31',
  },
  sameNumber: {
    backgroundColor: '#203D3E',
  },
  selected: {
    backgroundColor: '#5C4B25',
    borderColor: mysteryColors.goldLight,
  },
  error: {
    backgroundColor: mysteryColors.wine,
  },
  solvedClue: {
    backgroundColor: '#6E5A2E',
  },
  clueMark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: mysteryColors.goldLight,
  },
  value: {
    fontFamily: mysteryTypography.serif,
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  fixed: {
    color: mysteryColors.goldLight,
    fontWeight: '900',
  },
  player: {
    color: mysteryColors.cream,
    fontWeight: '900',
  },
  notes: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
  note: {
    width: '33.33%',
    textAlign: 'center',
    color: mysteryColors.muted,
    fontSize: 9,
    lineHeight: 11,
  },
  verticalLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(201, 167, 92, 0.36)',
  },
  horizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(201, 167, 92, 0.36)',
  },
  strongLine: {
    backgroundColor: 'rgba(226, 194, 117, 0.68)',
  },
});
