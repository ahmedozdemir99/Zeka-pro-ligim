import { useEffect, useRef, useState } from 'react';
import type { Figure, MatchSettings } from '../types';
import { courseName, courses, outcomesFor, times } from '../utils/competition';

export function CompetitionSettings({ settings, onChange, grade }: {
  settings: MatchSettings; onChange: (settings: MatchSettings) => void; grade: string | number;
}) {
  const outcomes = settings.course === 'all' ? [] : outcomesFor(grade, settings.course);
  return <div className="grid w-full gap-3 sm:grid-cols-3">
    <label className="league-field">Ders<select value={settings.course} onChange={e => onChange({ ...settings, course: e.target.value as MatchSettings['course'], outcomeCode: undefined })}>
      {(['all', ...courses] as const).map(course => <option key={course} value={course}>{courseName(course, grade)}</option>)}
    </select></label>
    {outcomes.length > 0 && <label className="league-field">Kazanım
      <select value={settings.outcomeCode ?? ''} onChange={e => onChange({ ...settings, outcomeCode: e.target.value || undefined })}>
        <option value="">Tüm kazanımlar</option>
        {outcomes.map(([code, name]) => <option value={code} key={code}>{code} · {name}</option>)}
      </select>
    </label>}
    <label className="league-field">Soru biçimi<select value={settings.format} onChange={e => onChange({ ...settings, format: e.target.value as MatchSettings['format'] })}>
      <option value="open">Açık uçlu</option><option value="multiple">Çoktan seçmeli</option>
    </select></label>
    <label className="league-field">Soru başına süre<select value={settings.seconds} onChange={e => onChange({ ...settings, seconds: Number(e.target.value) })}>
      {times.map(seconds => <option key={seconds} value={seconds}>{seconds ? seconds + ' saniye' : 'Süresiz'}</option>)}
    </select></label>
  </div>;
}

export function AnswerField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (value: string) => void; options?: string[];
}) {
  if (!options) return <label className="league-field">{label}<input value={value} onChange={e => onChange(e.target.value)} maxLength={160} autoComplete="off" /></label>;
  return <fieldset className="min-w-0"><legend className="mb-2 text-sm font-bold">{label}</legend>
    <div className="grid gap-2 sm:grid-cols-2">{options.map((option, i) => <button type="button" key={option} aria-pressed={value === option}
      className={`min-h-11 rounded-xl border p-2 text-left text-sm ${value === option ? 'border-sky-200 bg-sky-200/20' : 'border-white/15 bg-black/20'}`}
      onClick={() => onChange(option)}><b className="mr-2 text-sky-200">{'ABCD'[i]}</b>{option}</button>)}</div>
  </fieldset>;
}

export function Timer({ deadline }: { deadline?: number }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (deadline === undefined) return;
    const timer = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(timer);
  }, [deadline]);
  if (deadline === undefined) return null;
  const seconds = Math.max(0, Math.ceil((deadline - Math.max(Date.now(), now)) / 1000));
  return <p role="timer" aria-label="Kalan soru süresi" className="font-bold tabular-nums text-sky-200">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</p>;
}

export function Diagram({ figure }: { figure?: Figure }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current?.getContext('2d');
    if (!c || !figure) return;
    c.clearRect(0, 0, 640, 300);
    c.save();
    c.scale(2, 2);
    c.strokeStyle = '#173253';
    c.fillStyle = '#173253';
    c.lineWidth = 2;
    c.font = 'bold 13px sans-serif';
    if (figure.kind === 'bars') {
      const max = Math.ceil(Math.max(...figure.values) / 5) * 5;
      c.beginPath(); c.moveTo(35, 19); c.lineTo(35, 119); c.lineTo(298, 119); c.stroke();
      figure.values.forEach((value, i) => {
        const x = 58 + 61 * i, height = 94 * value / max;
        c.fillStyle = '#2e719e'; c.fillRect(x, 118 - height, 32, height);
        c.fillStyle = '#173253'; c.fillText(String(value), x + 7, 111 - height);
        c.fillText(['Pzt', 'Sal', 'Çar', 'Per'][i], x + 4, 138);
      });
    } else {
      const scale = Math.min(170 / figure.width, 80 / figure.height);
      const w = scale * figure.width, h = scale * figure.height, x = 74, y = 112;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h);
      if (figure.kind === 'rectangle') c.lineTo(x + w, y - h);
      c.lineTo(x + w, y); c.closePath(); c.stroke();
      if (figure.kind === 'triangle') {
        c.strokeRect(x, y - 10, 10, 10);
        c.fillText('?', x + w / 2 + 5, y - h / 2 - 8);
      }
      if (figure.diagonal) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y - h); c.stroke(); }
      c.fillText(figure.hideWidth ? '?' : figure.width + ' cm', x + w / 2 - 16, y + 19);
      c.fillText(figure.height + ' cm', 12, y - h / 2);
    }
    c.restore();
  }, [figure]);
  if (!figure) return null;
  const description = figure.kind === 'bars'
    ? `Sütun grafiği. Pazartesi, salı, çarşamba ve perşembe sırasıyla ${figure.values.join(', ')} pil.`
    : `${figure.kind === 'triangle' ? 'Dik üçgen, hipotenüs bilinmiyor' : 'Dikdörtgen'}. Yatay kenar ${figure.hideWidth ? 'bilinmiyor' : figure.width + ' cm'}, düşey kenar ${figure.height} cm.`;
  return <canvas ref={canvas} width={640} height={300} role="img" aria-label={description}
    className="w-full max-w-sm rounded-xl bg-sky-50">{description}</canvas>;
}
