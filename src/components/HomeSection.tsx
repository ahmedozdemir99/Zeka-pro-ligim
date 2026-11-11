import React from 'react';
import { Trophy, School, Puzzle, Lightbulb, Zap, Users, Play, Star } from 'lucide-react';

interface HomeSectionProps {
  onNavigate: (sec: string) => void;
  onQuickMatch: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onNavigate, onQuickMatch }) => {
  return (
    <div className="space-y-4">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a2450] via-[#171a3b] to-[#0f142e] border border-white/10 p-6 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 font-extrabold text-xs border border-cyan-500/30">
            <Zap className="w-3.5 h-3.5 text-yellow-300" /> ZEKÂ AKADEMİSİ PRO
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Düşün. Keşfet. Yarış.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Matematiksel düşünme, mantık, zekâ oyunları (Sudoku, Kendoku, Apartman, Resfebe) ve öğrenciler arası rekabeti tek yerde birleştiren öğretmen-öğrenci platformu.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('league')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <Trophy className="w-4 h-4 text-yellow-300" />
              Lige Katıl
            </button>
            <button
              onClick={() => onNavigate('games')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Puzzle className="w-4 h-4" />
              Zekâ Oyunları
            </button>
          </div>
        </div>

        {/* Decorative Background Accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Pro Lig */}
        <div className="bg-gradient-to-br from-[#171f42] to-[#141b37] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col justify-between hover:border-purple-500/50 transition-all group">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🏆
            </div>
            <h3 className="text-base font-extrabold text-white">Zekâ Pro Ligi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              İki öğrenci düellosu, takım yarışı veya tek başına yarış. Havuzdan seçilen 10 MEB/LGS tarzı soru.
            </p>
          </div>
          <button
            onClick={() => onNavigate('league')}
            className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-600/20 hover:brightness-110 active:scale-95 transition-all"
          >
            Lige Gir
          </button>
        </div>

        {/* Card 2: Sınıflarım */}
        <div className="bg-gradient-to-br from-[#171f42] to-[#141b37] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col justify-between hover:border-cyan-500/50 transition-all group">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🏫
            </div>
            <h3 className="text-base font-extrabold text-white">Sınıflarım</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              5-8. sınıf şubelerini yönet, Excel/CSV dosyasından toplu öğrenci aktar ve fikstür oluştur.
            </p>
          </div>
          <button
            onClick={() => onNavigate('classes')}
            className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            Sınıfları Yönet
          </button>
        </div>

        {/* Card 3: Zekâ Oyunları */}
        <div className="bg-gradient-to-br from-[#171f42] to-[#141b37] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col justify-between hover:border-rose-500/50 transition-all group">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🧩
            </div>
            <h3 className="text-base font-extrabold text-white">Zekâ Oyunları</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sudoku (9x9), Kendoku (6x6), Apartman (Skyscrapers) ve Resfebe (Rebus) bulmacaları.
            </p>
          </div>
          <button
            onClick={() => onNavigate('games')}
            className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            Oyunlara Git
          </button>
        </div>

        {/* Card 4: Neden Böyle? */}
        <div className="bg-gradient-to-br from-[#171f42] to-[#141b37] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col justify-between hover:border-amber-500/50 transition-all group">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              💡
            </div>
            <h3 className="text-base font-extrabold text-white">Neden Böyle?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Formülleri ezberlemek yerine arkasındaki mantığı ve geometrik ispatları keşfet.
            </p>
          </div>
          <button
            onClick={() => onNavigate('why')}
            className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            İspatları Keşfet
          </button>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" /> Hızlı Başlangıç
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => onNavigate('classes')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
          >
            <School className="w-4 h-4 text-cyan-400" /> Sınıf Oluştur
          </button>
          <button
            onClick={onQuickMatch}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 transition-all"
          >
            <Play className="w-4 h-4 fill-white" /> Hemen Maç Başlat
          </button>
          <button
            onClick={() => onNavigate('weekly')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
          >
            <Star className="w-4 h-4 text-yellow-300" /> Haftanın Sorusu
          </button>
        </div>
      </div>
    </div>
  );
};
