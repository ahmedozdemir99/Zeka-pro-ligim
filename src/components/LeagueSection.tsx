import React, { useState, useEffect } from 'react';
import { Trophy, Users, User, Play, Sparkles, RefreshCw, Globe, HelpCircle, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { StudentClass, Fixture, MatchState, Question, Team } from '../types';
import { sound } from '../utils/sound';

interface LeagueSectionProps {
  classes: StudentClass[];
  fixtures: Fixture[];
  rankings: Array<{ class: string; name: string; played: number; wins: number; draws: number; losses: number; correct: number; points: number }>;
  activeMatch: MatchState | null;
  onStartMatch: (mode: 'duel' | 'team' | 'solo', classId: string, p1: string, p2: string, team1?: Team, team2?: Team) => void;
  onSubmitAnswer: (ans1: string, ans2?: string) => void;
  onGenerateFixtures: (classId: string) => void;
  onQuickMatch: () => void;
}

const WORKER_URL = 'https://zeka-pro-ligi.ahmedkadiri99-33c.workers.dev';

export const LeagueSection: React.FC<LeagueSectionProps> = ({
  classes,
  fixtures,
  rankings,
  activeMatch,
  onStartMatch,
  onSubmitAnswer,
  onGenerateFixtures,
  onQuickMatch,
}) => {
  const [mode, setMode] = useState<'duel' | 'team' | 'solo'>('duel');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [p1, setP1] = useState<string>('');
  const [p2, setP2] = useState<string>('');

  // Team Race Setup State
  const [team1Name, setTeam1Name] = useState<string>('🔵 Mavi Takım');
  const [team2Name, setTeam2Name] = useState<string>('🟡 Altın Takım');
  const [team1Members, setTeam1Members] = useState<string[]>([]);
  const [team2Members, setTeam2Members] = useState<string[]>([]);

  // Match Answer Inputs
  const [ans1Input, setAns1Input] = useState<string>('');
  const [ans2Input, setAns2Input] = useState<string>('');

  // AI Explanation State
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  // Online Mini Duel State
  const [onlineState, setOnlineState] = useState<'idle' | 'created' | 'joined' | 'playing' | 'finished'>('idle');
  const [onlineCode, setOnlineCode] = useState<string>('');
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [onlineNameInput, setOnlineNameInput] = useState<string>('');
  const [onlineDuelData, setOnlineDuelData] = useState<any>(null);
  const [onlineAnswer, setOnlineAnswer] = useState<string>('');

  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes]);

  useEffect(() => {
    const currentClass = classes.find(c => c.id === selectedClassId);
    if (currentClass && currentClass.students.length > 0) {
      setP1(currentClass.students[0]);
      if (currentClass.students.length > 1) {
        setP2(currentClass.students[1]);
        setTeam1Members([currentClass.students[0]]);
        setTeam2Members([currentClass.students[1]]);
      } else {
        setP2('');
        setTeam1Members([currentClass.students[0]]);
        setTeam2Members([]);
      }
    } else {
      setP1('');
      setP2('');
      setTeam1Members([]);
      setTeam2Members([]);
    }
  }, [selectedClassId, classes]);

  const currentClass = classes.find(c => c.id === selectedClassId);

  const handleStart = () => {
    if (!selectedClassId) {
      alert('Lütfen bir sınıf seçin.');
      return;
    }
    if (mode === 'team') {
      if (!team1Name.trim() || !team2Name.trim() || team1Name.trim() === team2Name.trim()) {
        alert('İki takıma farklı ve geçerli isimler verin.');
        return;
      }
      if (team1Members.length === 0 || team2Members.length === 0) {
        alert('Her iki takıma da en az 1 öğrenci seçin.');
        return;
      }
      sound.playClick();
      onStartMatch(
        'team',
        selectedClassId,
        team1Name.trim(),
        team2Name.trim(),
        { name: team1Name.trim(), members: team1Members },
        { name: team2Name.trim(), members: team2Members }
      );
    } else {
      if (!p1) {
        alert('Lütfen birinci oyuncuyu seçin.');
        return;
      }
      if (mode === 'duel' && (!p2 || p1 === p2)) {
        alert('İki kişilik düelloda 2 farklı öğrenci seçin.');
        return;
      }
      sound.playClick();
      onStartMatch(mode, selectedClassId, p1, mode === 'solo' ? '' : p2);
    }
  };

  const handleSubmit = () => {
    if (!ans1Input.trim()) {
      alert('Cevap giriniz.');
      return;
    }
    if (activeMatch?.mode === 'duel' && !ans2Input.trim()) {
      alert('İkinci oyuncunun da cevabını giriniz.');
      return;
    }
    sound.playClick();
    onSubmitAnswer(ans1Input.trim(), ans2Input.trim());
    setAns1Input('');
    setAns2Input('');
    setAiExplanation('');
  };

  const handleFetchAIExplain = async (q: Question) => {
    setLoadingAi(true);
    setAiExplanation('');
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.q,
          answer: q.a,
          subject: q.subject,
          grade: q.grade,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setAiExplanation(data.text);
      } else {
        setAiExplanation(data.error || 'Açıklama üretilemedi.');
      }
    } catch {
      setAiExplanation('Bağlantı hatası oluştu.');
    } finally {
      setLoadingAi(false);
    }
  };

  /* Online Cloudflare Worker Mini Duel Handlers */
  const handleCreateOnlineDuel = async () => {
    const name = prompt('Düelloda görünecek ad / rumuzunuz:')?.trim();
    if (!name || name.length < 2) return;
    try {
      const res = await fetch(`${WORKER_URL}/duel/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.code) {
        setOnlineCode(data.code);
        setOnlineNameInput(name);
        setOnlineState('created');
        sound.playSuccess();
      }
    } catch {
      alert('Online düello sunucusuna erişilemedi.');
    }
  };

  const handleJoinOnlineDuel = async () => {
    if (!joinCodeInput.trim() || joinCodeInput.trim().length !== 6) {
      alert('Lütfen 6 haneli geçerli düello kodunu girin.');
      return;
    }
    const name = prompt('Düelloda görünecek ad / rumuzunuz:')?.trim();
    if (!name || name.length < 2) return;
    try {
      const res = await fetch(`${WORKER_URL}/duel/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: joinCodeInput.trim(), name }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Düelloya katılamadı.');
        return;
      }
      if (data.duelId) {
        setOnlineState('joined');
        sound.playSuccess();
      } else {
        alert(data.error || 'Düelloya katılamadı.');
      }
    } catch {
      alert('Bağlantı kurulamadı.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1a2450] to-[#121938] border border-white/10 p-5 shadow-xl space-y-2">
        <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 font-extrabold text-xs border border-cyan-500/30">
          🏆 ZEKÂ PRO LİGİ
        </span>
        <h2 className="text-2xl font-black text-white">🏆 Zekâ Pro Ligi Yarışmaları</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Bireysel düello, tek başına yarış veya takım yarışı. Her maçta havuzdan seçilen 10 özgün ortaokul beceri temelli sorusu!
        </p>
      </div>

      {/* Online Mini Duel Panel */}
      <div className="bg-gradient-to-br from-[#17264e] to-[#121b39] border border-cyan-500/30 rounded-3xl p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-extrabold border border-emerald-500/30">
              ● CANLI • ÖĞRETMENSİZ ONLINE
            </span>
            <h3 className="text-base font-extrabold text-white mt-1">👥 Arkadaşınla Mini Düello</h3>
          </div>
          <Globe className="w-5 h-5 text-cyan-400" />
        </div>
        <p className="text-xs text-slate-300">
          İki farklı telefondan veya bilgisayardan, öğretmen girişi gerektirmeden gerçek zamanlı yarışın.
        </p>

        {onlineState === 'idle' && (
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleCreateOnlineDuel}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs shadow-md hover:brightness-110"
            >
              🎯 Düello Oluştur
            </button>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="6 Haneli Kod"
                value={joinCodeInput}
                maxLength={6}
                onChange={e => setJoinCodeInput(e.target.value)}
                className="w-28 bg-[#0b122b] border border-cyan-500/40 text-cyan-300 font-mono text-center font-bold text-xs rounded-xl p-2 outline-none"
              />
              <button
                onClick={handleJoinOnlineDuel}
                className="px-3 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20"
              >
                🔑 Katıl
              </button>
            </div>
          </div>
        )}

        {onlineState === 'created' && (
          <div className="bg-[#0b122b] border border-cyan-500/40 rounded-2xl p-4 text-center space-y-2">
            <span className="text-xs text-slate-400 font-semibold">Arkadaşına bu 6 haneli kodu verin:</span>
            <div className="text-3xl font-black tracking-widest text-cyan-400 font-mono py-2">{onlineCode}</div>
            <p className="text-[11px] text-amber-300 animate-pulse">2. oyuncunun koda katılması bekleniyor...</p>
            <button
              onClick={() => setOnlineState('idle')}
              className="text-xs text-slate-400 underline hover:text-white pt-1"
            >
              Vazgeç
            </button>
          </div>
        )}
      </div>

      {/* Active Match Area */}
      {activeMatch ? (
        <div className="bg-[#171f42] border border-purple-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-xs font-bold text-cyan-400">
                {activeMatch.mode === 'solo' ? '🧠 TEK BAŞINA YARIŞ' : activeMatch.mode === 'team' ? '👥 TAKIM YARIŞI' : '🏆 DÜELLO'}
              </span>
              <h3 className="text-lg font-black text-white">Soru {activeMatch.index + 1} / 10</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-xs border border-purple-500/30">
              100 Puan
            </span>
          </div>

          {/* Current Question Display */}
          {activeMatch.questions[activeMatch.index] && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-[#222d59] to-[#171f42] border border-white/10 rounded-2xl p-4 text-white text-base font-bold leading-relaxed shadow-inner">
                {activeMatch.questions[activeMatch.index].q}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span><b>Konu:</b> {activeMatch.questions[activeMatch.index].subject}</span>
                <span><b>Zorluk:</b> {activeMatch.questions[activeMatch.index].difficulty.toUpperCase()}</span>
              </div>

              {/* Player Scorecards */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <span className="text-xs text-slate-400 block font-semibold">{activeMatch.p1}</span>
                  <b className="text-xl font-extrabold text-cyan-400">{activeMatch.correct1} Doğru</b>
                </div>
                {activeMatch.mode !== 'solo' && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                    <span className="text-xs text-slate-400 block font-semibold">{activeMatch.p2}</span>
                    <b className="text-xl font-extrabold text-yellow-400">{activeMatch.correct2} Doğru</b>
                  </div>
                )}
              </div>

              {/* Answer Inputs */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    {activeMatch.p1} Cevabı:
                  </label>
                  <input
                    type="text"
                    value={ans1Input}
                    onChange={e => setAns1Input(e.target.value)}
                    placeholder="Cevabınızı yazın..."
                    className="w-full bg-[#0e1530] border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-purple-500"
                  />
                </div>

                {activeMatch.mode !== 'solo' && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      {activeMatch.p2} Cevabı:
                    </label>
                    <input
                      type="text"
                      value={ans2Input}
                      onChange={e => setAns2Input(e.target.value)}
                      placeholder="Cevabınızı yazın..."
                      className="w-full bg-[#0e1530] border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-purple-500"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-purple-600/30 hover:brightness-110 active:scale-95 transition-all"
                  >
                    ✓ Cevapları Değerlendir
                  </button>
                  <button
                    onClick={() => handleFetchAIExplain(activeMatch.questions[activeMatch.index])}
                    disabled={loadingAi}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs shadow-md hover:brightness-110 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    {loadingAi ? 'AI Açıklıyor...' : 'AI Çözümü'}
                  </button>
                </div>
              </div>

              {/* AI Explanation Box */}
              {aiExplanation && (
                <div className="bg-purple-950/40 border border-purple-500/40 rounded-2xl p-4 text-xs text-purple-100 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <Sparkles className="w-4 h-4" /> AI Zekâ Öğretmeni Çözümü:
                  </div>
                  <div className="whitespace-pre-line leading-relaxed">{aiExplanation}</div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Match Creation Panel */
        <div className="bg-[#171f42] border border-white/10 rounded-3xl p-5 space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Play className="w-4 h-4 text-cyan-400" /> Yeni Maç Oluştur
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Yarışma Türü</label>
              <select
                value={mode}
                onChange={e => setMode(e.target.value as any)}
                className="w-full bg-[#0e1530] border border-white/10 text-white text-xs rounded-xl p-2.5 outline-none focus:border-purple-500"
              >
                <option value="duel">🏆 İki Kişilik Düello</option>
                <option value="team">👥 Takım Yarışı</option>
                <option value="solo">🧠 Tek Başına</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Sınıf</label>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="w-full bg-[#0e1530] border border-white/10 text-white text-xs rounded-xl p-2.5 outline-none focus:border-purple-500"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.students.length} öğrenci)
                  </option>
                ))}
              </select>
            </div>

            {mode !== 'team' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">1. Oyuncu</label>
                <select
                  value={p1}
                  onChange={e => setP1(e.target.value)}
                  className="w-full bg-[#0e1530] border border-white/10 text-white text-xs rounded-xl p-2.5 outline-none focus:border-purple-500"
                >
                  {currentClass?.students.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            {mode === 'duel' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">2. Oyuncu</label>
                <select
                  value={p2}
                  onChange={e => setP2(e.target.value)}
                  className="w-full bg-[#0e1530] border border-white/10 text-white text-xs rounded-xl p-2.5 outline-none focus:border-purple-500"
                >
                  {currentClass?.students.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Team Race Builder */}
          {mode === 'team' && (
            <div className="bg-[#0e1530] border border-white/10 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-extrabold text-cyan-300">👥 Takımları Oluştur</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Team 1 */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
                  <input
                    type="text"
                    value={team1Name}
                    onChange={e => setTeam1Name(e.target.value)}
                    className="w-full bg-[#0b1128] border border-white/10 text-white text-xs font-bold rounded-lg p-2"
                  />
                  <span className="text-[11px] text-slate-400 block font-semibold">Üye Seçimi:</span>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {currentClass?.students.map(s => (
                      <label key={s} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={team1Members.includes(s)}
                          onChange={e => {
                            if (e.target.checked) setTeam1Members([...team1Members, s]);
                            else setTeam1Members(team1Members.filter(x => x !== s));
                          }}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Team 2 */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
                  <input
                    type="text"
                    value={team2Name}
                    onChange={e => setTeam2Name(e.target.value)}
                    className="w-full bg-[#0b1128] border border-white/10 text-white text-xs font-bold rounded-lg p-2"
                  />
                  <span className="text-[11px] text-slate-400 block font-semibold">Üye Seçimi:</span>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {currentClass?.students.map(s => (
                      <label key={s} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={team2Members.includes(s)}
                          onChange={e => {
                            if (e.target.checked) setTeam2Members([...team2Members, s]);
                            else setTeam2Members(team2Members.filter(x => x !== s));
                          }}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleStart}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              🏆 Maçı Başlat
            </button>
            <button
              onClick={onQuickMatch}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30 hover:bg-cyan-500/30 transition-all"
            >
              🎲 Rastgele Eşleştir
            </button>
            {selectedClassId && (
              <button
                onClick={() => onGenerateFixtures(selectedClassId)}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold text-xs border border-white/10 hover:bg-white/10 transition-all"
              >
                📅 Fikstür Oluştur
              </button>
            )}
          </div>
        </div>
      )}

      {/* Fixtures Panel */}
      <div className="bg-[#171f42] border border-white/10 rounded-3xl p-5 space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          📅 Aktif Fikstür Karşılaşmaları
        </h3>
        {fixtures.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Henüz fikstür oluşturulmadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold">
                  <th className="py-2 px-3">Eşleşme</th>
                  <th className="py-2 px-3">Durum</th>
                  <th className="py-2 px-3">Sonuç</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {fixtures.map(f => (
                  <tr key={f.id} className="hover:bg-white/5">
                    <td className="py-2.5 px-3 font-bold text-white">{f.p1} — {f.p2}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        f.status === 'Tamamlandı' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{f.result || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Leaderboard Rankings */}
      <div className="bg-[#171f42] border border-white/10 rounded-3xl p-5 space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          🥇 Lig Puan Durumu Sıralaması
        </h3>
        {rankings.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Henüz lig verisi oluşmadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Öğrenci</th>
                  <th className="py-2 px-3">Sınıf</th>
                  <th className="py-2 px-3">O</th>
                  <th className="py-2 px-3">G</th>
                  <th className="py-2 px-3">M</th>
                  <th className="py-2 px-3">Doğru</th>
                  <th className="py-2 px-3">Puan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rankings.map((r, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="py-2.5 px-3 font-bold text-slate-400">{i + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{r.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{r.class}</td>
                    <td className="py-2.5 px-3">{r.played}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{r.wins}</td>
                    <td className="py-2.5 px-3 text-rose-400">{r.losses}</td>
                    <td className="py-2.5 px-3">{r.correct}</td>
                    <td className="py-2.5 px-3 font-black text-cyan-400">{r.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official Resources Banner */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-300 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" /> Resmî MEB / PISA Soru Kaynakları
        </h3>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Uygulamamızdaki sorular MEB ve PISA beceri temelli sorular yaklaşımından esinlenilerek öğretmen kadromuz ve AI tarafından hazırlanmıştır.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href="https://odsgm.meb.gov.tr/www/5-6-ve-7-sinif-duzeylerinde-beceri-temelli-sorular-yayimlanmistir/icerik/491"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-cyan-300 hover:bg-white/10 transition-colors"
          >
            MEB Beceri Soruları ↗
          </a>
          <a
            href="https://pisa.meb.gov.tr/www/yayimlanan-sorular/icerik/6"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-cyan-300 hover:bg-white/10 transition-colors"
          >
            PISA Soruları ↗
          </a>
        </div>
      </div>
    </div>
  );
};
