import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, CheckCircle2, X } from 'lucide-react';
import { sound } from '../utils/sound';

interface WinnerModalProps {
  winner: string | null;
  p1Name: string;
  p2Name: string;
  score1: number;
  score2: number;
  isTeam?: boolean;
  onClose: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  p1Name,
  p2Name,
  score1,
  score2,
  isTeam = false,
  onClose
}) => {
  useEffect(() => {
    if (winner) {
      sound.playFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [winner]);

  if (!winner) return null;

  const isDraw = winner === 'Beraberlik';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-[#202b5d] to-[#121832] border border-yellow-400/40 rounded-3xl p-6 w-full max-w-md text-center shadow-2xl space-y-4 animate-scaleUp">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-yellow-400/20 text-yellow-300 flex items-center justify-center text-4xl shadow-xl shadow-yellow-500/20 animate-bounce">
          {isDraw ? '🤝' : '🏆'}
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-xs border border-cyan-500/30">
          MAÇ TAMAMLANDI
        </span>

        <div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-cyan-300">
            {isDraw ? 'Beraberlik!' : `Kazanan: ${winner}`}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isDraw ? 'İki taraf da harika mücadele etti!' : `Tebrikler ${winner}! Şampiyonluğu kazandın! 🎉`}
          </p>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <b className="block text-2xl font-black text-cyan-400">{score1}</b>
            <span className="text-[11px] text-slate-400 font-semibold">{p1Name}</span>
          </div>
          {p2Name && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <b className="block text-2xl font-black text-yellow-400">{score2}</b>
              <span className="text-[11px] text-slate-400 font-semibold">{p2Name}</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg hover:brightness-110 transition-all"
        >
          Tamam
        </button>
      </div>
    </div>
  );
};
