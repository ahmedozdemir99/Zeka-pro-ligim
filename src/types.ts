export interface StudentClass {
  id: string;
  name: string;
  grade: string;
  branch: string;
  students: string[];
  ranking?: Record<string, StudentRanking>;
}

export interface StudentRanking {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  correct: number;
  points: number;
}

export interface Fixture {
  id: string;
  classId: string;
  p1: string;
  p2: string;
  status: 'Bekliyor' | 'Tamamlandı';
  result: string | null;
}

export interface Question {
  grade: number | string;
  difficulty: 'kolay' | 'orta' | 'zor';
  subject: string;
  q: string;
  a: string;
  source?: string;
  explanation?: string;
}

export interface Team {
  name: string;
  members: string[];
}

export interface MatchState {
  id: string;
  classId: string;
  p1: string;
  p2: string;
  mode: 'duel' | 'team' | 'solo';
  team1?: Team;
  team2?: Team;
  index: number;
  questions: Question[];
  answers1: string[];
  answers2: string[];
  correct1: number;
  correct2: number;
  start: number;
}

export interface MatchHistoryRecord {
  id: string;
  date: string;
  classId: string;
  className: string;
  p1: string;
  p2: string;
  mode?: 'duel' | 'team' | 'solo';
  team1?: Team;
  team2?: Team;
  correct1: number;
  correct2: number;
  winner: string;
  answers1: string[];
  answers2: string[];
  type?: string;
  result?: string;
  score?: number;
  time?: number;
}

export interface AppState {
  score: number;
  solved: number;
  streak: number;
  soundEnabled: boolean;
  classes: StudentClass[];
  fixtures: Fixture[];
  matches: MatchHistoryRecord[];
  history: MatchHistoryRecord[];
  games: {
    sudoku: string[];
    kendoku: string[];
    apartman: string[];
    resfebe: string[];
  };
}

// Game Puzzles
export interface SudokuPuzzle {
  sol: number[][];
  puzzle: number[][];
}

export interface KendokuCage {
  cells: [number, number][];
  op: '+' | '−' | '×' | '=' | '÷';
  target: number;
}

export interface KendokuPuzzle {
  sol: number[][];
  cages: KendokuCage[];
}

export interface ApartmanPuzzle {
  sol: number[][];
  top: number[];
  bottom: number[];
  left: number[];
  right: number[];
}

export interface RebusPuzzle {
  display: string;
  answer: string;
  source: string;
}

export type GameType = 'sudoku' | 'kendoku' | 'apartman' | 'resfebe' | 'blitz';
