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
  mode?: 'duel' | 'team';
  teamIds?: [string, string];
}

export type Course = 'turkish' | 'mathematics' | 'science' | 'social' | 'religion' | 'english';
export type MatchSettings = { course: Course | 'all'; format: 'open' | 'multiple'; seconds: number; outcomeCode?: string };
export type Figure = { kind: 'rectangle' | 'triangle'; width: number; height: number; hideWidth?: boolean; diagonal?: boolean } |
  { kind: 'bars'; values: number[] };
export interface Question {
  course?: Course;
  outcome?: string;
  outcomeCode?: string;
  skillBased?: boolean;
  options?: string[];
  distractors?: string[];
  alternatives?: string[];
  figure?: Figure;
  grade: number | string;
  difficulty: 'kolay' | 'orta' | 'zor';
  subject: string;
  q: string;
  a: string;
  source?: string;
  sourceUrl?: string;
  category?: 'context' | 'adaptation';
  family?: string;
  explanation?: string;
}

export interface Team {
  id?: string;
  name: string;
  members: string[];
}

export interface ClassTeam extends Team {
  id: string;
  classId: string;
}

export type MatchSetup = { settings?: MatchSettings } & (
  | { mode: 'solo'; grade: string }
  | { mode: 'duel'; classId: string; p1: string; p2: string; fixtureId?: string }
  | { mode: 'team'; classId: string; team1Id: string; team2Id: string; fixtureId?: string });

export interface MatchState {
  id: string;
  fixtureId?: string;
  classId: string;
  p1: string;
  p2: string;
  mode: 'duel' | 'team' | 'solo';
  team1?: Team;
  team2?: Team;
  index: number;
  settings?: MatchSettings;
  deadline?: number;
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
  teams: ClassTeam[];
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

export type GameType = 'sudoku' | 'kendoku' | 'apartman' | 'resfebe' | 'blitz';
