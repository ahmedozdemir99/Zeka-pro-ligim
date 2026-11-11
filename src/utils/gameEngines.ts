import { SudokuPuzzle, KendokuPuzzle, ApartmanPuzzle, RebusPuzzle, KendokuCage } from '../types';

function shuffle<T>(array: T[]): T[] {
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
  const used = new Set<string>();
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (used.has(`${r},${c}`)) continue;

      let cells: [number, number][] = [[r, c]];
      used.add(`${r},${c}`);
      
      const vals = cells.map(([cr, cc]) => sol[cr][cc]);
      cages.push({ cells, op: '=', target: vals[0] });
    }
  }
  return { sol, cages };
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

/* =========================================================
   4. RESFEBE (REBUS)
========================================================= */
export const rebusPool: RebusPuzzle[] = [
  { display: 'C1', answer: 'CEBİR', source: 'MEB Zekâ Oyunları' },
  { display: 'NNNNNN', answer: 'ALTINDIR', source: 'MEB Beceri Temelli' },
  { display: 'EL + Di + ters EV + N', answer: 'ELDİVEN', source: 'MEB Zekâ Oyunları' },
  { display: 'S + AYI', answer: 'SAYI', source: 'Toli Games' },
  { display: 'H + AY + AT', answer: 'HAYAT', source: 'Toli Games' },
  { display: 'TEF + L + 10', answer: 'TEFLON', source: 'Toli Games' },
  { display: 'YEL DEĞİRMENİ + KOVA + 10', answer: 'YELKOVAN', source: 'Toli Games' },
  { display: 'KAR TANESİ + AT + E', answer: 'KARATE', source: 'Toli Games' },
  { display: 'NAL − N + EV', answer: 'ALEV', source: 'Toli Games' },
  { display: 'M + AY + MUZ(−Z) + N', answer: 'MAYMUN', source: 'Toli Games' },
  { display: 'ters AY + ters AT + K', answer: 'YATAK', source: 'Toli Games' },
  { display: 'ÇAM(−M) + DIR', answer: 'ÇADIR', source: 'Toli Games' },
  { display: 'KEK(−K) + DİŞ(−Ş)', answer: 'KEDİ', source: 'Toli Games' },
  { display: 'KÂĞIT + I + T', answer: 'KAĞIT', source: 'Zekâ Kulübü' },
  { display: '2 + Lİ + K', answer: 'İKİLİK', source: 'Zekâ Kulübü' },
  { display: 'KAP + A + N', answer: 'KAPAN', source: 'Resfebe Dünyası' },
  { display: 'BAŞ + A + R + I', answer: 'BAŞARI', source: 'Resfebe Dünyası' },
  { display: 'D + OK + TOR', answer: 'DOKTOR', source: 'Resfebe Dünyası' },
  { display: 'M + A + T + E + M + A + T + İ + K', answer: 'MATEMATİK', source: 'Resfebe Dünyası' },
  { display: 'S + O + R + U', answer: 'SORU', source: 'Resfebe Dünyası' }
];

export function makeRebus(): RebusPuzzle {
  return rebusPool[Math.floor(Math.random() * rebusPool.length)];
}

