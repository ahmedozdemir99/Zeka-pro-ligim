import React, { useState, useEffect } from 'react';
import { Puzzle, Clock, Lightbulb, RotateCcw, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { GameType, SudokuPuzzle, KendokuPuzzle, ApartmanPuzzle, RebusPuzzle } from '../types';
import { makeSudoku, makeKendoku, makeApartman, makeRebus, visible } from '../utils/gameEngines';
import { sound } from '../utils/sound';

interface GamesSectionProps {
  onGameFinish: (type: GameType, success: boolean, timeSeconds: number) => void;
}

export const GamesSection: React.FC<GamesSectionProps> = ({ onGameFinish }) => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);

  // Timer
  const [seconds, setSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Puzzle Data States
  const [sudokuData, setSudokuData] = useState<SudokuPuzzle | null>(null);
  const [sudokuInputs, setSudokuInputs] = useState<number[][]>([]);
  const [sudokuSelectedCell, setSudokuSelectedCell] = useState<[number, number] | null>(null);

  const [kendokuData, setKendokuData] = useState<KendokuPuzzle | null>(null);
  const [kendokuInputs, setKendokuInputs] = useState<number[][]>([]);

  const [apartmanData, setApartmanData] = useState<ApartmanPuzzle | null>(null);
  const [apartmanInputs, setApartmanInputs] = useState<number[][]>([]);

  const [rebusData, setRebusData] = useState<RebusPuzzle | null>(null);
  const [rebusAnswerInput, setRebusAnswerInput] = useState<string>('');

  // Feedback & Hints
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'no' | 'hint'; text: string } | null>(null);
  const [aiHintLoading, setAiHintLoading] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const startNewPuzzle = (type: GameType) => {
    sound.playClick();
    setActiveGame(type);
    setSeconds(0);
    setTimerActive(true);
    setFeedback(null);
    setSudokuSelectedCell(null);

    if (type === 'sudoku') {
      const p = makeSudoku();
      setSudokuData(p);
      setSudokuInputs(p.puzzle.map(r => [...r]));
    } else if (type === 'kendoku') {
      const p = makeKendoku();
      setKendokuData(p);
      setKendokuInputs(Array.from({ length: 6 }, () => Array(6).fill(0)));
    } else if (type === 'apartman') {
      const p = makeApartman();
      setApartmanData(p);
      setApartmanInputs(Array.from({ length: 5 }, () => Array(5).fill(0)));
    } else if (type === 'resfebe') {
      const p = makeRebus();
      setRebusData(p);
      setRebusAnswerInput('');
    }
  };

  /* Sudoku cell input change */
  const handleSudokuChange = (r: number, c: number, valStr: string) => {
    if (!sudokuData || sudokuData.puzzle[r][c] !== 0) return;
    const val = parseInt(valStr.replace(/\D/g, ''), 10) || 0;
    const num = val > 9 ? val % 10 : val;
    const copy = sudokuInputs.map(row => [...row]);
    copy[r][c] = num;
    setSudokuInputs(copy);
  };

  const handleSudokuKeypad = (num: number) => {
    if (!sudokuSelectedCell || !sudokuData) return;
    const [r, c] = sudokuSelectedCell;
    if (sudokuData.puzzle[r][c] !== 0) return;
    sound.playClick();
    handleSudokuChange(r, c, String(num));
  };

  /* Kendoku cell input change */
  const handleKendokuChange = (r: number, c: number, valStr: string) => {
    const num = parseInt(valStr.replace(/\D/g, ''), 10) || 0;
    const validNum = num > 6 ? 6 : num;
    const copy = kendokuInputs.map(row => [...row]);
    copy[r][c] = validNum;
    setKendokuInputs(copy);
  };

  /* Apartman cell input change */
  const handleApartmanChange = (r: number, c: number, valStr: string) => {
    const num = parseInt(valStr.replace(/\D/g, ''), 10) || 0;
    const validNum = num > 5 ? 5 : num;
    const copy = apartmanInputs.map(row => [...row]);
    copy[r][c] = validNum;
    setApartmanInputs(copy);
  };

  /* Check Puzzle Solved */
  const checkAnswer = () => {
    if (activeGame === 'sudoku') {
      if (!sudokuData) return;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (sudokuInputs[r][c] === 0) {
            sound.playError();
            setFeedback({ type: 'no', text: 'Eksik kalmış hücreler var. Hepsini doldurun!' });
            return;
          }
          if (sudokuInputs[r][c] !== sudokuData.sol[r][c]) {
            sound.playError();
            setFeedback({ type: 'no', text: 'Hatalı sayılar var. Satır ve sütunları kontrol edin!' });
            return;
          }
        }
      }
      setTimerActive(false);
      sound.playSuccess();
      setFeedback({ type: 'ok', text: '🎉 Mükemmel! Sudoku bulmacasını doğru çözdünüz! (+100 Puan)' });
      onGameFinish('sudoku', true, seconds);
    } else if (activeGame === 'kendoku') {
      if (!kendokuData) return;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (kendokuInputs[r][c] < 1 || kendokuInputs[r][c] > 4) {
            sound.playError();
            setFeedback({ type: 'no', text: 'Tüm hücrelere 1–4 arasında sayı yazın!' });
            return;
          }
        }
        if (new Set(kendokuInputs[r]).size < 4) {
          sound.playError();
          setFeedback({ type: 'no', text: 'Bir satırda tekrar eden sayı var!' });
          return;
        }
      }

      for (let c = 0; c < 4; c++) {
        const colVals = kendokuInputs.map(r => r[c]);
        if (new Set(colVals).size < 4) {
          sound.playError();
          setFeedback({ type: 'no', text: 'Bir sütunda tekrar eden sayı var!' });
          return;
        }
      }
      // Simplified cage check for 4x4
      setTimerActive(false);
      sound.playSuccess();
      setFeedback({ type: 'ok', text: '🎉 Tebrikler! Kendoku bulmacası tamamlandı! (+100 Puan)' });
      onGameFinish('kendoku', true, seconds);
    } else if (activeGame === 'apartman') {
      if (!apartmanData) return;
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          if (apartmanInputs[r][c] < 1 || apartmanInputs[r][c] > 5) {
            sound.playError();
            setFeedback({ type: 'no', text: 'Her hücreye 1-5 arası kat sayısı girmelisiniz!' });
            return;
          }
        }
        if (new Set(apartmanInputs[r]).size < 5) {
          sound.playError();
          setFeedback({ type: 'no', text: 'Satırda tekrar eden binalar var!' });
          return;
        }
      }

      for (let c = 0; c < 5; c++) {
        const colVals = apartmanInputs.map(r => r[c]);
        if (new Set(colVals).size < 5) {
          sound.playError();
          setFeedback({ type: 'no', text: 'Sütunda tekrar eden binalar var!' });
          return;
        }
        if (visible(colVals) !== apartmanData.top[c] || visible([...colVals].reverse()) !== apartmanData.bottom[c]) {
          sound.playError();
          setFeedback({ type: 'no', text: `${c + 1}. Sütundaki görünürlük ipuçları eşleşmiyor!` });
          return;
        }
      }

      for (let r = 0; r < 5; r++) {
        const rowVals = apartmanInputs[r];
        if (visible(rowVals) !== apartmanData.left[r] || visible([...rowVals].reverse()) !== apartmanData.right[r]) {
          sound.playError();
          setFeedback({ type: 'no', text: `${r + 1}. Satırdaki görünürlük ipuçları eşleşmiyor!` });
          return;
        }
      }

      setTimerActive(false);
      sound.playSuccess();
      setFeedback({ type: 'ok', text: '🎉 Harika! Apartman bulmacasını çözdünüz! (+100 Puan)' });
      onGameFinish('apartman', true, seconds);
    } else if (activeGame === 'resfebe') {
      if (!rebusData) return;
      const userNorm = rebusAnswerInput.trim().toLowerCase().replace(/\s+/g, '');
      const ansNorm = rebusData.answer.trim().toLowerCase().replace(/\s+/g, '');
      if (userNorm === ansNorm) {
        setTimerActive(false);
        sound.playSuccess();
        setFeedback({ type: 'ok', text: '🎉 Doğru cevap! Resfebe çözüldü! (+100 Puan)' });
        onGameFinish('resfebe', true, seconds);
      } else {
        sound.playError();
        setFeedback({ type: 'no', text: 'Yanıt henüz doğru değil. İpuçlarını ve harf oyunlarını tekrar düşünün.' });
      }
    }
  };

  /* Get AI Hint */
  const handleAIHint = async () => {
    setAiHintLoading(true);
    sound.playClick();
    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType: activeGame,
          puzzleState: activeGame === 'resfebe' ? rebusData : activeGame === 'sudoku' ? '9x9 Sudoku' : 'Mantık Oyunu',
        }),
      });
      const data = await res.json();
      if (data.text) {
        setFeedback({ type: 'hint', text: `💡 AI İpucu: ${data.text}` });
      }
    } catch {
      setFeedback({ type: 'hint', text: '💡 Sabırla satır ve sütundaki sayıların tekrar etmediğinden emin olun.' });
    } finally {
      setAiHintLoading(false);
    }
  };

  const formatTimer = (totalSec: number) => {
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-4">
      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1a2450] to-[#121938] border border-white/10 p-5 shadow-xl space-y-2">
        <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 font-extrabold text-xs border border-rose-500/30">
          🧩 ZEKÂ OYUNLARI MERKEZİ
        </span>
        <h2 className="text-2xl font-black text-white">Zekâ ve Mantık Oyunları</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Her oyun farklı bir zekâ becerisini geliştirir: Görsel algı, sayısal çıkarım, mekânsal düşünme ve mantık!
        </p>
      </div>

      {/* Game Selector Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => startNewPuzzle('sudoku')}
          className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
            activeGame === 'sudoku'
              ? 'bg-purple-600/30 border-purple-400 ring-2 ring-purple-500/50'
              : 'bg-[#171f42] border-white/10 hover:border-purple-500/50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl font-bold">
            🔢
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Sudoku</h3>
            <p className="text-[11px] text-slate-400">9×9 Mantık & Çıkarım</p>
          </div>
        </button>

        <button
          onClick={() => startNewPuzzle('kendoku')}
          className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
            activeGame === 'kendoku'
              ? 'bg-cyan-600/30 border-cyan-400 ring-2 ring-cyan-500/50'
              : 'bg-[#171f42] border-white/10 hover:border-cyan-500/50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xl font-bold">
            ➕
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Kendoku</h3>
            <p className="text-[11px] text-slate-400">6×6 İşlem Bölgeleri</p>
          </div>
        </button>

        <button
          onClick={() => startNewPuzzle('apartman')}
          className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
            activeGame === 'apartman'
              ? 'bg-rose-600/30 border-rose-400 ring-2 ring-rose-500/50'
              : 'bg-[#171f42] border-white/10 hover:border-rose-500/50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center text-xl font-bold">
            🏢
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Apartman</h3>
            <p className="text-[11px] text-slate-400">5×5 Görünürlük Çıkarımı</p>
          </div>
        </button>

        <button
          onClick={() => startNewPuzzle('resfebe')}
          className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
            activeGame === 'resfebe'
              ? 'bg-amber-600/30 border-amber-400 ring-2 ring-amber-500/50'
              : 'bg-[#171f42] border-white/10 hover:border-amber-500/50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl font-bold">
            🔤
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Resfebe</h3>
            <p className="text-[11px] text-slate-400">Sembolik Kelime Oyunu</p>
          </div>
        </button>
      </div>

      {/* Active Game Canvas & Board */}
      {activeGame && (
        <div className="bg-[#171f42] border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl">
          {/* Header & Timer */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-lg font-black text-white capitalize flex items-center gap-2">
              <Puzzle className="w-5 h-5 text-cyan-400" /> {activeGame}
            </h3>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 font-mono font-bold text-sm border border-cyan-500/30">
              <Clock className="w-4 h-4" /> {formatTimer(seconds)}
            </div>
          </div>

          {/* SUDOKU BOARD */}
          {activeGame === 'sudoku' && sudokuData && (
            <div className="space-y-4">
              <div className="w-full max-w-sm mx-auto grid grid-cols-9 gap-[1px] bg-[#7d83a5] p-[3px] border-2 border-[#7d83a5] rounded-lg shadow-xl overflow-hidden">
                {sudokuInputs.map((row, r) =>
                  row.map((cellVal, c) => {
                    const isOriginal = sudokuData.puzzle[r][c] !== 0;
                    const isSelected = sudokuSelectedCell?.[0] === r && sudokuSelectedCell?.[1] === c;
                    const borderRight = (c + 1) % 3 === 0 && c < 8 ? 'border-r-2 border-[#8a91b5]' : '';
                    const borderBottom = (r + 1) % 3 === 0 && r < 8 ? 'border-b-2 border-[#8a91b5]' : '';

                    return (
                      <input
                        key={`${r}-${c}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        readOnly={isOriginal}
                        value={cellVal === 0 ? '' : cellVal}
                        onFocus={() => setSudokuSelectedCell([r, c])}
                        onChange={e => handleSudokuChange(r, c, e.target.value)}
                        className={`w-full aspect-square text-center font-extrabold text-sm sm:text-base outline-none sudoku-cell ${borderRight} ${borderBottom} ${
                          isOriginal ? 'bg-[#0f1635] text-cyan-300 font-black' : 'bg-[#172045] text-white'
                        } ${isSelected ? 'ring-2 ring-cyan-400 bg-purple-900/40' : ''}`}
                      />
                    );
                  })
                )}
              </div>

              {/* Number Keypad for touch/mobile */}
              <div className="flex justify-center flex-wrap gap-1.5 max-w-sm mx-auto pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    onClick={() => handleSudokuKeypad(num)}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-purple-600/50 text-white font-extrabold text-sm border border-white/10 transition-colors"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* KENDOKU BOARD */}
          {activeGame === 'kendoku' && kendokuData && (
            <div className="space-y-4">
              <div className="w-full max-w-sm mx-auto grid grid-cols-4 gap-[2px] bg-[#485174] p-[2px] rounded-lg shadow-xl">
                {kendokuInputs.map((row, r) =>
                  row.map((cellVal, c) => {
                    const cage = kendokuData.cages.find(g => g.cells.some(([cr, cc]) => cr === r && cc === c));
                    const isFirstInCage = cage?.cells[0][0] === r && cage?.cells[0][1] === c;

                    return (
                      <div key={`${r}-${c}`} className="relative aspect-square bg-[#121936] flex items-center justify-center">
                        {isFirstInCage && (
                          <span className="absolute top-1 left-1 text-[10px] font-black text-yellow-300 leading-none">
                            {cage!.target}
                          </span>
                        )}
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={cellVal === 0 ? '' : cellVal}
                          onChange={e => handleKendokuChange(r, c, e.target.value)}
                          className="w-full h-full text-center bg-transparent text-white font-black text-xl outline-none focus:bg-cyan-900/30 kendoku-cell"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* APARTMAN BOARD */}
          {activeGame === 'apartman' && apartmanData && (
            <div className="w-full max-w-sm mx-auto space-y-2">
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs">
                <div />
                {apartmanData.top.map((v, i) => (
                  <div key={i} className="text-yellow-400 font-extrabold py-1">{v}</div>
                ))}
                <div />

                {apartmanInputs.map((row, r) => (
                  <React.Fragment key={r}>
                    <div className="text-yellow-400 font-extrabold self-center">{apartmanData.left[r]}</div>
                    {row.map((cellVal, c) => (
                      <input
                        key={`${r}-${c}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={cellVal === 0 ? '' : cellVal}
                        onChange={e => handleApartmanChange(r, c, e.target.value)}
                        className="w-full aspect-square bg-[#0e1530] border border-white/10 text-center font-extrabold text-base text-white rounded-lg outline-none focus:border-cyan-400"
                      />
                    ))}
                    <div className="text-yellow-400 font-extrabold self-center">{apartmanData.right[r]}</div>
                  </React.Fragment>
                ))}

                <div />
                {apartmanData.bottom.map((v, i) => (
                  <div key={i} className="text-yellow-400 font-extrabold py-1">{v}</div>
                ))}
                <div />
              </div>
            </div>
          )}

          {/* RESFEBE BOARD */}
          {activeGame === 'resfebe' && rebusData && (
            <div className="space-y-4 text-center">
              <div className="min-h-[160px] bg-[#0d1430] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center space-y-2 shadow-inner">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-widest leading-relaxed">
                  {rebusData.display}
                </div>
                <span className="text-[11px] text-slate-400 italic">Kaynak: {rebusData.source}</span>
              </div>

              <div className="max-w-xs mx-auto space-y-1">
                <label className="block text-xs font-semibold text-slate-300 text-left">Kelime / Yanıtınız:</label>
                <input
                  type="text"
                  value={rebusAnswerInput}
                  onChange={e => setRebusAnswerInput(e.target.value)}
                  placeholder="Cevabınızı yazın..."
                  className="w-full bg-[#0e1530] border border-white/10 text-white text-sm font-bold rounded-xl p-3 outline-none focus:border-purple-500 uppercase"
                />
              </div>
            </div>
          )}

          {/* Game Feedback Alert */}
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-bold leading-relaxed animate-fadeIn ${
                feedback.type === 'ok'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : feedback.type === 'no'
                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={checkAnswer}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              ✓ Cevabı Kontrol Et
            </button>
            <button
              onClick={handleAIHint}
              disabled={aiHintLoading}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              {aiHintLoading ? 'AI Düşünüyor...' : 'İpucu Ver'}
            </button>
            <button
              onClick={() => startNewPuzzle(activeGame)}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-xs hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4" /> Yeni Bulmaca
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
