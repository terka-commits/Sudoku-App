import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useI18n } from '../i18n';
import { loadSudokuState, saveSudokuState } from '../storage/gameStorage';
import { Chapter } from '../types/chapter';
import type { Difficulty, SudokuCellNotes, SudokuGameState } from '../types/sudoku';
import { DEFAULT_DIFFICULTY } from '../utils/difficulty';

const cloneGrid = (grid: number[][]) => grid.map((row) => [...row]);
const emptyNotes = (): SudokuCellNotes[][] =>
  Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []));

export function useSudoku(chapter: Chapter, difficulty: Difficulty = DEFAULT_DIFFICULTY) {
  const { text } = useI18n();
  const nowIso = () => new Date().toISOString();
  const activePuzzle = chapter.sudokuPuzzles[difficulty];

  if (!activePuzzle) {
    throw new Error(`Missing ${difficulty} sudoku puzzle for ${chapter.id}`);
  }

  const createInitialState = (): SudokuGameState => ({
    chapterId: chapter.id,
    difficulty,
    values: cloneGrid(activePuzzle.puzzle),
    notes: emptyNotes(),
    elapsedSeconds: 0,
    activeProgress: {
      roomId: chapter.id,
      difficulty,
      elapsedTimeMs: 0,
      lastSavedAt: nowIso(),
      isPaused: false,
    },
    isNoteMode: false,
    history: [],
  });

  const [state, setState] = useState<SudokuGameState>(createInitialState);
  const [validatedErrors, setValidatedErrors] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [messageVersion, setMessageVersion] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const lastTickRef = useRef(Date.now());
  const isGameplayActiveRef = useRef(AppState.currentState === 'active');
  const stateRef = useRef(state);

  const showMessage = (messageText: string) => {
    setMessage(messageText);
    setMessageVersion((version) => version + 1);
  };

  useEffect(() => {
    let cancelled = false;

    loadSudokuState(chapter.id, difficulty).then((saved) => {
      if (cancelled) {
        return;
      }

      if (saved) {
        const elapsedTimeMs = saved.activeProgress.elapsedTimeMs ?? saved.elapsedSeconds * 1000;
        setState({
          ...saved,
          elapsedSeconds: Math.floor(elapsedTimeMs / 1000),
          activeProgress: {
            roomId: chapter.id,
            difficulty,
            elapsedTimeMs,
            lastSavedAt: nowIso(),
            isPaused: AppState.currentState !== 'active',
          },
          notes: emptyNotes(),
          isNoteMode: false,
        });
        return;
      }

      setHintCount(0);
      setValidatedErrors([]);
      setMessage('');
      setState(createInitialState());
    });

    return () => {
      cancelled = true;
    };
  }, [chapter.id, difficulty]);

  useEffect(() => {
    lastTickRef.current = Date.now();

    const interval = setInterval(() => {
      if (!isGameplayActiveRef.current) {
        return;
      }

      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      setState((current) => {
        const elapsedTimeMs = (current.activeProgress.elapsedTimeMs ?? current.elapsedSeconds * 1000) + delta;
        return {
          ...current,
          elapsedSeconds: Math.floor(elapsedTimeMs / 1000),
          activeProgress: {
            roomId: chapter.id,
            difficulty,
            elapsedTimeMs,
            lastSavedAt: nowIso(),
            isPaused: false,
          },
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [chapter.id, difficulty]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const isActive = nextState === 'active';
      isGameplayActiveRef.current = isActive;
      lastTickRef.current = Date.now();

      setState((current) => ({
        ...current,
        activeProgress: {
          roomId: chapter.id,
          difficulty,
          elapsedTimeMs: current.activeProgress.elapsedTimeMs ?? current.elapsedSeconds * 1000,
          lastSavedAt: nowIso(),
          isPaused: !isActive,
        },
      }));
    });

    return () => subscription.remove();
  }, [chapter.id, difficulty]);

  useEffect(() => {
    saveSudokuState(state);
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    return () => {
      const current = stateRef.current;
      saveSudokuState({
        ...current,
        activeProgress: {
          roomId: chapter.id,
          difficulty,
          elapsedTimeMs: current.activeProgress.elapsedTimeMs ?? current.elapsedSeconds * 1000,
          lastSavedAt: nowIso(),
          isPaused: true,
        },
      });
    };
  }, [chapter.id, difficulty]);

  const fixedCells = useMemo(
    () => new Set(activePuzzle.puzzle.flatMap((row, rowIndex) => row.map((value, colIndex) => (value ? `${rowIndex}-${colIndex}` : '')))),
    [activePuzzle.puzzle],
  );

  const isFixed = (row: number, col: number) => fixedCells.has(`${row}-${col}`);
  const selected = state.selectedCell;
  const hasAvailableHint = state.values.some((row, rowIndex) =>
    row.some((value, colIndex) => !value && !isFixed(rowIndex, colIndex)),
  );

  const selectCell = (row: number, col: number) => {
    setState((current) => ({ ...current, selectedCell: { row, col } }));
  };

  const setNoteMode = () => {
    setState((current) => ({ ...current, isNoteMode: !current.isNoteMode }));
  };

  const inputNumber = (number: number) => {
    if (!selected || isFixed(selected.row, selected.col)) {
      showMessage(text.sudoku.chooseCell);
      return;
    }

    setValidatedErrors([]);
    setState((current) => {
      const values = cloneGrid(current.values);
      const notes = current.notes.map((row) => row.map((cell) => [...cell]));

      values[selected.row][selected.col] = number;
      notes[selected.row][selected.col] = [];
      return { ...current, values, notes, history: [...current.history, current.values] };
    });
  };

  const erase = () => {
    if (!selected || isFixed(selected.row, selected.col)) {
      return;
    }
    setValidatedErrors([]);
    setState((current) => {
      const values = cloneGrid(current.values);
      const notes = current.notes.map((row) => row.map((cell) => [...cell]));
      values[selected.row][selected.col] = 0;
      notes[selected.row][selected.col] = [];
      return { ...current, values, notes, history: [...current.history, current.values] };
    });
  };

  const undo = () => {
    setValidatedErrors([]);
    setState((current) => {
      const previous = current.history[current.history.length - 1];
      if (!previous) {
        return current;
      }
      return {
        ...current,
        values: cloneGrid(previous),
        history: current.history.slice(0, -1),
      };
    });
  };

  const verify = () => {
    const errors: string[] = [];
    let complete = true;

    state.values.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (!value) {
          complete = false;
          return;
        }
        if (value !== activePuzzle.solution[rowIndex][colIndex]) {
          errors.push(`${rowIndex}-${colIndex}`);
        }
      });
    });

    setValidatedErrors(errors);

    if (errors.length > 0) {
      showMessage(text.sudoku.verifyErrors);
      return false;
    }

    showMessage(complete ? text.sudoku.verifyComplete : text.sudoku.verifyOk);
    return complete;
  };

  const submitSolution = () => {
    const errors: string[] = [];
    let complete = true;

    state.values.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (!value) {
          complete = false;
          return;
        }
        if (value !== activePuzzle.solution[rowIndex][colIndex]) {
          errors.push(`${rowIndex}-${colIndex}`);
        }
      });
    });

    setValidatedErrors(errors);

    if (!complete || errors.length > 0) {
      showMessage(text.sudoku.submitError);
      return false;
    }

    showMessage(text.sudoku.verifyComplete);
    return true;
  };

  const useHint = () => {
    const emptyCells = state.values.flatMap((row, rowIndex) =>
      row
        .map((value, colIndex) => ({ value, row: rowIndex, col: colIndex }))
        .filter((cell) => !cell.value && !isFixed(cell.row, cell.col)),
    );
    const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    if (!target) {
      showMessage(text.sudoku.noHints);
      return false;
    }
    setHintCount((count) => count + 1);
    setValidatedErrors([]);
    showMessage(text.sudoku.hintFilled);
    setState((current) => {
      const values = cloneGrid(current.values);
      const notes = current.notes.map((row) => row.map((cell) => [...cell]));
      values[target.row][target.col] = activePuzzle.solution[target.row][target.col];
      notes[target.row][target.col] = [];
      return { ...current, values, notes, selectedCell: { row: target.row, col: target.col }, history: [...current.history, current.values] };
    });
    return true;
  };

  const fillSolution = () => {
    setValidatedErrors([]);
    showMessage(text.sudoku.devFilled);
    setState((current) => ({
      ...current,
      values: cloneGrid(activePuzzle.solution),
      notes: emptyNotes(),
      history: [...current.history, current.values],
    }));
  };

  const resetSudoku = () => {
    setValidatedErrors([]);
    showMessage(text.sudoku.devReset);
    setHintCount(0);
    setState({
      chapterId: chapter.id,
      difficulty,
      values: cloneGrid(activePuzzle.puzzle),
      notes: emptyNotes(),
      elapsedSeconds: 0,
      activeProgress: {
        roomId: chapter.id,
        difficulty,
        elapsedTimeMs: 0,
        lastSavedAt: nowIso(),
        isPaused: false,
      },
      isNoteMode: false,
      history: [],
    });
  };

  const addDevHint = () => {
    setHintCount((count) => count + 1);
    showMessage(text.sudoku.devHintAdded);
  };

  const isSolved = state.values.every((row, rowIndex) =>
    row.every((value, colIndex) => value === activePuzzle.solution[rowIndex][colIndex]),
  );

  const clueCode = chapter.clueCells.map((cell) => activePuzzle.solution[cell.row][cell.col]).join('');

  return {
    state,
    selected,
    validatedErrors,
    message,
    messageVersion,
    hintCount,
    hasAvailableHint,
    isSolved,
    clueCode,
    isFixed,
    selectCell,
    inputNumber,
    erase,
    undo,
    verify,
    submitSolution,
    useHint,
    fillSolution,
    resetSudoku,
    addDevHint,
    setNoteMode,
  };
}
