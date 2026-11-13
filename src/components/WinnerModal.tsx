import { formatMatchScore, matchScore } from '../utils/matchScore';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';
import type { MatchState } from '../types';
import { correctAnswer } from '../utils/competition';
import { Diagram } from './CompetitionControls';
import { sound } from '../utils/sound';

export function WinnerModal({ match, onClose }: { match: MatchState; onClose: () => void }) {
  const solo = match.mode === 'solo';
  const draw = match.correct1 === match.correct2;
  const winner = match.correct1 > match.correct2 ? match.p1 : match.p2;

  useEffect(() => {
    sound.playFanfare();
    if ((solo ? match.correct1 > 0 : !draw) && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 }, colors: ['#8edaff', '#a52655', '#fbf3f7'] });
    }
  }, [draw, match.correct1, solo]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm" onKeyDown={event => { if (event.key === 'Escape') onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="match-result-title" className="league-panel max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto">
        <div className="league-scoreboard space-y-3 text-center">
          <h2 id="match-result-title" className="flex items-center justify-center gap-2 text-xl font-black"><Trophy size={21} className="text-rose-200" aria-hidden="true" /> Maç Sonucu</h2>
          <p className="league-score">{formatMatchScore(matchScore(match.correct1, match.questions.length))}{!solo && ` – ${formatMatchScore(matchScore(match.correct2, match.questions.length))}`} <span className="text-sm">/ 100</span></p>
          <p className="break-words text-sm font-bold">{solo ? `${match.correct1} / ${match.questions.length} doğru` : `${match.p1} · ${match.p2}`}</p>
          {!solo && <p className="text-sm font-bold text-sky-200">{draw ? 'Beraberlik · İki tarafa 1 puan' : `${winner} kazandı · 3 lig puanı`}</p>}
        </div>
        <details>
          <summary className="cursor-pointer font-bold">Cevapları ve Çözümleri İncele</summary>
          <ol className="mt-3 space-y-2">
            {match.questions.map((question, index) => {
              const showAnswer = (answer: string | undefined, name: string) => (
                <p className="mt-1 text-sm text-slate-200">{name} · {answer || 'Pas'}
                  <span className={correctAnswer(question, answer || '') ? 'text-sky-200' : 'text-rose-200'}>
                    {correctAnswer(question, answer || '') ? ' · Doğru' : answer ? ' · Yanlış' : ''}
                  </span>
                </p>
              );
              return (
                <li key={index}>
                  <details className="rounded-xl border border-white/10 bg-black/15 p-3">
                    <summary className="cursor-pointer text-sm font-bold">{index + 1}. soru · {question.subject}</summary>
                    <p className="mt-2 text-sm">{question.q}</p><Diagram figure={question.figure} />
                    {showAnswer(match.answers1[index], match.p1)}
                    {!solo && showAnswer(match.answers2[index], match.p2)}
                    <p className="mt-2 text-sm font-bold text-sky-200">Doğru cevap · {question.a}</p>
                    <p className="mt-1 text-sm text-slate-200">{question.explanation}</p>
                    {question.sourceUrl && <a href={question.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-cyan-200 underline">Uyarlama kaynağı · {question.source} ↗</a>}
                  </details>
                </li>
              );
            })}
          </ol>
        </details>
        <button type="button" autoFocus className="league-primary w-full" onClick={onClose}>Maç Merkezine Dön</button>
      </div>
    </div>
  );
}
