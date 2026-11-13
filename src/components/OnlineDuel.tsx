import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { Course, Figure, MatchSettings } from '../types';
import type { Attempt, Profile, StudentResult } from '../utils/student';
import { courseName, defaults } from '../utils/competition';
import { AnswerField, CompetitionSettings, Diagram, Timer } from './CompetitionControls';

const legacyEndpoint = 'https://zeka-pro-ligi.ahmedkadiri99-33c.workers.dev';
const cloudflare = import.meta.env.MODE === 'cloudflare';
const hostedDuel = cloudflare || import.meta.env.MODE === 'sites';
const sessionKey = 'zeka-pro-ligim-online-duel';
const button = 'rounded-xl bg-cyan-200 px-4 py-2.5 text-sm font-bold text-cyan-950 disabled:opacity-50';
const secondary = 'rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold disabled:opacity-50';
const input = 'block w-full rounded-xl border border-white/15 bg-[#0e1530] px-3 py-2.5 text-white';
const errors: Record<string, string> = {
  CODE_NOT_FOUND: 'Bu düello kodu bulunamadı.',
  MATCH_ALREADY_STARTED: 'Bu düello zaten başladı.',
  MATCH_FULL: 'Düello odası dolu.',
  BOTH_NOT_READY: 'İki oyuncunun da hazır olması gerekiyor.',
  ALREADY_ANSWERED: 'Bu soruya zaten cevap verdin.',
  NOT_FOUND: 'Düello artık açık değil.',
  NOT_WAITING: 'Düello bekleme aşamasını geçti.',
  NOT_PLAYING: 'Düello şu anda cevap kabul etmiyor.',
  QUESTION_CHANGED: 'Yeni soruya geçildi.',
  SERVICE_UNAVAILABLE: 'Düello sunucusu şu anda hazır değil.',
  BUSY: 'Düello sunucusu meşgul. Biraz sonra tekrar dene.',
  HOST_ONLY: 'Düelloyu yalnızca odayı açan oyuncu başlatabilir.',
  404: 'Düello artık açık değil.',
  401: 'Düello oturumu sona erdi.',
  UNAUTHORIZED: 'Düello oturumu sona erdi.',
};

interface Session { duelId: string; playerToken: string; code: string; backend?: 'sites' }
const roomCodePattern = /^\d{6}$/;

export function getDuelInviteCode() {
  const code = new URLSearchParams(window.location.search).get('duello') || '';
  return roomCodePattern.test(code) ? code : '';
}
interface Player { slot: number; name: string; ready: boolean; me: boolean; score: number; correct: number }
interface Room {
  code: string;
  grade?: number;
  forfeitWinner?: number;
  status: 'waiting' | 'playing' | 'finished';
  players: Player[];
  current: number;
  total?: number;
  settings?: MatchSettings;
  deadline?: number;
  serverNow?: number;
  attempts?: Attempt[];
  question?: { q: string; subject?: string; category?: 'context' | 'adaptation'; course?: Course; outcomeCode?: string; options?: string[]; figure?: Figure };
  submitted?: Record<number, boolean>;
}

class DuelError extends Error {
  constructor(readonly code: string) {
    super(errors[code] || 'Düello sunucusu isteği tamamlayamadı.');
  }
}

