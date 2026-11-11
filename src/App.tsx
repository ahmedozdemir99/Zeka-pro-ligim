import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { ClassesSection } from './components/ClassesSection';
import { LeagueSection } from './components/LeagueSection';
import { GamesSection } from './components/GamesSection';
import { MathSection } from './components/MathSection';
import { WhySection } from './components/WhySection';
import { WeeklySection } from './components/WeeklySection';
import { ReportsSection } from './components/ReportsSection';
import { WinnerModal } from './components/WinnerModal';
import { AICoachModal } from './components/AICoachModal';

import { AppState, StudentClass, MatchState, Fixture, Question, GameType, Team, MatchHistoryRecord } from './types';
import { allQuestions } from './utils/questionsData';
import { sound } from './utils/sound';

const LS_KEY = 'zekaAkademisi_PRO_2026';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
          classes: parsed.classes?.length > 0 ? parsed.classes : defaultInitialClasses
        };
      }
    } catch {}
    return defaultState;
  });

  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeMatch, setActiveMatch] = useState<MatchState | null>(null);
  const [winnerData, setWinnerData] = useState<{
    winner: string;
    p1: string;
    p2: string;
    s1: number;
    s2: number;
    isTeam?: boolean;
  } | null>(null);

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
    setState(prev => ({
      ...prev,
      classes: prev.classes.map(c => {
        if (c.id !== classId) return c;
        return { ...c, students: Array.from(new Set(names)) };
      })
    }));
  };

  const handleDeleteClass = (classId: string) => {
    setState(prev => ({
      ...prev,
      classes: prev.classes.filter(c => c.id !== classId),
      fixtures: prev.fixtures.filter(f => f.classId !== classId)
    }));
    sound.playClick();
  };

  /* Fixtures Handler */
  const handleMakeFixture = (classId: string) => {
    const targetClass = state.classes.find(c => c.id === classId);
    if (!targetClass || targetClass.students.length < 2) {
      alert('Fikstür için en az 2 öğrenci gerekli.');
      return;
    }

    const existingPairs = state.fixtures.filter(f => f.classId === classId);
    const newPairs: Fixture[] = [];

    for (let i = 0; i < targetClass.students.length; i++) {
      for (let j = i + 1; j < targetClass.students.length; j++) {
        const a = targetClass.students[i];
        const b = targetClass.students[j];
        if (!existingPairs.some(f => (f.p1 === a && f.p2 === b) || (f.p1 === b && f.p2 === a))) {
          newPairs.push({
            id: uid(),
            classId,
            p1: a,
            p2: b,
            status: 'Bekliyor',
            result: null
          });
        }
      }
    }

    if (newPairs.length === 0) {
      alert('Tüm öğrenciler zaten birbirleriyle eşleşmiş durumda.');
      return;
    }

    setState(prev => ({ ...prev, fixtures: [...prev.fixtures, ...newPairs] }));
    sound.playSuccess();
    alert(`${newPairs.length} yeni karşılaşma fikstüre eklendi.`);
  };

  /* Match Logic Handlers */
  const pickMatchQuestions = (classId: string): Question[] => {
    const targetClass = state.classes.find(c => c.id === classId);
    const matchGrade = targetClass?.grade;
    let pool = matchGrade ? allQuestions.filter(q => String(q.grade) === String(matchGrade)) : allQuestions;
    if (pool.length < 10) pool = allQuestions;

    const easy = shuffle(pool.filter(q => q.difficulty === 'kolay')).slice(0, 3);
    const med = shuffle(pool.filter(q => q.difficulty === 'orta')).slice(0, 3);
    const hard = shuffle(pool.filter(q => q.difficulty === 'zor')).slice(0, 4);

    return shuffle([...easy, ...med, ...hard]);
  };

  const handleStartMatch = (
    mode: 'duel' | 'team' | 'solo',
    classId: string,
    p1: string,
    p2: string,
    team1?: Team,
    team2?: Team
  ) => {
    const questions = pickMatchQuestions(classId);
    setActiveMatch({
      id: uid(),
      classId,
      p1,
      p2,
      mode,
      team1,
      team2,
      index: 0,
      questions,
      answers1: [],
      answers2: [],
      correct1: 0,
      correct2: 0,
      start: Date.now()
    });
  };

  const handleQuickMatch = () => {
    if (state.classes.length === 0) {
      setActiveSection('classes');
      alert('Lütfen önce bir sınıf ekleyin.');
      return;
    }
    const c = state.classes[0];
    if (c.students.length < 2) {
      setActiveSection('classes');
      alert('Sınıfta en az 2 öğrenci olmalıdır.');
      return;
    }
    const shuffled = shuffle(c.students);
    setActiveSection('league');
    handleStartMatch('duel', c.id, shuffled[0], shuffled[1]);
  };

  const handleSubmitAnswer = (ans1: string, ans2?: string) => {
    if (!activeMatch) return;
    const q = activeMatch.questions[activeMatch.index];
    const norm = (str: string) => str.trim().toLowerCase().replace(/\s+/g, '');

    const c1 = norm(ans1) === norm(q.a);
    const c2 = activeMatch.mode === 'duel' && ans2 ? norm(ans2) === norm(q.a) : false;

    const updated1 = c1 ? activeMatch.correct1 + 1 : activeMatch.correct1;
    const updated2 = c2 ? activeMatch.correct2 + 1 : activeMatch.correct2;

    const nextIndex = activeMatch.index + 1;

    if (nextIndex >= activeMatch.questions.length) {
      // Finish match
      finishMatch({
        ...activeMatch,
        correct1: updated1,
        correct2: updated2,
        answers1: [...activeMatch.answers1, ans1],
        answers2: ans2 ? [...activeMatch.answers2, ans2] : activeMatch.answers2
      });
    } else {
      setActiveMatch({
        ...activeMatch,
        index: nextIndex,
        correct1: updated1,
        correct2: updated2,
        answers1: [...activeMatch.answers1, ans1],
        answers2: ans2 ? [...activeMatch.answers2, ans2] : activeMatch.answers2
      });
    }
  };

  const finishMatch = (completedMatch: MatchState) => {
    const c = state.classes.find(x => x.id === completedMatch.classId);
    const className = c ? c.name : '';

    let winner = 'Beraberlik';
    if (completedMatch.correct1 > completedMatch.correct2) {
      winner = completedMatch.p1;
    } else if (completedMatch.correct2 > completedMatch.correct1) {
      winner = completedMatch.p2;
    }

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
      answers1: completedMatch.answers1,
      answers2: completedMatch.answers2
    };

    setState(prev => {
      // Update Class Rankings
      const updatedClasses = prev.classes.map(cls => {
        if (cls.id !== completedMatch.classId) return cls;
        const r = { ...(cls.ranking || {}) };

        [completedMatch.p1, completedMatch.p2].filter(Boolean).forEach(pName => {
          if (!r[pName]) {
            r[pName] = { played: 0, wins: 0, draws: 0, losses: 0, correct: 0, points: 0 };
          }
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
            r1.points += completedMatch.correct1 * 100 + 50;
            r2.points += completedMatch.correct2 * 100;
          } else if (completedMatch.correct2 > completedMatch.correct1) {
            r2.wins++;
            r1.losses++;
            r2.points += completedMatch.correct2 * 100 + 50;
            r1.points += completedMatch.correct1 * 100;
          } else {
            r1.draws++;
            r2.draws++;
            r1.points += completedMatch.correct1 * 100;
            r2.points += completedMatch.correct2 * 100;
          }
        }

        return { ...cls, ranking: r };
      });

      // Update Fixture Status
      const updatedFixtures = prev.fixtures.map(fx => {
        if (
          fx.classId === completedMatch.classId &&
          ((fx.p1 === completedMatch.p1 && fx.p2 === completedMatch.p2) ||
            (fx.p1 === completedMatch.p2 && fx.p2 === completedMatch.p1))
        ) {
          return {
            ...fx,
            status: 'Tamamlandı' as const,
            result: winner === 'Beraberlik' ? `Beraberlik (${completedMatch.correct1}-${completedMatch.correct2})` : `${winner} Kazandı`
          };
        }
        return fx;
      });

      return {
        ...prev,
        score: prev.score + completedMatch.correct1 * 100,
        solved: prev.solved + completedMatch.correct1,
        classes: updatedClasses,
        fixtures: updatedFixtures,
        matches: [...prev.matches, historyRecord],
        history: [historyRecord, ...prev.history]
      };
    });

    setWinnerData({
      winner,
      p1: completedMatch.p1,
      p2: completedMatch.p2,
      s1: completedMatch.correct1,
      s2: completedMatch.correct2,
      isTeam: completedMatch.mode === 'team'
    });

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

  /* Rankings Calculator */
  const getRankings = () => {
    const list: Array<{ class: string; name: string; played: number; wins: number; draws: number; losses: number; correct: number; points: number }> = [];
    state.classes.forEach(c => {
      c.students.forEach(sName => {
        const r = c.ranking?.[sName] || { played: 0, wins: 0, draws: 0, losses: 0, correct: 0, points: 0 };
        list.push({ class: c.name, name: sName, ...r });
      });
    });
    return list.sort((a, b) => b.points - a.points || b.correct - a.correct);
  };

  return (
    <div className="min-h-screen bg-[#0b1128] text-[#f7f8ff] font-sans pb-12">
      {/* Header */}
      <Header
        state={state}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        toggleSound={toggleSound}
        openAICoach={() => setAiCoachOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-4">
        {activeSection === 'home' && (
          <HomeSection onNavigate={setActiveSection} onQuickMatch={handleQuickMatch} />
        )}

        {activeSection === 'classes' && (
          <ClassesSection
            classes={state.classes}
            onAddClass={handleAddClass}
            onAddStudent={handleAddStudents}
            onEditStudents={handleEditStudents}
            onDeleteClass={handleDeleteClass}
            onMakeFixture={handleMakeFixture}
          />
        )}

        {activeSection === 'league' && (
          <LeagueSection
            classes={state.classes}
            fixtures={state.fixtures}
            rankings={getRankings()}
            activeMatch={activeMatch}
            onStartMatch={handleStartMatch}
            onSubmitAnswer={handleSubmitAnswer}
            onGenerateFixtures={handleMakeFixture}
            onQuickMatch={handleQuickMatch}
          />
        )}

        {activeSection === 'games' && (
          <GamesSection onGameFinish={handleGameFinish} />
        )}

        {activeSection === 'math' && <MathSection />}

        {activeSection === 'why' && <WhySection />}

        {activeSection === 'weekly' && <WeeklySection />}

        {activeSection === 'reports' && (
          <ReportsSection
            state={state}
            onRestoreBackup={json => setState({ ...defaultState, ...json })}
          />
        )}
      </main>

      {/* Winner Modal */}
      {winnerData && (
        <WinnerModal
          winner={winnerData.winner}
          p1Name={winnerData.p1}
          p2Name={winnerData.p2}
          score1={winnerData.s1}
          score2={winnerData.s2}
          isTeam={winnerData.isTeam}
          onClose={() => setWinnerData(null)}
        />
      )}

      {/* AI Coach Modal */}
      <AICoachModal isOpen={aiCoachOpen} onClose={() => setAiCoachOpen(false)} />
    </div>
  );
}
