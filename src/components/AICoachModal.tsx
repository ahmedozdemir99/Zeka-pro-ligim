import { useEffect, useRef, useState } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';
import type { Question } from '../types';
import { coachTopics, localCoachQuestion, requestCoach } from '../utils/coach';
import { sound } from '../utils/sound';

const field = 'mt-1 block w-full rounded-xl border border-white/15 bg-[#171f42] p-2.5 text-white';
type CoachQuestion = Pick<Question, 'q' | 'a' | 'subject' | 'explanation' | 'source' | 'sourceUrl'>;

export function AICoachModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [grade, setGrade] = useState('7');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Question['difficulty']>('orta');
  const [gemini, setGemini] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ question: CoachQuestion; local: boolean }>();
  const [message, setMessage] = useState('');
  const recent = useRef<string[]>([]);
  const topics = coachTopics(grade, difficulty);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setGemini(undefined);
    fetch('/api/ai/status', { signal: AbortSignal.timeout(3500) })
      .then(response => response.ok ? response.json() : null)
      .then(status => { if (active) setGemini(status?.available === true); })
      .catch(() => { if (active) setGemini(false); });
    return () => { active = false; };
  }, [isOpen]);

  if (!isOpen) return null;

  async function generateQuestion() {
    sound.playClick();
    setLoading(true);
    setResult(undefined);
    setMessage('');
    try {
      if (gemini === true) {
        try {
          const question = await requestCoach('generate-question', { grade, topic, difficulty });
          if (!question?.q || !question?.a || !question?.explanation) throw new Error();
          setResult({ question, local: false });
          sound.playSuccess();
          return;
        } catch {
          setMessage('Gemini yanıt vermedi. Uygun soru varsa havuzdan gösteriliyor.');
        }
      }
      const question = localCoachQuestion(grade, difficulty, topic, recent.current);
      if (!question) {
        setMessage('Bu konuda eşleşen soru bulunamadı. Önerilen konulardan birini seç veya konu alanını boş bırak.');
        return;
      }
      recent.current = [...recent.current.slice(-49), question.q];
      setResult({ question, local: true });
      sound.playSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-md" onKeyDown={event => { if (event.key === 'Escape') onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="coach-title" className="relative max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto rounded-3xl border border-purple-500/40 bg-[#171f42] p-5 sm:p-6">
        <button type="button" onClick={onClose} aria-label="Koçu kapat" className="absolute right-3 top-3 rounded-xl bg-white/5 p-2 text-slate-200 hover:bg-white/10">
          <X className="size-5" aria-hidden="true" />
        </button>
        <div className="flex items-start gap-3 pr-9">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-500/30">
            <Bot className="size-6 text-violet-200" aria-hidden="true" />
          </div>
          <div>
            <h3 id="coach-title" className="text-lg font-black">Zekâ Koçu</h3>
            <p className="text-sm text-slate-300">
              {gemini === undefined ? 'Bağlantı kontrol ediliyor…' : gemini ? 'Gemini ile soru oluştur ve çözüm adımlarını incele.' : 'Gemini bağlı değil. Soru havuzundan çözümlü alıştırma seçebilirsin.'}
            </p>
          </div>
        </div>
        <form className="space-y-3 rounded-2xl border border-white/10 bg-[#0e1530] p-4" onSubmit={event => { event.preventDefault(); if (!loading) void generateQuestion(); }}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <label>Sınıf
              <select value={grade} onChange={event => setGrade(event.target.value)} className={field}>
                {[5, 6, 7, 8].map(value => <option key={value} value={value}>{value}. sınıf</option>)}
              </select>
            </label>
            <label>Zorluk
              <select value={difficulty} onChange={event => setDifficulty(event.target.value as Question['difficulty'])} className={field}>
                <option value="kolay">Kolay</option><option value="orta">Orta</option><option value="zor">Zor</option>
              </select>
            </label>
            <label className="col-span-2">Konu
              <input value={topic} onChange={event => setTopic(event.target.value)} list="coach-topics" placeholder="Boş bırakılırsa tüm konular" maxLength={120} className={field} />
              <datalist id="coach-topics">{topics.map(value => <option key={value} value={value} />)}</datalist>
            </label>
          </div>
          <button type="submit" disabled={loading} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-300 px-4 py-2 text-sm font-extrabold text-[#1a1231] hover:bg-violet-200 disabled:opacity-50">
            <Sparkles className="size-4" aria-hidden="true" />
            {loading ? 'Soru hazırlanıyor…' : gemini ? 'Soru Üret' : 'Havuzdan Soru Seç'}
          </button>
        </form>
        {message && <p role="status" className="text-sm text-amber-200">{message}</p>}
        {result && (
          <div className="space-y-3 rounded-2xl border border-purple-400/40 bg-purple-950/40 p-4 text-sm">
            <p className="font-bold text-cyan-200">{result.question.subject} · {result.local ? 'Soru havuzu' : 'Gemini'}</p>
            <p className="rounded-xl bg-[#0b1128] p-3 leading-relaxed">{result.question.q}</p>
            <details key={result.question.q}>
              <summary className="cursor-pointer font-bold text-violet-200">Cevabı ve Çözümü Göster</summary>
              <p className="mt-2 text-emerald-200">Cevap <strong>{result.question.a}</strong></p>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-200">{result.question.explanation}</p>
              {result.question.sourceUrl && <a className="mt-2 inline-block text-cyan-300 underline" href={result.question.sourceUrl} target="_blank" rel="noopener noreferrer">Uyarlama kaynağı · {result.question.source} ↗</a>}
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
