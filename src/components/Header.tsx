import React from 'react';
import { Volume2, VolumeX, Sparkles, Trophy, School, Puzzle, Calculator, Lightbulb, Star, BarChart3, Home, UserRound } from 'lucide-react';
import { AppState } from '../types';
import { crests, type Crest } from '../utils/student';
import { sound } from '../utils/sound';

interface HeaderProps {
  state: AppState;
  crest?: Crest;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  toggleSound: () => void;
  openAICoach: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  crest = 'ts',
  activeSection,
  setActiveSection,
  toggleSound,
  openAICoach
}) => {
  const navItems = [
    { id: 'home', label: 'Ana Sayfa', icon: Home },
    { id: 'profile', label: 'Profilim', icon: UserRound },
    { id: 'training', label: 'Antrenman', icon: Calculator },
    { id: 'league', label: '🏆 Pro Lig', icon: Trophy },
    { id: 'classes', label: '🏫 Sınıflarım', icon: School },
    { id: 'games', label: '🧩 Zekâ Oyunları', icon: Puzzle },
    { id: 'weekly', label: '⭐ Haftanın Sorusu', icon: Star },
    { id: 'reports', label: '📊 Raporlar', icon: BarChart3 },
  ];

  const handleNavClick = (id: string) => {
    sound.playClick();
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 league-header backdrop-blur-md px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Brand */}
          <button type="button" className="flex items-center gap-3 text-left" onClick={() => handleNavClick('home')} aria-label="Zekâ Pro Ligim ana sayfası">
            <span className="league-brand"><img className="size-8 object-contain" src={`/crests/${crest}.png`} alt={crests[crest]} /></span>
            <span className="text-lg font-black tracking-tight text-white">Zekâ Pro Ligim</span>
          </button>

          {/* Quick Actions & Sound Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={openAICoach}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-white font-bold text-xs hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-200" />
              AI Zekâ Koçu
            </button>
            <button
              onClick={toggleSound}
              title={state.soundEnabled ? 'Sesleri Kapat' : 'Sesleri Aç'}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {state.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
            <b className="block text-lg font-extrabold text-cyan-400">{(state.score || 0).toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</b>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">TOPLAM PUAN</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
            <b className="block text-lg font-extrabold text-green-400">{state.solved || 0}</b>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">ÇÖZÜLEN</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
            <b className="block text-lg font-extrabold text-yellow-400">{state.streak || 0}</b>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">SERİ</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {navItems.map(item => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleNavClick(item.id)}
                className={`league-nav flex-none px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'font-extrabold'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
