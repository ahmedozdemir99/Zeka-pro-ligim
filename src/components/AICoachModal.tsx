import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, RefreshCw } from 'lucide-react';
import { sound } from '../utils/sound';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICoachModal: React.FC<AICoachModalProps> = ({ isOpen, onClose }) => {
  const [grade, setGrade] = useState<string>('7');
  const [topic, setTopic] = useState<string>('Rasyonel Sayılar ve Mantık');
  const [difficulty, setDifficulty] = useState<string>('orta');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerateCustomQuestion = async () => {
    sound.playClick();
    setLoading(true);
    setGeneratedQuestion(null);
    try {
      const res = await fetch('/api/ai/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, topic, difficulty }),
      });
      const data = await res.json();
      if (data.q) {
        setGeneratedQuestion(data);
        sound.playSuccess();
      } else {
        alert(data.error || 'Soru üretilemedi.');
      }
    } catch {
      alert('AI sunucusuna ulaşılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#171f42] border border-purple-500/40 rounded-3xl p-6 w-full max-w-xl space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-purple-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              AI Zekâ Koçu & Soru Üreteci
            </h3>
            <p className="text-xs text-slate-300">Gemini 3.8 AI ile MEB/LGS tarzı özgün soru üretin!</p>
          </div>
        </div>

        <div className="bg-[#0e1530] border border-white/10 rounded-2xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-cyan-300">Özgün Soru Kriterleri:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Sınıf Seviyesi</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full bg-[#171f42] border border-white/10 text-white rounded-xl p-2 outline-none"
              >
                <option value="5">5. Sınıf</option>
                <option value="6">6. Sınıf</option>
                <option value="7">7. Sınıf</option>
                <option value="8">8. Sınıf (LGS)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Zorluk</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full bg-[#171f42] border border-white/10 text-white rounded-xl p-2 outline-none"
              >
                <option value="kolay">Kolay 🟢</option>
                <option value="orta">Orta 🟡</option>
                <option value="zor">Zor 🔴</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Konu Başlığı</label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full bg-[#171f42] border border-white/10 text-white rounded-xl p-2 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateCustomQuestion}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-lg hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            {loading ? 'AI Yeni Soru Tasarlıyor...' : '✨ Özgün Soru Üret'}
          </button>
        </div>

        {/* Display Generated Question */}
        {generatedQuestion && (
          <div className="bg-purple-950/40 border border-purple-500/40 rounded-2xl p-4 space-y-3 animate-fadeIn text-xs">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span>📌 {generatedQuestion.subject || 'Özgün Soru'}</span>
              <span>Cevap: <b className="text-emerald-400 font-mono text-sm">{generatedQuestion.a}</b></span>
            </div>
            <div className="bg-[#0b1128] border border-white/10 rounded-xl p-3 text-white text-sm leading-relaxed font-medium">
              {generatedQuestion.q}
            </div>
            {generatedQuestion.explanation && (
              <div className="text-slate-300 leading-relaxed pt-1">
                <b className="text-purple-300 block mb-1">💡 Adım Adım Çözüm:</b>
                {generatedQuestion.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
