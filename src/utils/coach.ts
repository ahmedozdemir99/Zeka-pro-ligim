import type { Question } from '../types';
import { allQuestions } from './questionsData';
import { shuffle } from './matchQuestions';

export async function requestCoach(operation: string, body: object) {
  const response = await fetch('/api/ai/' + operation, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('Gemini bağlantısı kurulamadı.');
  return response.json();
}

function poolFor(grade: string, difficulty: Question['difficulty']) {
  return allQuestions.filter(question =>
    String(question.grade) === grade && question.difficulty === difficulty && question.explanation
  );
}

export function coachTopics(grade: string, difficulty: Question['difficulty']) {
  return [...new Set(poolFor(grade, difficulty).map(question => question.subject.split(' • ')[0]))]
    .sort((a, b) => a.localeCompare(b, 'tr'));
}

export function localCoachQuestion(grade: string, difficulty: Question['difficulty'], topic: string, recent: string[]) {
  const pool = poolFor(grade, difficulty);
  const normalize = (text: string) => text.trim().toLocaleLowerCase('tr-TR').normalize('NFC');
  const selected = normalize(topic);
  const matches = selected
    ? pool.filter(question => normalize(question.subject).includes(selected))
    : pool;
  const unused = matches.filter(question => !recent.includes(question.q));
  const alternatives = matches.filter(question => question.q !== recent.at(-1));
  return shuffle(unused.length ? unused : alternatives.length ? alternatives : matches)[0];
}
