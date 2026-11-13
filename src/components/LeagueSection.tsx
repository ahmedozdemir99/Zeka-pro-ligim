import { useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Flag, Shield, Trophy, User, Users } from 'lucide-react';
import type { ClassTeam, Fixture, MatchHistoryRecord, MatchSetup, MatchState, StudentClass } from '../types';
import { leagueStandings } from '../utils/league';
import { shuffle } from '../utils/matchQuestions';
import { competitionBank, courseName, defaults } from '../utils/competition';
import type { Profile, StudentResult } from '../utils/student';
import { AnswerField, CompetitionSettings, Diagram, Timer } from './CompetitionControls';
import { officialQuestionSources } from '../utils/sourceQuestions';
import { getDuelInviteCode, OnlineDuel } from './OnlineDuel';

type Mode = MatchSetup['mode'];
type TeamDraft = Omit<ClassTeam, 'id'> & { id?: string };

interface LeagueSectionProps {
  classes: StudentClass[];
  profile?: Profile | null;
  onRecordOnline?: (result: StudentResult) => void;
  drafts: [string, string];
  onDraft: (home: string, away: string) => void;
  teams: ClassTeam[];
  fixtures: Fixture[];
  matches: MatchHistoryRecord[];
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  activeMatch: MatchState | null;
  onStartMatch: (setup: MatchSetup) => string | undefined;
  onSubmitAnswer: (ans1: string, ans2?: string) => void;
  onGenerateFixtures: (classId: string, mode: 'duel' | 'team') => string;
  onSaveTeam: (team: TeamDraft) => string;
  onDeleteTeam: (id: string) => void;
  onOpenClasses: () => void;
  onCancelMatch: () => void;
}

const modes = [
  { id: 'solo', title: 'Hızlı Maç', detail: 'Tek oyuncu', icon: User },
  { id: 'duel', title: 'Mini Düello', detail: 'İki öğrenci', icon: Users },
  { id: 'team', title: 'Takım Maçı', detail: 'İki takım', icon: Shield },
] as const;

const uniqueQuestionCount = new Set(competitionBank.map(question => question.q + JSON.stringify(question.figure ?? null))).size;

