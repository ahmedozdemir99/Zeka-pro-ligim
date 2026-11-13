import { formatMatchScore, matchScore } from '../utils/matchScore';
import { useState } from 'react';
import type { Question } from '../types';
import { answerOptions, courseName, courses, poolFor } from '../utils/competition';
import { shuffle } from '../utils/matchQuestions';
import { crests, resultLabels, skillStats, studentApi, studentAttempt, type Account, type Attempt, type Crest, type Profile, type Skill, type StudentResult } from '../utils/student';
import { AnswerField, Diagram } from './CompetitionControls';

const empty: Profile = { name: '', grade: '8', branch: '', crest: 'ts', photo: '' };
const dateFormat = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });

async function photoData(file: File) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
    throw new Error('10 MB’a kadar JPG, PNG veya WebP dosyası seç.');
  }
  const image = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 192;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Fotoğraf hazırlanamadı.');
    const side = Math.min(image.width, image.height);
    context.fillStyle = '#fff';
    context.fillRect(0, 0, 192, 192);
    context.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, 192, 192);
    return canvas.toDataURL('image/jpeg', 0.82);
  } finally { image.close(); }
}

function Practice({ skill, onClose, onRecord }: { skill: Skill; onClose: () => void; onRecord: (r: StudentResult) => void }) {
  const [questions] = useState<Question[]>(() => shuffle(poolFor(skill.grade, skill.course)
    .filter(q => skill.outcomeCode ? q.outcomeCode === skill.outcomeCode : q.outcome === skill.outcome)).slice(0, 3).map(q => ({ ...q, options: answerOptions(q) })));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const question = questions[index];
  const attempt = attempts[index];
  function next() {
    if (index + 1 < questions.length) { setIndex(index + 1); setAnswer(''); return; }
    onRecord({ id: crypto.randomUUID(), kind: 'practice', scored: attempts.filter(a => a.status === 'correct').length,
      total: questions.length, attempts, date: new Date().toISOString() });
    onClose();
  }
  return <section id="practice" className="league-panel scroll-mt-48 space-y-3">
    <div className="flex flex-wrap justify-between gap-2"><h3 className="font-black">Kazanım Antrenmanı</h3>
      <button className="league-secondary" onClick={onClose}>Kapat</button></div>
    <p className="text-sm text-sky-200">{skill.outcome}</p>
    {question ? <>
      <p className="text-sm">Soru {index + 1} / {questions.length}</p><p>{question.q}</p><Diagram figure={question.figure} />
      {attempt ? <><p role="status">{attempt.status === 'correct' ? 'Doğru!' : `Doğru cevap: ${question.a}`} {question.explanation}</p>
        <button className="league-primary" onClick={next}>{index + 1 === questions.length ? 'Antrenmanı Kaydet' : 'Sonraki Soru'}</button></>
        : <form className="space-y-3" onSubmit={e => { e.preventDefault(); if (answer.trim()) setAttempts([...attempts, studentAttempt(question, answer)]); }}>
          <AnswerField label="Cevabın" value={answer} onChange={setAnswer} options={question.options} />
          <button className="league-primary" disabled={!answer.trim()}>Kontrol Et</button>
        </form>}
    </> : <p>Bu kazanım için soru bulunamadı.</p>}
  </section>;
}

export function StudentProfile({ account, error, onRetry, onSaved, onRecord, syncError }: {
  account?: Account; error: string; onRetry: () => void; onSaved: (p: Profile) => void;
  onRecord: (r: StudentResult) => void; syncError: boolean;
}) {
  if (!account) return <section className="league-panel space-y-3"><h2 className="league-section-title">Profilim</h2>
    {error === '401' && import.meta.env.MODE === 'cloudflare' ? <p role="alert">Profil için okulunun paylaştığı adresten Cloudflare Access ile giriş yap.</p>
      : error === '401' ? <a className="league-primary" href="/signin-with-chatgpt?return_to=%2F%3Fprofil%3D1" target="_top">ChatGPT ile Giriş Yap</a>
      : error ? <><p role="alert">Profil yüklenemedi.</p><button className="league-secondary" onClick={onRetry}>Yeniden Dene</button></>
      : <p role="status">Profil yükleniyor…</p>}
  </section>;
  return <ProfileForm key={account.accountKey} account={account} onSaved={onSaved} onRecord={onRecord} syncError={syncError} onRetry={onRetry} />;
}