async function request<T>(path: string, backend?: 'sites', token?: string, body?: object, cancel?: AbortSignal): Promise<T> {
  const headers = new Headers();
  if (body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('X-Player-Token', token);
  const response = await fetch((backend === 'sites' ? '' : legacyEndpoint) + path, {
    method: body ? 'POST' : 'GET', headers, body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    signal: cancel ? AbortSignal.any([cancel, AbortSignal.timeout(10000)]) : AbortSignal.timeout(10000),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data || data.error) throw new DuelError(data?.error || String(response.status));
  return data;
}

function readSession(): Session | null {
  try {
    const session = JSON.parse(sessionStorage.getItem(sessionKey) || 'null');
    if (cloudflare && session?.backend !== 'sites') return null;
    if (typeof session?.duelId === 'string' && typeof session?.playerToken === 'string') return session;
  } catch {}
  return null;
}

export function OnlineDuel({ profile, onRecord }: { profile?: Profile | null; onRecord?: (result: StudentResult) => void }) {
  const [session, setSession] = useState(readSession);
  const [room, setRoom] = useState<Room>();
  const [name, setName] = useState(profile?.name.slice(0, 24) ?? '');
  const [grade, setGrade] = useState(profile?.grade ?? '8');
  const [settings, setSettings] = useState(defaults);
  const [deadline, setDeadline] = useState<number>();
  const recorded = useRef('');
  const [code, setCode] = useState(getDuelInviteCode);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [connectionLost, setConnectionLost] = useState(false);
  const [refreshTick, refreshRoom] = useState(0);
  const [acceptedQuestion, setAcceptedQuestion] = useState<number>();
  const [inviteCopied, setInviteCopied] = useState(false);
  const actionInFlight = useRef(false);
  const me = room?.players.find(player => player.me);
  const submitted = Boolean(me && room?.submitted?.[me.slot]) ||
    (acceptedQuestion !== undefined && acceptedQuestion === room?.current);
  const finishedPlayers = room?.status === 'finished' ? [...room.players].sort((a, b) => b.score - a.score) : [];
  const winner = room?.forfeitWinner === undefined
    ? finishedPlayers[0] : finishedPlayers.find(player => player.slot === room.forfeitWinner);
  const draw = room?.forfeitWinner === undefined && winner && finishedPlayers[1]?.score === winner.score;

  function saveSession(next: Session | null) {
    try {
      if (next) sessionStorage.setItem(sessionKey, JSON.stringify(next));
      else sessionStorage.removeItem(sessionKey);
    } catch {}
    setAcceptedQuestion(undefined);
    setInviteCopied(false);
    setConnectionLost(false);
    setSession(next);
  }

  useEffect(() => {
    if (!session || room?.status === 'finished') return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    const refresh = async () => {
      try {
        const current = await request<Room>('/duel/' + encodeURIComponent(session.duelId), session.backend, session.playerToken, undefined, controller.signal);
        if (!controller.signal.aborted) {
          setRoom(current);
          setDeadline(current.deadline !== undefined && current.serverNow !== undefined
            ? Date.now() + current.deadline - current.serverNow : undefined);
          setConnectionLost(false);
        }
      } catch (failure) {
        if (controller.signal.aborted) return;
        if (failure instanceof DuelError && ['NOT_FOUND', 'UNAUTHORIZED', '401', '404'].includes(failure.code)) {
          saveSession(null);
          setRoom(undefined);
          setError(failure.message);
          return;
        }
        setConnectionLost(true);
      }
      if (!controller.signal.aborted) timer = setTimeout(refresh, 1200);
    };
    void refresh();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [session, refreshTick, room?.status === 'finished']);

  useEffect(() => { setAnswer(''); }, [room?.current]);
  const recordFinished = useEffectEvent(() => {
    if (!onRecord || !session || !me || room?.status !== 'finished' || !room.total || !room.attempts || recorded.current === session.duelId) return;
    recorded.current = session.duelId;
    onRecord({ id: 'online-' + session.duelId, kind: 'online', scored: me.correct, points: me.score,
      conceded: room.players.find(p => !p.me)?.correct, total: room.total, attempts: room.attempts, date: new Date().toISOString() });
  });
  useEffect(() => { recordFinished(); }, [room, session, onRecord]);

  async function run(action: () => Promise<void>) {
    if (actionInFlight.current) return;
    actionInFlight.current = true;
    setError('');
    setBusy(true);
    try { await action(); }
    catch (failure) {
      setError(failure instanceof DuelError ? failure.message : 'Düello sunucusuna bağlanılamadı. Biraz sonra tekrar dene.');
    } finally {
      actionInFlight.current = false;
      setBusy(false);
    }
  }

  function enter(join: boolean) {
    void run(async () => {
      const legacyInvite = join && getDuelInviteCode() === code &&
        new URLSearchParams(window.location.search).get('duel-v') !== '2';
      const backend = hostedDuel && (cloudflare || !legacyInvite) ? 'sites' : undefined;
      const result = await request<Session>(
        join ? '/duel/join' : '/duel/create', backend, undefined,
        join ? { name: name.trim(), code } : { name: name.trim(), grade, settings },
      );
      if (!result.duelId || !result.playerToken) throw new DuelError('INVALID_RESPONSE');
      saveSession({ ...result, backend });
    });
  }

  function move(action: 'ready' | 'start' | 'answer' | 'leave', payload: object = {}) {
    if (!session || (action !== 'leave' && (connectionLost || !room)) || (action === 'answer' && submitted)) return;
    void run(async () => {
      try {
        if (action !== 'leave' || room?.status !== 'finished') {
          await request('/duel/' + action, session.backend, session.playerToken, { duelId: session.duelId, ...payload });
        }
        if (action === 'answer') setAcceptedQuestion(room?.current);
      } catch (failure) {
        if (action === 'answer' && failure instanceof DuelError && failure.code === 'ALREADY_ANSWERED') {
          setAcceptedQuestion(room?.current);
        } else if (action !== 'leave' || !(failure instanceof DuelError) ||
          !['NOT_FOUND', 'UNAUTHORIZED', '401', '404'].includes(failure.code)) {
          throw failure;
        }
      } finally {
        refreshRoom(tick => tick + 1);
      }
      if (action === 'leave') {
        saveSession(null);
        setRoom(undefined);
        setAnswer('');
      }
    });
  }

  async function copyInvite() {
    if (!session) return;
    const url = new URL(window.location.href);
    url.searchParams.set('duello', room?.code || session.code);
    if (session.backend === 'sites') url.searchParams.set('duel-v', '2');
    else url.searchParams.delete('duel-v');
    try {
      await navigator.clipboard.writeText(url.href);
      setInviteCopied(true);
    } catch {
      setError('Bağlantı kopyalanamadı. Oda kodunu paylaşabilirsin.');
    }
  }

  return (
    <section className="league-panel space-y-4" aria-label="Çevrim İçi Düello">
      <div>
        <h3 className="text-lg font-black">Çevrim İçi Düello</h3>
        <p className="mt-1 text-sm text-slate-300">İki farklı cihazdan oda koduyla yarış.</p>
      </div>
      {!session ? (
        <form className="space-y-3" onSubmit={event => { event.preventDefault(); if (roomCodePattern.test(code) && name.trim().length >= 2) enter(true); }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-semibold">Rumuz<input className={input} value={name} onChange={event => setName(event.target.value)} maxLength={24} autoComplete="off" /></label>
            <label className="space-y-1 text-sm font-semibold">Oda kodu<input className={input} value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" maxLength={6} autoComplete="off" /></label>
          </div>
          {hostedDuel && <label className="block space-y-1 text-sm font-semibold">Yeni oda için sınıf
            <select className={input} value={grade} onChange={event => { setGrade(event.target.value); setSettings(previous => ({ ...previous, outcomeCode: undefined })); }}>
              {[5, 6, 7, 8].map(level => <option key={level} value={level}>{level}. sınıf</option>)}
            </select>
          </label>}
          {hostedDuel && <CompetitionSettings settings={settings} onChange={setSettings} grade={grade} />}
          <div className="flex flex-wrap gap-2">
            <button className={button} type="button" onClick={() => enter(false)} disabled={busy || name.trim().length < 2}>Düello Oluştur</button>
            <button className={secondary} type="submit" disabled={busy || code.length !== 6 || name.trim().length < 2}>Koda Katıl</button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {!room && <p role="status">Odaya bağlanılıyor…</p>}
          {room?.status === 'waiting' && (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <p>Oda kodu <strong className="ml-2 font-mono text-2xl tracking-widest text-cyan-200">{room.code || session.code}</strong></p>
                <button className={secondary} onClick={() => void copyInvite()}>{inviteCopied ? 'Bağlantı Kopyalandı' : 'Davet Bağlantısını Kopyala'}</button>
              </div>
              {room.grade && <p className="text-sm text-cyan-200">{room.grade}. sınıf · {room.total ?? 5} soru{room.settings && ' · ' + courseName(room.settings.course, room.grade)}</p>}
              <ul className="space-y-1 text-sm">{room.players.map(player => <li key={player.slot}>{player.name} · {player.ready ? 'Hazır' : 'Bekliyor'}</li>)}</ul>
              <div className="flex flex-wrap gap-2">
                <button className={button} disabled={busy || connectionLost || !me} onClick={() => move('ready', { ready: !me?.ready })}>{me?.ready ? 'Hazır Değilim' : 'Hazırım'}</button>
                {me && Number(me.slot) === 0 && <button className={secondary} disabled={busy || connectionLost || room.players.length !== 2 || !room.players.every(player => player.ready)} onClick={() => move('start')}>Başlat</button>}
              </div>
            </>
          )}
          {room?.status === 'playing' && room.question && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-extrabold">Soru {Number(room.current) + 1} / {room.total ?? 5}{room.question.course && ' · ' + courseName(room.question.course, room.grade)}</h4><Timer deadline={deadline} /></div>
              <ul className="flex flex-wrap gap-2 text-sm">
                {room.players.map(player => <li key={player.slot} className="rounded-lg bg-[#101732] px-3 py-2">{player.name} · {player.score} puan</li>)}
              </ul>
              {room.question.category === 'adaptation' && <p className="text-xs font-semibold text-cyan-200">Kaynak uyarlaması</p>}
              <p className="rounded-xl bg-[#101732] p-4">{room.question.q}</p>
              {room.question.outcomeCode && <p className="text-xs font-semibold text-sky-200">{room.question.outcomeCode}</p>}
              <Diagram figure={room.question.figure} />
              {submitted ? <p role="status">Cevabın alındı. Rakibin cevabı bekleniyor.</p> : (
                <form className="space-y-2" onSubmit={event => { event.preventDefault(); if (answer.trim()) move('answer', { answer: answer.trim(), questionIndex: room.current }); }}>
                  <AnswerField label="Cevabın" value={answer} onChange={setAnswer} options={room.question.options} />
                  <button className={button} disabled={busy || connectionLost || !answer.trim()}>Cevabı Gönder</button>
                </form>
              )}
            </>
          )}
          {room?.status === 'finished' && (
            <div role="status">
              <h4 className="font-black">Düello Tamamlandı</h4>
              {winner && <p className="font-bold text-cyan-200">{draw ? 'Beraberlik' : `Kazanan: ${winner.name}`}</p>}
              {room.forfeitWinner !== undefined && <p>Rakip odadan ayrıldı.</p>}
              {finishedPlayers.map(player => <p key={player.slot}>{player.name} · {player.score} puan · {player.correct} doğru</p>)}
            </div>
          )}
          <button className={secondary} disabled={busy} onClick={() => move('leave')}>{room?.status === 'finished' ? 'Yeni Düelloya Dön' : 'Odadan Ayrıl'}</button>
        </div>
      )}
      {connectionLost && <p role="status" className="text-sm text-amber-200">Bağlantı kesildi. Odaya yeniden bağlanılıyor…</p>}
      {error && <p role="alert" className="text-sm text-amber-200">{error}</p>}
    </section>
  );
}
