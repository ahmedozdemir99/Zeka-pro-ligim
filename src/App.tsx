import { formatMatchScore, matchScore } from './utils/matchScore';
import React, { useState, useEffect, useEffectEvent, useRef } from 'react';
import { Header } from './components/Header';
import { TrainingSection } from './components/TrainingSection';
import { HomeSection } from './components/HomeSection';
import { ClassesSection } from './components/ClassesSection';
import { getDuelInviteCode } from './components/OnlineDuel';
import { LeagueSection } from './components/LeagueSection';
import { GamesSection } from './components/GamesSection';
import { WeeklySection } from './components/WeeklySection';
import { ReportsSection } from './components/ReportsSection';
import { WinnerModal } from './components/WinnerModal';
import { AICoachModal } from './components/AICoachModal';

import { AppState, StudentClass, MatchState, MatchSetup, Fixture, GameType, ClassTeam, MatchHistoryRecord } from './types';
import { competitionQuestions, correctAnswer, defaults, validSettings } from './utils/competition';
import { studentApi, studentAttempt, type Account, type Profile, type StudentResult } from './utils/student';
import { StudentProfile } from './components/StudentProfile';
import { sound } from './utils/sound';

const LS_KEY = 'zekaAkademisi_PRO_2026';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const defaultInitialClasses: StudentClass[] = [
  {
    id: 'c1',
    name: '5-A',
    grade: '5',
    branch: 'A',
    students: ['Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Kaya', 'Zeynep Çelik'],
    ranking: {}
  },
  {
    id: 'c2',
    name: '6-B',
    grade: '6',
    branch: 'B',
    students: ['Ali Öztürk', 'Elif Şahin', 'Caner Yıldız', 'Fatma Akın'],
    ranking: {}
  },
  {
    id: 'c3',
    name: '7-A',
    grade: '7',
    branch: 'A',
    students: ['Ece Bulut', 'Burak Yılmaz', 'Eda Demir', 'Yusuf Kaplan'],
    ranking: {}
  },
  {
    id: 'c4',
    name: '8-A',
    grade: '8',
    branch: 'A',
    students: ['Mert Kaya', 'Selin Aktaş', 'Onur Aydın', 'Sude Arslan'],
    ranking: {}
  }
];