function ProfileForm({ account, onSaved, onRecord, syncError, onRetry }: {
  account: Account; onSaved: (p: Profile) => void; onRecord: (r: StudentResult) => void; syncError: boolean; onRetry: () => void;
}) {
  const [draft, setDraft] = useState(account.profile ?? empty);
  const [editing, setEditing] = useState(!account.profile);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [course, setCourse] = useState('all');
  const [practice, setPractice] = useState<Skill>();
  const [historyLimit, setHistoryLimit] = useState(15);
  const played = account.results.filter(r => r.kind !== 'practice');
  const skills = skillStats(account.results).filter(s => course === 'all' || course === s.course);

  async function save() {
    setBusy(true);
    setMessage('');
    try {
      const { profile } = await studentApi<{ profile: Profile }>('/profile', { ...draft, name: draft.name.trim() }, account.accountKey);
      setDraft(profile); onSaved(profile); setEditing(false); setMessage('Profil kaydedildi.');
    } catch { setMessage('Profil kaydedilemedi. Tekrar dene.'); }
    finally { setBusy(false); }
  }
  return <div className="space-y-4">
    <section className="league-panel space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {draft.photo && <img src={draft.photo} alt="Profil fotoğrafı" className="size-16 rounded-full object-cover" />}
          <div><h2 className="text-xl font-black">{account.profile?.name ?? 'Öğrenci Profili'}</h2>
            {account.profile && <p>{account.profile.grade}. sınıf {account.profile.branch && '· ' + account.profile.branch + ' şubesi'}</p>}</div>
        </div>
        {!editing && <button className="league-secondary" onClick={() => setEditing(true)}>Profili Düzenle</button>}
      </div>
      {editing && <form className="space-y-4" onSubmit={e => { e.preventDefault(); if (!busy) void save(); }}>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="league-field">Ad veya rumuz<input value={draft.name} required minLength={2} maxLength={40}
            onChange={e => setDraft({ ...draft, name: e.target.value })} /></label>
          <label className="league-field">Sınıf<select value={draft.grade} onChange={e => setDraft({ ...draft, grade: e.target.value })}>
            {[5, 6, 7, 8].map(level => <option key={level} value={level}>{level}. sınıf</option>)}
          </select></label>
          <label className="league-field">Şube (isteğe bağlı)<input value={draft.branch} maxLength={8}
            onChange={e => setDraft({ ...draft, branch: e.target.value.toLocaleUpperCase('tr').replace(/[^A-ZÇĞİÖŞÜ0-9-]/gu, '') })} /></label>
        </div>
        <fieldset><legend className="mb-2 font-bold">Takım Arman</legend>
          <div className="grid max-w-md grid-cols-4 gap-2">{(Object.entries(crests) as [Crest, string][]).map(([id, name]) =>
            <button key={id} type="button" aria-label={name} aria-pressed={draft.crest === id} onClick={() => setDraft({ ...draft, crest: id })}
              className={`grid place-items-center rounded-xl border p-2 text-xs font-bold ${draft.crest === id ? 'border-sky-200 bg-sky-200/15' : 'border-white/15'}`}>
              <img src={`/crests/${id}.png`} alt="" className="size-10 object-contain" />{id.toUpperCase()}
            </button>)}</div>
        </fieldset>
        <div className="flex flex-wrap gap-2">
          <label className="league-secondary cursor-pointer focus-within:ring-2">Fotoğraf Yükle
            <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={async e => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (!file) return;
              setBusy(true); setMessage('');
              try { const photo = await photoData(file); setDraft(p => ({ ...p, photo })); }
              catch (error) { setMessage(error instanceof Error ? error.message : 'Fotoğraf hazırlanamadı.'); }
              finally { setBusy(false); }
            }} />
          </label>
          {draft.photo && <button type="button" className="league-secondary" disabled={busy} onClick={() => setDraft({ ...draft, photo: '' })}>Fotoğrafı Kaldır</button>}
        </div>
        <button className="league-primary" disabled={busy || draft.name.trim().length < 2}>Profili Kaydet</button>
      </form>}
      {message && <p role="status" className="text-sky-200">{message}</p>}
    </section>
    {account.profile && <>
      {syncError && <div className="league-panel"><p role="status">Bazı sonuçlar henüz kaydedilemedi.</p><button className="league-secondary" onClick={onRetry}>Yeniden Dene</button></div>}
      <section className="league-panel space-y-3">
        <h3 className="font-black">Maç Sonuçlarım</h3>
        <p className="text-sm">{played.length} maç · {formatMatchScore(played.reduce((sum, r) => sum + matchScore(r.scored, r.total), 0))} toplam puan</p>
        {account.results.length ? <ul className="divide-y divide-white/10">{account.results.slice(0, historyLimit).map(r =>
          <li key={r.id} className="flex flex-wrap justify-between gap-2 py-2 text-sm">
            <div><b>{resultLabels[r.kind]}</b><p className="text-xs text-slate-300">{dateFormat.format(new Date(r.date))}</p></div>
            <b>{r.conceded === undefined ? `${r.scored}/${r.total} doğru` : `${r.scored} – ${r.conceded}`} · {formatMatchScore(matchScore(r.scored, r.total))}/100 puan</b>
          </li>)}</ul> : <p>İlk maçını bitirdiğinde sonucun burada görünecek.</p>}
        {historyLimit < account.results.length && <button className="league-secondary" onClick={() => setHistoryLimit(historyLimit + 15)}>Daha Eski Sonuçlar</button>}
      </section>
      {practice && <Practice key={practice.key} skill={practice} onRecord={onRecord} onClose={() => setPractice(undefined)} />}
      <section className="league-panel space-y-3">
        <h3 className="font-black">Kazanım Durumum</h3>
        <label className="league-field max-w-xs">Ders<select value={course} onChange={e => setCourse(e.target.value)}>
          {(['all', ...courses] as const).map(id => <option key={id} value={id}>{courseName(id, account.profile?.grade)}</option>)}
        </select></label>
        {skills.length ? <ul className="divide-y divide-white/10">{skills.map(skill => <li key={skill.key} className="flex flex-wrap items-center justify-between gap-2 py-3">
          <div><p className="text-xs font-bold text-sky-200">{skill.grade}. sınıf · {courseName(skill.course, skill.grade)}{skill.outcomeCode && ' · ' + skill.outcomeCode}</p><b>{skill.outcome}</b>
            <p className="text-sm">{skill.correct} doğru · {skill.wrong} yanlış · {skill.blank} boş</p></div>
          {skill.correct / (skill.correct + skill.wrong + skill.blank) < 0.8 && <button className="league-secondary" onClick={() => {
            setPractice(skill);
            requestAnimationFrame(() => document.getElementById('practice')?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
          }}>Bu Kazanımı Çalış</button>}
        </li>)}</ul> : <p>Bu seçim için henüz cevap kaydı yok.</p>}
      </section>
    </>}
  </div>;
}
