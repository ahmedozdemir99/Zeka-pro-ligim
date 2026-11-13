import type { Question } from '../types';
import { allQuestions } from './questionsData';

export function shuffle<T>(array: readonly T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function pickQuestions(
  grade: string,
  difficulty: Question['difficulty'] | 'mixed' = 'mixed',
  count: 5 | 10 = 10,
  bank: Question[] = allQuestions,
) {
  const gradePool = bank.filter(question => String(question.grade) === grade);
  const pool = [...new Map((gradePool.length ? gradePool : bank).map(q => [q.q, q])).values()];
  if (difficulty !== 'mixed') {
    return shuffle(pool.filter(question => question.difficulty === difficulty)).slice(0, count);
  }

  const limits = count === 5 ? { kolay: 1, orta: 2, zor: 2 } : { kolay: 3, orta: 3, zor: 4 };
  const chosen: Question[] = [];
  const used = new Set<string>();
  const candidates = shuffle(pool);
  const pick = (predicate: (question: Question) => boolean) => {
    const question = candidates.find(item =>
      limits[item.difficulty] > 0 && !used.has(item.family || item.q) && predicate(item)
    );
    if (!question) return false;
    limits[question.difficulty]--;
    chosen.push(question);
    used.add(question.family || question.q);
    return true;
  };

  const hasPisa = pick(question => question.category === 'adaptation' && Boolean(question.source?.startsWith('PISA')));
  pick(question => question.category === 'adaptation' && !question.source?.startsWith('PISA'));
  if (!hasPisa) pick(question => question.category === 'adaptation');
  pick(question => question.category === 'context');
  pick(question => question.category === 'context');
  while (chosen.length < count && pick(() => true)) {}
  return shuffle(chosen);
}

export function isCorrectAnswer(answer: string, expected: string) {
  const normalize = (value: string) => value.trim().toLocaleLowerCase('tr-TR').replace(/\s+/g, '');
  const given = normalize(answer);
  const key = normalize(expected);
  if (given === key) return true;

  const decimal = /^[+−-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/;
  const parse = (value: string) => Number(value.replace('−', '-').replace(',', '.'));
  return decimal.test(given) && decimal.test(key) && parse(given) === parse(key);
}