const defaultState: AppState = {
  score: 0,
  solved: 0,
  streak: 0,
  soundEnabled: true,
  classes: defaultInitialClasses,
  fixtures: [],
  teams: [],
  matches: [],
  history: [],
  games: {
    sudoku: [],
    kendoku: [],
    apartman: [],
    resfebe: []
  }
};

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          classes: Array.isArray(parsed.classes) ? parsed.classes : defaultInitialClasses,
          teams: Array.isArray(parsed.teams) ? parsed.teams : []
        };
      }
    } catch {}
    return defaultState;
  });

  const [activeSection, setActiveSection] = useState<string>(() => getDuelInviteCode() ? 'league' : new URLSearchParams(location.search).has('profil') ? 'profile' : 'home');
  const [activeMatch, setActiveMatch] = useState<MatchState | null>(null);
  const [winnerData, setWinnerData] = useState<MatchState | null>(null);
  const [leagueMode, setLeagueMode] = useState<MatchSetup['mode']>(() => getDuelInviteCode() ? 'duel' : 'solo');

  const [account, setAccount] = useState<Account>();
  const [accountError, setAccountError] = useState('');
  const [syncError, setSyncError] = useState(false);
  const recorded = useRef('');
  const drafts = useRef<[string, string]>(['', '']);
  const matchOwner = useRef<string | undefined>(undefined);
  const pending = useRef(new Map<string, Map<string, StudentResult>>());

  const flushResults = async (accountKey: string) => {
    const queue = pending.current.get(accountKey);
    if (!queue?.size) return;
    await Promise.all([...queue.values()].map(async result => {
      try {
        await studentApi('/result', result, accountKey);
        queue.delete(result.id);
      } catch {}
    }));
    setSyncError(queue.size > 0);
    try {
      if (queue.size) localStorage.setItem('zeka-pending-' + accountKey, JSON.stringify([...queue.values()]));
      else localStorage.removeItem('zeka-pending-' + accountKey);
    } catch {}
  };

  const loadAccount = async () => {
    try {
      setAccountError('');
      const current = await studentApi<Account>();
      const queue = new Map<string, StudentResult>();
      try {
        const saved: StudentResult[] = JSON.parse(localStorage.getItem('zeka-pending-' + current.accountKey) || '[]');
        for (const result of saved) queue.set(result.id, result);
      } catch {}
      pending.current.set(current.accountKey, queue);
      const unsaved = [...queue.values()].filter(result => !current.results.some(item => item.id === result.id));
      setAccount({ ...current, results: [...unsaved, ...current.results] });
      void flushResults(current.accountKey);
    } catch (error) { setAccountError(error instanceof Error ? error.message : '503'); }
  };
  useEffect(() => { void loadAccount(); }, []);
  const reconnect = useEffectEvent(() => { if (account) void flushResults(account.accountKey); });
  useEffect(() => {
    const retry = () => reconnect();
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, []);
  const recordResult = (result: StudentResult) => {
    if (!account?.profile) return;
    const { accountKey } = account;
    const queue = pending.current.get(accountKey);
    if (!queue) return;
    queue.set(result.id, result);
    try { localStorage.setItem('zeka-pending-' + accountKey, JSON.stringify([...queue.values()])); } catch {}
    setAccount(current => current?.accountKey === accountKey && !current.results.some(item => item.id === result.id)
      ? { ...current, results: [result, ...current.results] } : current);
    void flushResults(accountKey);
  };

  const openMatchSetup = (mode: MatchSetup['mode']) => {
    setLeagueMode(mode);
    setActiveSection('league');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const [aiCoachOpen, setAiCoachOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {}
    sound.enabled = state.soundEnabled;
  }, [state]);

  const toggleSound = () => {
    setState(prev => {
      const nextSound = !prev.soundEnabled;
      sound.enabled = nextSound;
      return { ...prev, soundEnabled: nextSound };
    });
  };

  /* Classes Handlers */
  const handleAddClass = (grade: string, branch: string) => {
    const name = `${grade}-${branch}`;
    if (state.classes.some(c => c.name === name)) {
      alert('Bu isimde bir sınıf zaten var.');
      return;
    }
    const newClass: StudentClass = {
      id: uid(),
      name,
      grade,
      branch,
      students: [],
      ranking: {}
    };
    setState(prev => ({ ...prev, classes: [...prev.classes, newClass] }));
    sound.playSuccess();
  };

  const handleAddStudents = (classId: string, names: string[]) => {
    setState(prev => ({
      ...prev,
      classes: prev.classes.map(c => {
        if (c.id !== classId) return c;
        const set = new Set([...c.students, ...names]);
        return { ...c, students: Array.from(set) };
      })
    }));
  };

  const handleEditStudents = (classId: string, names: string[]) => {
    const students = [...new Set(names)];
    const allowed = new Set(students);
    setState(prev => ({
      ...prev,
      classes: prev.classes.map(group => group.id === classId ? { ...group, students } : group),
      teams: prev.teams.map(team => team.classId === classId
        ? { ...team, members: team.members.filter(member => allowed.has(member)) } : team),
      fixtures: prev.fixtures.filter(fixture => fixture.classId !== classId || fixture.status === 'Tamamlandı' ||
        fixture.mode === 'team' || (allowed.has(fixture.p1) && allowed.has(fixture.p2))),
    }));
  };

  const handleDeleteClass = (classId: string) => {
    setState(prev => ({
      ...prev,
      classes: prev.classes.filter(c => c.id !== classId),
      teams: prev.teams.filter(team => team.classId !== classId),
      fixtures: prev.fixtures.filter(f => f.classId !== classId)
    }));
    sound.playClick();
  };

  const handleSaveTeam = (team: Omit<ClassTeam, 'id'> & { id?: string }) => {
    const group = state.classes.find(item => item.id === team.classId);
    const name = team.name.trim();
    if (!group || !name || !team.members.length || !team.members.every(member => group.students.includes(member))) {
      return 'Takım adı yaz ve bu sınıftan en az bir öğrenci seç.';
    }
    const peers = state.teams.filter(item => item.classId === team.classId && item.id !== team.id);
    if (peers.some(item => item.name.toLocaleLowerCase('tr') === name.toLocaleLowerCase('tr'))) {
      return 'Bu takım adı sınıfta kullanılıyor.';
    }
    if (peers.some(item => item.members.some(member => team.members.includes(member)))) {
      return 'Bir öğrenci aynı sınıfta yalnızca bir takımda yer alabilir.';
    }
    const updated = { ...team, name, id: team.id ?? uid() };
    setState(prev => ({
      ...prev,
      teams: [...prev.teams.filter(item => item.id !== updated.id), updated],
    }));
    return '';
  };

  const handleDeleteTeam = (id: string) => {
    setState(prev => ({
      ...prev,
      teams: prev.teams.filter(team => team.id !== id),
      fixtures: prev.fixtures.filter(fixture => fixture.status === 'Tamamlandı' || !fixture.teamIds?.includes(id)),
    }));
  };

  const handleMakeFixture = (classId: string, mode: 'duel' | 'team' = 'duel') => {
    const group = state.classes.find(item => item.id === classId);
    if (!group) return 'Önce bir sınıf seç.';
    const participants = mode === 'team'
      ? state.teams.filter(team => team.classId === classId && team.members.length)
      : group.students.map(name => ({ name, id: name }));
    if (participants.length < 2) return mode === 'team' ? 'Fikstür için en az iki kadrolu takım gerekiyor.' : 'Fikstür için en az iki öğrenci gerekiyor.';

    const existing = state.fixtures.filter(fixture => fixture.classId === classId && (fixture.mode ?? 'duel') === mode);
    const newFixtures: Fixture[] = [];
    participants.forEach((home, index) => {
      for (const away of participants.slice(index + 1)) {
        const recorded = existing.some(fixture => {
          const [a, b] = fixture.teamIds ?? [fixture.p1, fixture.p2];
          return (a === home.id && b === away.id) || (b === home.id && a === away.id);
        });
        if (!recorded) newFixtures.push({
          id: uid(), classId, p1: home.name, p2: away.name, mode, status: 'Bekliyor', result: null,
          teamIds: mode === 'team' ? [home.id, away.id] : undefined,
        });
      }
    });
    if (!newFixtures.length) return 'Tüm eşleşmeler fikstürde yer alıyor.';
    setState(prev => ({ ...prev, fixtures: [...prev.fixtures, ...newFixtures] }));
    sound.playSuccess();
    return `${newFixtures.length} maç fikstüre eklendi.`;
  };

  const handleStartMatch = (setup: MatchSetup) => {
    if (activeMatch && !confirm('Devam eden maç kapatılsın mı?')) return;
    const group = setup.mode === 'solo' ? undefined : state.classes.find(item => item.id === setup.classId);
    if (setup.mode !== 'solo' && !group) return 'Önce bir sınıf seç.';
    if (setup.mode === 'solo' && !['5', '6', '7', '8'].includes(setup.grade)) return 'Geçerli bir sınıf düzeyi seç.';

    const team1 = setup.mode === 'team' ? state.teams.find(team => team.id === setup.team1Id && team.classId === group?.id) : undefined;
    const team2 = setup.mode === 'team' ? state.teams.find(team => team.id === setup.team2Id && team.classId === group?.id) : undefined;
    if (setup.mode === 'team' && (!team1?.members.length || !team2?.members.length || team1.id === team2.id)) {
      return 'Maç için kadrosu olan iki farklı takım seç.';
    }
    if (setup.mode === 'duel' && (setup.p1 === setup.p2 || !group?.students.includes(setup.p1) || !group.students.includes(setup.p2))) {
      return 'Aynı sınıftan iki farklı öğrenci seç.';
    }
    const settings = setup.settings ?? defaults;
    if (!validSettings(settings)) return 'Geçerli maç ayarları seç.';
    const questions = competitionQuestions(setup.mode === 'solo' ? setup.grade : group!.grade, setup.mode === 'team' ? 10 : 5, settings);
    if (!questions.length) return 'Bu ders için uygun soru bulunamadı.';
    drafts.current = ['', ''];
    matchOwner.current = account?.profile ? account.accountKey : undefined;
    const p1 = setup.mode === 'solo' ? 'Sen' : setup.mode === 'duel' ? setup.p1 : team1!.name;
    const p2 = setup.mode === 'solo' ? '' : setup.mode === 'duel' ? setup.p2 : team2!.name;
    setActiveMatch({
      id: uid(), classId: group?.id ?? '', fixtureId: setup.mode === 'solo' ? undefined : setup.fixtureId,
      mode: setup.mode, p1, p2, team1, team2, questions, index: 0, settings,
      deadline: settings.seconds ? Date.now() + settings.seconds * 1000 : undefined,
      answers1: [], answers2: [], correct1: 0, correct2: 0, start: Date.now(),
    });
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'instant' });
    return '';
  };

  const handleSubmitAnswer = (home: string, away = '') => {
    if (!activeMatch) return;
    const { id, index, questions, deadline, mode, settings } = activeMatch;
    const key = id + ':' + index;
    if (recorded.current === key) return;
    const expired = deadline !== undefined && Date.now() >= deadline;
    if (expired) [home, away] = drafts.current;
    const hasOpponent = mode !== 'solo';
    if (hasOpponent && !expired && (!home.trim() || !away.trim())) return;
    recorded.current = key;
    drafts.current = ['', ''];
    const completed: MatchState = {
      ...activeMatch, index: index + 1,
      deadline: settings?.seconds ? Date.now() + settings.seconds * 1000 : undefined,
      correct1: activeMatch.correct1 + Number(correctAnswer(questions[index], home)),
      correct2: activeMatch.correct2 + Number(hasOpponent && correctAnswer(questions[index], away)),
      answers1: [...activeMatch.answers1, home],
      answers2: hasOpponent ? [...activeMatch.answers2, away] : activeMatch.answers2,
    };
    if (completed.index >= questions.length) finishMatch(completed);
    else setActiveMatch(completed);
  };
  const expire = useEffectEvent(() => handleSubmitAnswer('', ''));
  const deadline = activeMatch?.deadline;
  useEffect(() => {
    if (deadline === undefined) return;
    let timer: number;
    function check() {
      const remaining = deadline! - Date.now();
      if (remaining > 0) timer = window.setTimeout(check, remaining);
      else expire();
    }
    timer = window.setTimeout(check, Math.max(0, deadline - Date.now()));
    return () => window.clearTimeout(timer);
  }, [deadline, activeMatch?.id, activeMatch?.index]);

  const finishMatch = (completedMatch: MatchState) => {
    const c = state.classes.find(x => x.id === completedMatch.classId);
    const homeScore = matchScore(completedMatch.correct1, completedMatch.questions.length);
    const awayScore = matchScore(completedMatch.correct2, completedMatch.questions.length);
    const profile = account?.accountKey === matchOwner.current ? account?.profile : undefined;
    if (profile) {
      const { id, mode, p1, p2, team1, team2, questions, correct1, correct2, answers1, answers2 } = completedMatch;
      const sameClass = c?.grade === profile.grade && c.branch === profile.branch;
      const home = mode === 'solo' || (sameClass && (mode === 'duel' ? p1 === profile.name : team1?.members.includes(profile.name)));
      const away = sameClass && (mode === 'duel' ? p2 === profile.name : team2?.members.includes(profile.name));
      if (home || away) recordResult({
        id, kind: mode, scored: home ? correct1 : correct2, conceded: mode === 'solo' ? undefined : home ? correct2 : correct1,
        total: questions.length, points: home ? homeScore : awayScore, date: new Date().toISOString(),
        attempts: mode === 'team' ? [] : questions.map((q, i) => studentAttempt(q, (home ? answers1 : answers2)[i] ?? '')),
      });
    }
    const className = c?.name ?? (completedMatch.mode === 'solo' ? `${completedMatch.questions[0].grade}. sınıf · Hızlı maç` : '');

    let winner = 'Beraberlik';
    if (completedMatch.correct1 > completedMatch.correct2) {
      winner = completedMatch.p1;
    } else if (completedMatch.correct2 > completedMatch.correct1) {
      winner = completedMatch.p2;
    }

    if (completedMatch.mode === 'solo') winner = '';

    const dateStr = new Date().toLocaleString('tr-TR');

    const historyRecord: MatchHistoryRecord = {
      id: completedMatch.id,
      date: dateStr,
      classId: completedMatch.classId,
      className,
      p1: completedMatch.p1,
      p2: completedMatch.p2,
      mode: completedMatch.mode,
      team1: completedMatch.team1,
      team2: completedMatch.team2,
      correct1: completedMatch.correct1,
      correct2: completedMatch.correct2,
      winner,
      result: completedMatch.mode === 'solo' ? `${formatMatchScore(homeScore)}/100 puan` : `${formatMatchScore(homeScore)} – ${formatMatchScore(awayScore)} / 100`,
      answers1: completedMatch.answers1,
      answers2: completedMatch.answers2
    };

    setState(prev => {
      if (prev.matches.some(item => item.id === completedMatch.id)) return prev;
      // Update Class Rankings
      const updatedClasses = prev.classes.map(cls => {
        if (cls.id !== completedMatch.classId || completedMatch.mode !== 'duel') return cls;
        const r = { ...(cls.ranking || {}) };

        [completedMatch.p1, completedMatch.p2].filter(Boolean).forEach(pName => {
          r[pName] = Object.hasOwn(r, pName)
            ? { ...r[pName] }
            : { played: 0, wins: 0, draws: 0, losses: 0, correct: 0, points: 0 };
        });

        if (completedMatch.mode === 'duel') {
          const r1 = r[completedMatch.p1];
          const r2 = r[completedMatch.p2];
          r1.played++;
          r2.played++;
          r1.correct += completedMatch.correct1;
          r2.correct += completedMatch.correct2;

          if (completedMatch.correct1 > completedMatch.correct2) {
            r1.wins++;
            r2.losses++;
            r1.points += homeScore;
            r2.points += awayScore;
          } else if (completedMatch.correct2 > completedMatch.correct1) {
            r2.wins++;
            r1.losses++;
            r2.points += awayScore;
            r1.points += homeScore;
          } else {
            r1.draws++;
            r2.draws++;
            r1.points += homeScore;
            r2.points += awayScore;
          }
        }

        return { ...cls, ranking: r };
      });

      // Update Fixture Status
      const pendingFixture = completedMatch.mode !== 'solo' && prev.fixtures.find(fixture => {
        if (fixture.status !== 'Bekliyor' || fixture.classId !== completedMatch.classId ||
          (fixture.mode ?? 'duel') !== completedMatch.mode) return false;
        if (completedMatch.fixtureId) return fixture.id === completedMatch.fixtureId;
        const [home, away] = fixture.teamIds ?? [fixture.p1, fixture.p2];
        const a = completedMatch.team1?.id ?? completedMatch.p1;
        const b = completedMatch.team2?.id ?? completedMatch.p2;
        return (home === a && away === b) || (home === b && away === a);
      });
      const updatedFixtures = prev.fixtures.map(fx => {
        if (pendingFixture && pendingFixture.id === fx.id) {
          return {
            ...fx,
            status: 'Tamamlandı' as const,
            result: `${completedMatch.p1} ${formatMatchScore(homeScore)}–${formatMatchScore(awayScore)} ${completedMatch.p2} (/100)`
          };
        }
        return fx;
      });

      return {
        ...prev,
        score: prev.score + homeScore,
        solved: prev.solved + completedMatch.correct1,
        classes: updatedClasses,
        fixtures: updatedFixtures,
        matches: [...prev.matches, historyRecord],
        history: [historyRecord, ...prev.history]
      };
    });

    setWinnerData(completedMatch);
    setActiveMatch(null);
  };

  /* Game Finished Handler */
  const handleGameFinish = (type: GameType, success: boolean, timeSeconds: number) => {
    if (success) {
      const rec: MatchHistoryRecord = {
        id: uid(),
        date: new Date().toLocaleString('tr-TR'),
        classId: '',
        className: 'Bireysel Zekâ Oyunu',
        p1: 'Oyuncu',
        p2: '',
        correct1: 1,
        correct2: 0,
        winner: 'Başarılı',
        answers1: [],
        answers2: [],
        type,
        result: 'Çözüldü',
        score: 100,
        time: timeSeconds
      };

      setState(prev => ({
        ...prev,
        score: prev.score + 100,
        solved: prev.solved + 1,
        streak: prev.streak + 1,
        history: [rec, ...prev.history]
      }));
    }
  };

  const recordTraining = (grade: string, correct: number, total: number) => {
    const record: MatchHistoryRecord = {
      id: uid(), date: new Date().toLocaleString('tr-TR'),
      classId: '', className: `${grade}. sınıf`, p1: '', p2: '',
      correct1: correct, correct2: 0, winner: '', answers1: [], answers2: [],
      type: 'Antrenman', result: `${grade}. sınıf · ${correct}/${total} doğru`,
    };
    setState(previous => ({ ...previous, history: [record, ...previous.history] }));
  };

  return (
    <div className="league-app min-h-screen pb-12">
      {/* Header */}
      <Header
        state={state}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        crest={account?.profile?.crest}
        toggleSound={toggleSound}
        openAICoach={() => setAiCoachOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-4">
        {activeSection === 'home' && (
          <HomeSection onNavigate={setActiveSection} onMatch={openMatchSetup} />
        )}

        <div hidden={activeSection !== 'training'}>
          <TrainingSection onComplete={recordTraining} />
        </div>

        {activeSection === 'classes' && (
          <ClassesSection
            classes={state.classes}
            onAddClass={handleAddClass}
            onAddStudent={handleAddStudents}
            onEditStudents={handleEditStudents}
            onDeleteClass={handleDeleteClass}
            onMakeFixture={classId => alert(handleMakeFixture(classId))}
          />
        )}

        {activeSection === 'league' && (
          <LeagueSection
            classes={state.classes}
            fixtures={state.fixtures}
            teams={state.teams}
            matches={state.matches}
            mode={leagueMode}
            onModeChange={setLeagueMode}
            onSaveTeam={handleSaveTeam}
            onDeleteTeam={handleDeleteTeam}
            onOpenClasses={() => setActiveSection('classes')}
            activeMatch={activeMatch}
            onStartMatch={handleStartMatch}
            onSubmitAnswer={handleSubmitAnswer}
            profile={account?.profile}
            onRecordOnline={account?.profile ? recordResult : undefined}
            drafts={drafts.current}
            onDraft={(home, away) => {
              if (!activeMatch?.deadline || Date.now() < activeMatch.deadline) drafts.current = [home, away];
            }}
            onGenerateFixtures={handleMakeFixture}
            onCancelMatch={() => { if (confirm('Maçtan ayrılmak istiyor musun?')) setActiveMatch(null); }}
          />
        )}

        {activeSection === 'games' && (
          <GamesSection onGameFinish={handleGameFinish} />
        )}

        {activeSection === 'profile' && <StudentProfile account={account} error={accountError}
          onRetry={() => void (account ? flushResults(account.accountKey) : loadAccount())}
          onSaved={(profile: Profile) => setAccount(current => current ? { ...current, profile } : current)}
          onRecord={recordResult} syncError={syncError} />}


        {activeSection === 'weekly' && <WeeklySection />}

        {activeSection === 'reports' && (
          <ReportsSection
            state={state}
            onRestoreBackup={json => setState({ ...defaultState, ...json, teams: Array.isArray(json.teams) ? json.teams : [] })}
          />
        )}
      </main>

      {/* Winner Modal */}
      {winnerData && (
        <WinnerModal match={winnerData} onClose={() => setWinnerData(null)} />
      )}

      {/* AI Coach Modal */}
      <AICoachModal isOpen={aiCoachOpen} onClose={() => setAiCoachOpen(false)} />
    </div>
  );
}
