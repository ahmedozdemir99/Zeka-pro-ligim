import type { Course, MatchSettings, Question } from '../types';
import { reviewedQuestions } from './tymmBank';
import { mathOutcomeQuestions } from './mathOutcomes';
import { courseBank } from './courseBank';
import { isCorrectAnswer, pickQuestions, shuffle } from './matchQuestions';
import { allQuestions } from './questionsData';

export const courses = ['turkish', 'mathematics', 'science', 'social', 'religion', 'english'] as const;
export const times = [0, 30, 60, 90, 120] as const;
const names = { all: 'Tüm Dersler', turkish: 'Türkçe', mathematics: 'Matematik', science: 'Fen Bilimleri',
  social: 'Sosyal Bilgiler', religion: 'Din Kültürü ve Ahlak Bilgisi', english: 'İngilizce' };
export const courseName = (course: MatchSettings['course'], grade: string | number = 8) =>
  course === 'social' && Number(grade) === 8 ? 'T.C. İnkılap Tarihi ve Atatürkçülük' : names[course];
export const defaults: MatchSettings = { course: 'mathematics', format: 'open', seconds: 0 };
export function validSettings(value: unknown): value is MatchSettings {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as MatchSettings;
  return (candidate.course === 'all' || courses.includes(candidate.course)) &&
    ['open', 'multiple'].includes(candidate.format) && times.some(seconds => seconds === candidate.seconds) &&
    (candidate.outcomeCode === undefined || (candidate.course !== 'all' && typeof candidate.outcomeCode === 'string' && candidate.outcomeCode.length <= 30));
}
const reviewedMath = allQuestions.flatMap(q => {
  const grade = Number(q.grade);
  const label = q.subject.toLocaleLowerCase('tr');
  let outcomeCode: string | undefined;
  if (grade === 5 && /doğal sayı|zaman|işlem stratejisi/.test(label)) outcomeCode = 'MAT.5.1.2';
  if (grade === 6 && /ondalık/.test(label)) outcomeCode = 'MAT.6.1.7';
  if (grade === 6 && /ortak kat/.test(label)) outcomeCode = 'MAT.6.1.4';
  if (grade === 7 && /rasyonel/.test(label)) outcomeCode = 'MAT.7.1.4';
  if (grade === 8 && /pisagor/.test(label)) outcomeCode = 'M.8.3.1.5';
  if (!outcomeCode) return [];
  const outcome = mathOutcomeQuestions.find(question => question.outcomeCode === outcomeCode)?.outcome;
  return [{ ...q, course: 'mathematics' as const, outcomeCode, outcome }];
});
export const competitionBank = [
  ...reviewedQuestions, ...mathOutcomeQuestions, ...reviewedMath,
  ...courseBank,
];
export const poolFor = (grade: string | number, course: Course) => [...new Map(competitionBank
  .filter(q => Number(q.grade) === Number(grade) && q.course === course)
  .map(q => [q.q + JSON.stringify(q.figure ?? null), q])).values()];
export function outcomesFor(grade: string | number, course: Course) {
  return [...new Map(poolFor(grade, course).flatMap(q => q.outcomeCode && q.outcome ? [[q.outcomeCode, q.outcome] as const] : [])).entries()];
}

export function answerOptions(q: Question): string[] | undefined {
  if (q.distractors) return shuffle([q.a, ...q.distractors]);
  const fraction = /^(-?\d+)\s*\/\s*([1-9]\d*)$/.exec(q.a);
  if (fraction && Number(fraction[1]) !== 0) {
    const n = Number(fraction[1]), d = Number(fraction[2]);
    return shuffle([q.a, ...[1, 2, 3].map(i => `${n}/${d + i}`)]);
  }
  if (/^-?\d+(?:[.,]\d+)?$/.test(q.a)) {
    const number = Number(q.a.replace(',', '.')), precision = q.a.split(/[.,]/)[1]?.length ?? 0;
    const step = 10 ** -precision;
    return shuffle([q.a, ...[1, 2, 3].map(i => (number + i * step).toFixed(precision).replace('.', ','))]);
  }
  if (q.a === 'Satürn') return shuffle([q.a, 'Jüpiter', 'Uranüs', 'Neptün']);
}
export function correctAnswer(q: Question, value: string) {
  if (!value.trim() || (q.options && !q.options.includes(value.trim()))) return false;
  const clean = (answer: string) => answer.trim().replace(/[.!?]$/, '');
  return [q.a, ...(q.alternatives ?? [])].some(answer => q.course === 'english'
    ? clean(value).toLowerCase() === clean(answer).toLowerCase() : isCorrectAnswer(clean(value), clean(answer)));
}
export function competitionQuestions(grade: string, count: 5 | 10, settings: MatchSettings) {
  function choose(course: Course, size: number) {
    const pool = poolFor(grade, course).flatMap(question => {
      if (settings.outcomeCode && question.outcomeCode !== settings.outcomeCode) return [];
      if (settings.format === 'open') return [question];
      const options = answerOptions(question);
      return options?.length === 4 ? [{ ...question, options }] : [];
    });
    if (settings.outcomeCode || course !== 'mathematics') return shuffle(pool).slice(0, size);
    const figure = shuffle(pool.filter(q => q.figure))[0];
    if (size <= 2) return figure ? [figure, ...shuffle(pool.filter(q => !q.figure)).slice(0, size - 1)] : shuffle(pool).slice(0, size);
    const selected = pickQuestions(grade, 'mixed', size === 10 ? 10 : 5, pool);
    if (figure && !selected.some(q => q.figure)) {
      const replace = selected.findIndex(q => q.category !== 'adaptation' && q.difficulty === figure.difficulty);
      if (replace >= 0) selected[replace] = figure;
      else if (selected.length < size) selected.push(figure);
      else selected[selected.length - 1] = figure;
    }
    const used = new Set(selected);
    const fill = shuffle(pool.filter(q => !used.has(q) && (!q.figure || !selected.some(item => item.figure))));
    return [...selected, ...fill.slice(0, size - selected.length)];
  }
  return settings.course === 'all'
    ? shuffle(courses.flatMap(course => choose(course, count === 10 ? 2 : 1)))
    : choose(settings.course, count);
}
