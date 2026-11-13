import { SudokuPuzzle, KendokuPuzzle, ApartmanPuzzle, KendokuCage } from '../types';

function shuffle<T>(array: readonly T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* =========================================================
   1. SUDOKU (9x9)
========================================================= */
function sudokuPattern(r: number, c: number): number {
  return (r * 3 + Math.floor(r / 3) + c) % 9;
}

export function makeSudoku(): SudokuPuzzle {
  const base = Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 9 }, (_, c) => sudokuPattern(r, c) + 1)
  );
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const sol = base.map(row => row.map(cell => nums[cell - 1]));
  const puzzle = sol.map(r => [...r]);

  const cells = shuffle(Array.from({ length: 81 }, (_, i) => i));
  let removeCount = 46 + Math.floor(Math.random() * 6); // 46 to 51 empty cells

  for (const k of cells) {
    if (removeCount <= 0) break;
    const r = Math.floor(k / 9);
    const c = k % 9;
    puzzle[r][c] = 0;
    removeCount--;
  }

  return { sol, puzzle };
}

/* =========================================================
   2. KENDOKU (4x4)
========================================================= */
function latin4(): number[][] {
  const arr: number[][] = Array.from({ length: 4 }, () => []);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      arr[r][c] = ((r + c) % 4) + 1;
    }
  }
  const nums = shuffle([1, 2, 3, 4]);
  return arr.map(row => row.map(x => nums[x - 1]));
}

export function makeKendoku(): KendokuPuzzle {
  const sol = latin4();
  const cages: KendokuCage[] = [];
  const unused = new Set(shuffle(Array.from({ length: 16 }, (_, index) => index)));
  const coordinates = (index: number): [number, number] => [Math.floor(index / 4), index % 4];

  for (const index of unused) {
    unused.delete(index);
    const [row, col] = coordinates(index);
    const neighbors = shuffle([index - 4, index + 4, col > 0 ? index - 1 : -1, col < 3 ? index + 1 : -1]);
    const partner = neighbors.find(cell => unused.has(cell));
    if (partner === undefined) {
      cages.push({ cells: [[row, col]], op: '=', target: sol[row][col] });
      continue;
    }
    unused.delete(partner);
    const [otherRow, otherCol] = coordinates(partner);
    const cells = [coordinates(index), coordinates(partner)].sort(([r1, c1], [r2, c2]) => r1 - r2 || c1 - c2);
    const [a, b] = [sol[row][col], sol[otherRow][otherCol]];
    const op = shuffle(['+', '−', '×'] as const)[0];
    const target = { '+': a + b, '−': Math.abs(a - b), '×': a * b }[op];
    cages.push({ cells, op, target });
  }
  return { sol, cages };
}

export function matchesCage(cage: KendokuCage, board: number[][]): boolean {
  const values = cage.cells.map(([row, col]) => board[row][col]);
  const [a, b] = values;
  switch (cage.op) {
    case '=': return a === cage.target;
    case '+': return values.reduce((sum, value) => sum + value, 0) === cage.target;
    case '×': return values.reduce((product, value) => product * value, 1) === cage.target;
    case '−': return Math.abs(a - b) === cage.target;
    case '÷': return Math.max(a, b) / Math.min(a, b) === cage.target;
  }
}

/* =========================================================
   3. APARTMAN / SKYSCRAPERS (5x5)
========================================================= */
function latin5(): number[][] {
  const a: number[][] = Array.from({ length: 5 }, () => []);
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      a[r][c] = ((r + c) % 5) + 1;
    }
  }
  const nums = shuffle([1, 2, 3, 4, 5]);
  return a.map(row => row.map(x => nums[x - 1]));
}

export function visible(arr: number[]): number {
  let max = 0;
  let count = 0;
  arr.forEach(val => {
    if (val > max) {
      max = val;
      count++;
    }
  });
  return count;
}

export function makeApartman(): ApartmanPuzzle {
  const sol = latin5();
  const top: number[] = [];
  const bottom: number[] = [];
  const left: number[] = [];
  const right: number[] = [];

  for (let c = 0; c < 5; c++) {
    const colVals = sol.map(r => r[c]);
    top[c] = visible(colVals);
    bottom[c] = visible([...colVals].reverse());
  }

  for (let r = 0; r < 5; r++) {
    const rowVals = sol[r];
    left[r] = visible(rowVals);
    right[r] = visible([...rowVals].reverse());
  }

  return { sol, top, bottom, left, right };
}
