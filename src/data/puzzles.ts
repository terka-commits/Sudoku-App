const solutionA = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

const puzzleA = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const givensByDifficulty = {
  easy: 45,
  medium: 36,
  hard: 28,
} as const;

const buildPuzzle = (roomIndex: number, difficulty: keyof typeof givensByDifficulty) => {
  const targetGivens = givensByDifficulty[difficulty];
  const cells = Array.from({ length: 81 }, (_, cellIndex) => cellIndex).sort((a, b) => {
    const scoreA = (a * 37 + roomIndex * 19 + difficulty.length * 11) % 81;
    const scoreB = (b * 37 + roomIndex * 19 + difficulty.length * 11) % 81;
    return scoreA - scoreB;
  });
  const visibleCells = new Set(cells.slice(0, targetGivens));

  return solutionA.map((row, rowIndex) =>
    row.map((value, colIndex) => (visibleCells.has(rowIndex * 9 + colIndex) ? value : 0)),
  );
};

export const puzzles = Array.from({ length: 25 }, (_, index) => ({
  easy: {
    id: `room-${(index + 1).toString().padStart(2, '0')}-easy`,
    puzzle: buildPuzzle(index, 'easy'),
    solution: solutionA,
  },
  medium: {
    id: `room-${(index + 1).toString().padStart(2, '0')}-medium`,
    puzzle: buildPuzzle(index, 'medium'),
    solution: solutionA,
  },
  hard: {
    id: `room-${(index + 1).toString().padStart(2, '0')}-hard`,
    puzzle: buildPuzzle(index, 'hard'),
    solution: solutionA,
  },
}));
