import type { Course, Question } from '../types';
import { correctAnswer } from './competition';

export const crests = { ts: 'Trabzonspor', bjk: 'Beşiktaş', gs: 'Galatasaray', fb: 'Fenerbahçe' } as const;
export type Crest = keyof typeof crests;
export type Profile = { name: string; grade: string; branch: string; crest: Crest; photo: string };
export type Attempt = { grade: string; course: Course; outcome: string; outcomeCode?: string; status: 'correct' | 'wrong' | 'blank' };
export const resultLabels = { solo: 'Hızlı Maç', duel: 'Mini Düello', team: 'Takım Maçı', online: 'Çevrim İçi Düello', practice: 'Antrenman' } as const;
export type StudentResult = {
  id: string; kind: keyof typeof resultLabels; date: string; scored: number; conceded?: number;
  points?: number; total: number; attempts: Attempt[];
};
export type Account = { accountKey: string; profile: Profile | null; results: StudentResult[] };
export function studentAttempt(question: Question, answer: string): Attempt {
  return {
    grade: String(question.grade), course: question.course ?? 'mathematics', outcome: question.outcome ?? question.subject, outcomeCode: question.outcomeCode,
    status: !answer.trim() ? 'blank' : correctAnswer(question, answer) ? 'correct' : 'wrong',
  };
}
export type Skill = Omit<Attempt, 'status'> & { key: string; correct: number; wrong: number; blank: number };
export function skillStats(results: StudentResult[]): Skill[] {
  const map = new Map<string, Skill>();
  for (const result of results) {
    if (result.kind === 'team') continue;
    for (const { grade, course, outcome, outcomeCode, status } of result.attempts) {
      const key = JSON.stringify([grade, course, outcomeCode ?? outcome]);
      const skill = map.get(key) ?? { key, grade, course, outcome, outcomeCode, correct: 0, wrong: 0, blank: 0 };
      skill[status]++;
      map.set(key, skill);
    }
  }
  return [...map.values()].sort((a, b) => b.wrong + b.blank - a.wrong - a.blank);
}
export async function studentApi<T>(path = '', body?: Profile | StudentResult, accountKey?: string): Promise<T> {
  const response = await fetch('/api/student' + path, {
    method: body ? 'POST' : 'GET', cache: 'no-store', signal: AbortSignal.timeout(12000),
    headers: body ? { 'Content-Type': 'application/json', ...(accountKey ? { 'X-Student-Account': accountKey } : {}) } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}