function MatchBoard({ match, onAnswer, onCancel, drafts, onDraft }: {
  match: MatchState;
  onAnswer: LeagueSectionProps['onSubmitAnswer'];
  onCancel: () => void;
  drafts: [string, string];
  onDraft: (home: string, away: string) => void;
}) {
  const [homeAnswer, setHomeAnswer] = useState(drafts[0]);
  const [awayAnswer, setAwayAnswer] = useState(drafts[1]);
  const solo = match.mode === 'solo';
  const question = match.questions[match.index];
  const title = modes.find(item => item.id === match.mode)?.title;

  return (
    <section className="league-panel mx-auto max-w-3xl space-y-4" aria-label="Oynanan maç">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="league-section-title !mb-0">{title}</h2>
        <button type="button" className="league-secondary" onClick={onCancel}><ArrowLeft size={16} aria-hidden="true" /> Maçtan Ayrıl</button>
      </div>
      <div className="league-scoreboard text-center">
        <Timer deadline={match.deadline} />
        <p className="text-xs font-bold text-sky-100" aria-live="polite">Soru {match.index + 1} / {match.questions.length}</p>
        <div className={`mt-3 grid items-center gap-2 ${solo ? '' : 'grid-cols-[1fr_auto_1fr]'}`}>
          <div className="min-w-0 break-words text-sm font-bold">
            {match.p1}
            {match.team1 && <p className="mt-1 text-xs font-normal text-slate-300">{match.team1.members.join(', ')}</p>}
          </div>
          <div className="league-score" aria-label={solo ? `${match.correct1} gol` : `Skor ${match.correct1} - ${match.correct2}`}>
            {solo ? match.correct1 : `${match.correct1} – ${match.correct2}`}
          </div>
          {solo ? <p className="text-xs text-slate-200">Gol</p> : (
            <div className="min-w-0 break-words text-sm font-bold">
              {match.p2}
              {match.team2 && <p className="mt-1 text-xs font-normal text-slate-300">{match.team2.members.join(', ')}</p>}
            </div>
          )}
        </div>
        <progress className="mt-4 h-2 w-full accent-sky-300" max={match.questions.length} value={match.index} aria-label="Maç ilerlemesi" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-sky-200">{question.course && courseName(question.course, question.grade) + ' · '}{question.outcomeCode && question.outcomeCode + ' · '}{question.subject} · {question.difficulty}
          {question.category === 'adaptation' && ' · Kaynak uyarlaması'}</p>
        <p className="rounded-xl border border-white/10 bg-black/20 p-4 text-base font-semibold leading-relaxed">{question.q}</p>
        <Diagram figure={question.figure} />
      </div>
      <form className="space-y-3" onSubmit={event => {
        event.preventDefault();
        if (homeAnswer.trim() && (solo || awayAnswer.trim())) onAnswer(homeAnswer.trim(), solo ? undefined : awayAnswer.trim());
      }}>
        <div className={`grid gap-3 ${solo ? '' : 'sm:grid-cols-2'}`}>
          <AnswerField label={solo ? 'Cevabın' : `${match.p1} · cevap`} value={homeAnswer} options={question.options}
            onChange={answer => { setHomeAnswer(answer); onDraft(answer, awayAnswer); }} />
          {!solo && <AnswerField label={`${match.p2} · cevap`} value={awayAnswer} options={question.options}
            onChange={answer => { setAwayAnswer(answer); onDraft(homeAnswer, answer); }} />}
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="league-primary" type="submit" disabled={!homeAnswer.trim() || (!solo && !awayAnswer.trim())}>
            {solo ? 'Cevabı Kaydet' : 'İki Cevabı Kaydet'} <ArrowRight size={17} aria-hidden="true" />
          </button>
          {solo && <button type="button" className="league-secondary" onClick={() => onAnswer('')}>Pas Geç</button>}
        </div>
      </form>
    </section>
  );
}

