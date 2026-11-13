import { useState } from 'react';
import type { Question } from '../types';
import { isCorrectAnswer, pickQuestions } from '../utils/matchQuestions';

const difficulties = { mixed: 'Karışık', kolay: 'Kolay', orta: 'Orta', zor: 'Zor' } as const;
const panel = 'rounded-3xl border border-white/10 bg-[#171f42] p-5 sm:p-6';
const field = 'block w-full mt-2 rounded-xl border border-white/15 bg-[#0e1530] px-3 py-3 text-white';
const primary = 'rounded-xl bg-violet-300 px-5 py-3 text-sm font-extrabold text-[#1a1231] hover:bg-violet-200';
const secondary = 'rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white hover:bg-white/10';

interface Round {
  grade: string;
  questions: Question[];
  answers: { value: string; correct: boolean }[];
}

export function TrainingSection({ onComplete }: { onComplete: (grade: string, correct: number, total: number) => void }) {
  const [grade, setGrade] = useState('5');
  const [difficulty, setDifficulty] = useState<keyof typeof difficulties>('mixed');
  const [round, setRound] = useState<Round | null>(null);
  const [answer, setAnswer] = useState('');
  const question = round?.questions[round.answers.length];

  const recordAnswer = (value: string) => {
    if (!round || !question) return;
    const answers = [...round.answers, { value, correct: Boolean(value) && isCorrectAnswer(value, question.a) }];
    setRound({ ...round, answers });
    setAnswer('');
    if (answers.length === round.questions.length) {
      onComplete(round.grade, answers.filter(item => item.correct).length, answers.length);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-4" aria-label="Matematik antrenmanı">
      <div className={panel}>
        <h2 className="text-2xl font-black sm:text-3xl">Matematik Antrenmanı</h2>
        <p className="mt-2 text-sm text-slate-300">Sınıf listesi oluşturmadan 10 soru çöz. Tur sonunda cevaplarını incele.</p>
      </div>

      {!round && (
        <form className={panel + ' space-y-4'} onSubmit={event => {
          event.preventDefault();
          setRound({ grade, questions: pickQuestions(grade, difficulty), answers: [] });
        }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">Sınıf düzeyi
              <select className={field} value={grade} onChange={event => setGrade(event.target.value)}>
                {[5, 6, 7, 8].map(value => <option key={value} value={value}>{value}. sınıf</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">Zorluk
              <select className={field} value={difficulty} onChange={event => setDifficulty(event.target.value as keyof typeof difficulties)}>
                {Object.entries(difficulties).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
          <button className={primary} type="submit">10 Soruluk Turu Başlat</button>
        </form>
      )}

      {round && question && (
        <form className={panel + ' space-y-4'} onSubmit={event => {
          event.preventDefault();
          if (answer.trim()) recordAnswer(answer.trim());
        }}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-extrabold" aria-live="polite">Soru {round.answers.length + 1} / {round.questions.length}</h3>
            <span className="rounded-full bg-violet-300/15 px-3 py-1 text-xs font-bold text-violet-200">{difficulties[question.difficulty]}</span>
          </div>
          <progress className="h-2 w-full accent-violet-300" value={round.answers.length} max={round.questions.length} aria-label="Tamamlanan soru sayısı" />
          <p className="text-sm text-teal-200">{question.subject}</p>
          <p className="rounded-xl bg-[#101732] p-4 text-lg font-semibold leading-relaxed">{question.q}</p>
          <label className="block text-sm font-bold">Cevabın
            <input className={field} value={answer} onChange={event => setAnswer(event.target.value)} maxLength={80} autoComplete="off" />
          </label>
          <div className="flex flex-wrap gap-2">
            <button className={primary + ' disabled:opacity-50'} type="submit" disabled={!answer.trim()}>Cevabı Kaydet</button>
            <button className={secondary} type="button" onClick={() => recordAnswer('')}>Soruyu Geç</button>
          </div>
        </form>
      )}

      {round && !question && (
        <div className={panel + ' space-y-4'}>
          <h3 className="text-xl font-extrabold" role="status">Tur Tamamlandı</h3>
          <dl className="grid grid-cols-3 gap-2">
            {[
              ['Doğru', round.answers.filter(item => item.correct).length],
              ['Yanlış', round.answers.filter(item => item.value && !item.correct).length],
              ['Boş', round.answers.filter(item => !item.value).length],
            ].map(([label, count]) => (
              <div key={label} className="rounded-xl bg-[#101732] p-3">
                <dt className="text-xs text-slate-300">{label}</dt>
                <dd className="text-2xl font-black">{count}</dd>
              </div>
            ))}
          </dl>
          <h4 className="font-bold">Cevaplarını İncele</h4>
          {round.questions.map((item, index) => {
            const result = round.answers[index];
            return (
              <details className="border-t border-white/10 pt-3" key={item.q}>
                <summary className="cursor-pointer text-sm font-bold">
                  {index + 1}. Soru · {item.subject.split(' • ')[0]} · {result.correct ? 'Doğru' : result.value ? 'Yanlış' : 'Boş'}
                </summary>
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-200">
                  <p>{item.q}</p>
                  <p>Cevabın <strong>{result.value || '—'}</strong></p>
                  <p>Doğru cevap <strong>{item.a.replace(/^(\d+)\.(\d+)$/, '$1,$2')}</strong></p>
                  {item.explanation && <p>{item.explanation}</p>}
                  {item.sourceUrl && <a className="text-cyan-300 underline" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Uyarlama kaynağı · {item.source} ↗</a>}
                </div>
              </details>
            );
          })}
          <button type="button" className={primary} onClick={() => setRound(null)}>Yeni Tur Seç</button>
        </div>
      )}
    </section>
  );
}
