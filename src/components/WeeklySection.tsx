import React, { useState } from 'react';
import { Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { sound } from '../utils/sound';

export const WeeklySection: React.FC = () => {
  const [selectedBox, setSelectedBox] = useState<string>('A');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'no'; text: string } | null>(null);

  const checkWeekly = () => {
    sound.playClick();
    if (selectedBox === 'A') {
      sound.playSuccess();
      setFeedback({
        type: 'ok',
        text: '🎉 MÜKEMMEL! Ödül A Kutusunda! Çözüm Mantığı: Sadece B kutusundaki ifade ("Ödül bu kutuda değil") DOĞRUDUR. A ve C kutularının üzerindeki ifadeler ise YANLIŞTIR. Böylece tam olarak yalnız 1 cümle doğru kalır.'
      });
    } else {
      sound.playError();
      setFeedback({
        type: 'no',
        text: '❌ Yanlış Cevap. İpucu: Ödül B veya C kutusunda olsaydı 2 cümle birden doğru olurdu! Lütfen kutuların üstündeki cümleleri tek tek kontrol edin.'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-gradient-to-r from-[#1a2450] to-[#121938] border border-white/10 p-5 shadow-xl space-y-2">
        <span className="px-3 py-1 rounded-full bg-yellow-500/15 text-yellow-300 font-extrabold text-xs border border-yellow-500/30">
          ⭐ HAFTANIN MEYDAN OKUMASI
        </span>
        <h2 className="text-2xl font-black text-white">Bu Haftanın Sorusu: Üç Kutu Mantık Problemi</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Tek soru. Birden fazla düşünme yolu. Amaç yalnızca cevabı bulmak değil, mantıksal nedenini izah etmektir.
        </p>
      </div>

      <div className="bg-[#171f42] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="space-y-3 leading-relaxed text-sm text-slate-200">
          <p>
            Üç kutunun üzerinde <b>A, B, C</b> yazıyor. Kutulardan yalnızca bir tanesinde büyük ödül var.
          </p>

          <div className="bg-[#0e1530] border border-white/10 rounded-2xl p-4 space-y-2 text-xs font-mono text-cyan-300">
            <div>• <b>A Kutusunun üstünde:</b> “Ödül B'de.”</div>
            <div>• <b>B Kutusunun üstünde:</b> “Ödül bu kutuda değil.”</div>
            <div>• <b>C Kutusunun üstünde:</b> “Ödül A'da değil.”</div>
          </div>

          <p className="text-xs text-amber-300 font-bold">
            Bu üç cümleden YALNIZCA BİRİ DOĞRU ise ödül hangi kutudadır?
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400">Seçiminiz:</label>
          <div className="flex gap-2">
            {['A', 'B', 'C'].map(box => (
              <button
                key={box}
                onClick={() => setSelectedBox(box)}
                className={`flex-1 py-3 rounded-xl font-extrabold text-sm transition-all border ${
                  selectedBox === box
                    ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {box} Kutusu
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={checkWeekly}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          ✓ Cevabımı Kontrol Et
        </button>

        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold leading-relaxed border animate-fadeIn ${
              feedback.type === 'ok'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            }`}
          >
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};