function TeamEditor({ group, teams, onSave, onDelete }: {
  group: StudentClass;
  teams: ClassTeam[];
  onSave: LeagueSectionProps['onSaveTeam'];
  onDelete: LeagueSectionProps['onDeleteTeam'];
}) {
  const [draft, setDraft] = useState<TeamDraft>();
  const [message, setMessage] = useState('');
  const locked = new Set(teams.filter(team => team.id !== draft?.id).flatMap(team => team.members));

  return (
    <section className="league-panel space-y-3" aria-labelledby="league-teams">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="league-teams" className="league-section-title !mb-0">Takım Kadroları</h3>
        <button className="league-secondary" type="button" onClick={() => {
          setMessage('');
          setDraft({ classId: group.id, name: '', members: [] });
        }}>Takım Oluştur</button>
      </div>
      {teams.length === 0 && <p className="text-sm text-slate-300">Bu sınıfta henüz takım yok.</p>}
      <ul className="grid gap-2 sm:grid-cols-2">
        {teams.map(team => (
          <li key={team.id} className="rounded-xl border border-white/10 bg-black/15 p-3">
            <div className="flex items-start gap-2">
              <Shield size={17} className="mt-0.5 shrink-0 text-rose-200" aria-hidden="true" />
              <div className="min-w-0 break-words">
                <p className="font-bold">{team.name}</p>
                <p className="mt-1 text-sm text-slate-300">{team.members.join(', ') || 'Kadro boş'}</p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className="league-secondary" aria-label={`${team.name} takımını düzenle`} onClick={() => { setDraft(team); setMessage(''); }}>Düzenle</button>
              <button type="button" className="league-secondary" aria-label={`${team.name} takımını sil`} onClick={() => {
                if (!confirm(`${team.name} takımı ve bekleyen maçları silinsin mi?`)) return;
                onDelete(team.id);
                if (draft?.id === team.id) setDraft(undefined);
                setMessage('Takım silindi.');
              }}>Sil</button>
            </div>
          </li>
        ))}
      </ul>
      {draft && (
        <form className="space-y-3 rounded-xl border border-rose-200/25 bg-black/20 p-3" onSubmit={event => {
          event.preventDefault();
          const error = onSave(draft);
          setMessage(error || 'Kadro kaydedildi.');
          if (!error) setDraft(undefined);
        }}>
          <label className="league-field">Takım adı
            <input value={draft.name} maxLength={36} required onChange={event => setDraft({ ...draft, name: event.target.value })} />
          </label>
          <fieldset>
            <legend className="mb-2 text-sm font-bold">Kadroya öğrenci ekle</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {group.students.map(student => (
                <label key={student} className={`flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm ${locked.has(student) ? 'opacity-55' : ''}`}>
                  <input type="checkbox" className="size-4 accent-sky-300" disabled={locked.has(student)} checked={draft.members.includes(student)} onChange={event => setDraft({
                    ...draft, members: event.target.checked ? [...draft.members, student] : draft.members.filter(name => name !== student),
                  })} />
                  {student}{locked.has(student) && ' · Başka takımda'}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex gap-2">
            <button type="submit" className="league-primary">Kadroyu Kaydet</button>
            <button type="button" className="league-secondary" onClick={() => { setDraft(undefined); setMessage(''); }}>Vazgeç</button>
          </div>
        </form>
      )}
      {message && <p role="status" className="text-sm text-rose-200">{message}</p>}
    </section>
  );
}

function ClassLeague({ group, mode, teams, fixtures, matches, onStart, onFixtures, onSaveTeam, onDeleteTeam }: {
  group: StudentClass;
  mode: 'duel' | 'team';
  teams: ClassTeam[];
  fixtures: Fixture[];
  matches: MatchHistoryRecord[];
  onStart: LeagueSectionProps['onStartMatch'];
  onFixtures: LeagueSectionProps['onGenerateFixtures'];
  onSaveTeam: LeagueSectionProps['onSaveTeam'];
  onDeleteTeam: LeagueSectionProps['onDeleteTeam'];
}) {
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [message, setMessage] = useState('');
  const teamMode = mode === 'team';
  const options = teamMode ? teams.filter(team => team.members.length > 0) : group.students.map(name => ({ name, id: name }));
  const home = options.find(item => item.id === first)?.id ?? options[0]?.id ?? '';
  const awayOptions = options.filter(item => item.id !== home);
  const away = awayOptions.find(item => item.id === second)?.id ?? awayOptions[0]?.id ?? '';
  const standings = leagueStandings(group, mode, matches, teams);

  function start(a: string, b: string, fixtureId?: string) {
    const error = onStart(teamMode
      ? { mode, classId: group.id, team1Id: a, team2Id: b, fixtureId }
      : { mode, classId: group.id, p1: a, p2: b, fixtureId });
    setMessage(error || '');
  }

  return (
    <div className="space-y-3">
      {teamMode && <TeamEditor group={group} teams={teams} onSave={onSaveTeam} onDelete={onDeleteTeam} />}
      <section className="league-panel space-y-3">
        <h3 className="league-section-title !mb-0">Eşleşme</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="league-field">{teamMode ? 'Ev sahibi takım' : 'Birinci öğrenci'}
            <select value={home} onChange={event => setFirst(event.target.value)} disabled={!options.length}>
              {!options.length && <option value="">Seçenek yok</option>}
              {options.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="league-field">{teamMode ? 'Deplasman takımı' : 'İkinci öğrenci'}
            <select value={away} onChange={event => setSecond(event.target.value)} disabled={!awayOptions.length}>
              {!awayOptions.length && <option value="">Seçenek yok</option>}
              {awayOptions.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
        </div>
        {options.length < 2 && <p className="text-sm text-slate-300">{teamMode ? 'Maç için kadrosu olan iki takım oluştur.' : 'Maç için sınıfa en az iki öğrenci ekle.'}</p>}
        <div className="flex flex-wrap gap-2">
          <button type="button" className="league-primary" disabled={!home || !away} onClick={() => start(home, away)}>Maçı Başlat</button>
          {!teamMode && <button type="button" className="league-secondary" disabled={options.length < 2} onClick={() => {
            const [a, b] = shuffle(options);
            start(a.id, b.id);
          }}>Rastgele Eşleştir</button>}
          <button type="button" className="league-secondary" onClick={() => setMessage(onFixtures(group.id, mode))}>
            <CalendarDays size={17} aria-hidden="true" /> Fikstür Oluştur
          </button>
        </div>
        {message && <p role="status" className="text-sm text-rose-200">{message}</p>}
      </section>
      <section className="league-panel">
        <h3 className="league-section-title">Fikstür</h3>
        {fixtures.length === 0 ? <p className="text-sm text-slate-300">Henüz maç planlanmadı.</p> : (
          <ul className="divide-y divide-white/10">
            {fixtures.map(fixture => {
              const [a, b] = fixture.teamIds ?? [fixture.p1, fixture.p2];
              const name = (id: string, fallback: string) => options.find(item => item.id === id)?.name ?? fallback;
              const available = options.some(item => item.id === a) && options.some(item => item.id === b);
              return (
                <li key={fixture.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span className="text-sm font-bold">{fixture.result || `${name(a, fixture.p1)} – ${name(b, fixture.p2)}`}</span>
                  {fixture.status === 'Tamamlandı' ? <span className="text-xs font-bold text-sky-200">Tamamlandı</span>
                    : <button type="button" className="league-secondary" disabled={!available} onClick={() => start(a, b, fixture.id)}>
                        {available ? 'Fikstür Maçını Başlat' : 'Kadro eksik'}
                      </button>}
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <section className="league-panel">
        <h3 className="league-section-title flex items-center gap-2"><Trophy size={19} className="text-rose-200" aria-hidden="true" /> Lig Puan Durumu</h3>
        <p className="mb-2 text-xs text-slate-300">Galibiyet 3 · Beraberlik 1 · Mağlubiyet 0</p>
        {standings.length === 0 ? <p className="text-sm text-slate-300">Puan durumunda henüz katılımcı yok.</p> : (
          <div className="overflow-x-auto">
            <table className="league-table">
              <thead><tr>
                <th scope="col">{teamMode ? 'Takım' : 'Öğrenci'}</th>
                <th scope="col" title="Oynanan">O</th><th scope="col" title="Galibiyet">G</th>
                <th scope="col" title="Beraberlik">B</th><th scope="col" title="Mağlubiyet">M</th>
                <th scope="col" title="Atılan ve yenilen goller">Gol</th><th scope="col">Averaj</th><th scope="col">Puan</th>
              </tr></thead>
              <tbody>{standings.map((item, index) => (
                <tr key={item.name}>
                  <td><span className="mr-2 text-slate-400">{index + 1}.</span><strong>{item.name}</strong></td>
                  <td>{item.played}</td><td>{item.wins}</td><td>{item.draws}</td><td>{item.losses}</td>
                  <td>{item.scored}:{item.conceded}</td><td>{item.scored - item.conceded}</td><td>{item.points}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export function LeagueSection({
  classes, teams, fixtures, matches, profile, onRecordOnline, drafts, onDraft, mode, onModeChange, activeMatch, onStartMatch,
  onSubmitAnswer, onGenerateFixtures, onSaveTeam, onDeleteTeam, onOpenClasses, onCancelMatch,
}: LeagueSectionProps) {
  const [classId, setClassId] = useState('');
  const [grade, setGrade] = useState(profile?.grade ?? '7');
  const [settings, setSettings] = useState(defaults);
  const group = classes.find(item => item.id === classId) ?? classes[0];
  const invite = getDuelInviteCode();

  if (activeMatch) return <MatchBoard key={`${activeMatch.id}-${activeMatch.index}`} match={activeMatch} onAnswer={onSubmitAnswer} onCancel={onCancelMatch} drafts={drafts} onDraft={onDraft} />;

  return (
    <div className="space-y-4">
      <header className="league-panel flex flex-wrap items-center justify-between gap-2">
        <h2 className="league-section-title !mb-0 flex items-center gap-2"><Flag size={21} className="text-sky-300" aria-hidden="true" /> Maç Merkezi</h2>
        <a className="league-secondary" href="#online-duel">Çevrim İçi Düello ↓</a>
      </header>
      {invite && <div id="online-duel" className="scroll-mt-48"><OnlineDuel profile={profile} onRecord={onRecordOnline} /></div>}
      <div role="group" aria-label="Maç modu" className="grid gap-2 sm:grid-cols-3">
        {modes.map(({ id, title, detail, icon: Icon }) => (
          <button key={id} type="button" className={`league-mode league-mode-${id} !min-h-0`} aria-pressed={mode === id} onClick={() => onModeChange(id)}>
            <Icon size={20} className="league-mode-icon" aria-hidden="true" />
            <span className="league-mode-name">{title}</span>
            <span className="league-mode-meta">{detail}</span>
          </button>
        ))}
      </div>
      {mode === 'solo' ? (
        <section className="league-panel space-y-3">
          <h3 className="league-section-title !mb-0">Hızlı Maç</h3>
          <p className="text-sm text-slate-300">Her doğru cevap bir gol. Maç sonunda skorunu ve çözümleri gör.</p>
          <form className="flex flex-wrap items-end gap-3" onSubmit={event => { event.preventDefault(); onStartMatch({ mode, grade, settings }); }}>
            <label className="league-field min-w-40">Sınıf düzeyi
              <select value={grade} onChange={event => { setGrade(event.target.value); setSettings(previous => ({ ...previous, outcomeCode: undefined })); }}>
                {[5, 6, 7, 8].map(level => <option key={level} value={level}>{level}. sınıf</option>)}
              </select>
            </label>
            <CompetitionSettings settings={settings} onChange={setSettings} grade={grade} />
            <button type="submit" className="league-primary">Hızlı Maçı Başlat <ArrowRight size={17} aria-hidden="true" /></button>
          </form>
        </section>
      ) : group ? (
        <>
          <div className="league-panel flex flex-wrap items-end gap-3">
            <label className="league-field min-w-40">Sınıf
              <select value={group.id} onChange={event => { setClassId(event.target.value); setSettings(previous => ({ ...previous, outcomeCode: undefined })); }}>
                {classes.map(item => <option key={item.id} value={item.id}>{item.name} · {item.students.length} öğrenci</option>)}
              </select>
            </label>
            <CompetitionSettings settings={settings} onChange={setSettings} grade={group.grade} />
            <button type="button" className="league-secondary" onClick={onOpenClasses}>Sınıfları Yönet</button>
          </div>
          <ClassLeague key={`${group.id}-${mode}`} group={group} mode={mode} teams={teams.filter(team => team.classId === group.id)}
            fixtures={fixtures.filter(fixture => fixture.classId === group.id && (fixture.mode ?? 'duel') === mode)}
            matches={matches} onStart={setup => onStartMatch({ ...setup, settings })} onFixtures={onGenerateFixtures} onSaveTeam={onSaveTeam} onDeleteTeam={onDeleteTeam} />
        </>
      ) : (
        <section className="league-panel space-y-3">
          <p>Sınıf maçı açmak için önce sınıf ve öğrencileri ekle.</p>
          <button type="button" className="league-primary" onClick={onOpenClasses}>Sınıfları Yönet</button>
        </section>
      )}
      {!invite && <div id="online-duel" className="scroll-mt-48"><OnlineDuel profile={profile} onRecord={onRecordOnline} /></div>}
      <details className="league-panel">
        <summary className="cursor-pointer font-bold">Soru Havuzu · {uniqueQuestionCount} farklı soru</summary>
        <div className="mt-3 flex flex-wrap gap-2">
          {officialQuestionSources.map(({ label, url }) => <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="league-secondary">{label} ↗</a>)}
        </div>
      </details>
    </div>
  );
}
