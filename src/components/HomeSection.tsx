import { ArrowRight, BookOpen, Flag, Puzzle, Shield, Trophy, User, Users } from 'lucide-react';
import type { MatchSetup } from '../types';

const modes = [
  { id: 'solo', title: 'Hızlı Maç', label: 'Tek oyuncu · 5 soru', description: 'Sınıf seviyeni seç ve tek başına sahaya çık.', icon: User },
  { id: 'duel', title: 'Mini Düello', label: 'İki oyuncu · 5 soru', description: 'Aynı sınıftan iki öğrenci, aynı ekranda karşı karşıya.', icon: Users },
  { id: 'team', title: 'Takım Maçı', label: 'İki takım · 10 soru', description: 'Kadro kur, takımını seç ve lig puanı için yarış.', icon: Shield },
] as const;

const links = [
  { id: 'training', label: 'Antrenman', icon: Flag },
  { id: 'classes', label: 'Sınıflarım', icon: Users },
  { id: 'games', label: 'Zekâ Oyunları', icon: Puzzle },
  { id: 'weekly', label: 'Haftanın Sorusu', icon: BookOpen },
];

export function HomeSection({ onNavigate, onMatch }: {
  onNavigate: (section: string) => void;
  onMatch: (mode: MatchSetup['mode']) => void;
}) {
  return (
    <div className="space-y-7">
      <section className="league-hero">
        <div className="league-hero-content">
          <p className="league-kicker"><Trophy size={15} aria-hidden="true" /> 5–8. sınıf matematik ligi</p>
          <h2 className="league-display">Zekâ Pro<br /><span>Ligim</span></h2>
          <p className="max-w-sm text-base leading-relaxed text-slate-200">Seçtiğin dersin sorularını çöz, gol at ve sınıf liginde puan topla.</p>
          <button type="button" className="league-primary mt-6" onClick={() => onMatch('solo')}>
            Hızlı Maç <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="league-pitch-wrap" aria-hidden="true">
          <div className="league-pitch">
            <div className="league-pitch-markings">
              <span className="league-pitch-center" />
              <span className="league-pitch-box league-pitch-box-left" />
              <span className="league-pitch-box league-pitch-box-right" />
              <span className="league-pitch-player league-pitch-player-a">1</span>
              <span className="league-pitch-player league-pitch-player-b">2</span>
              <span className="league-pitch-ball" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="match-modes-title">
        <h2 id="match-modes-title" className="league-section-title">Maç Modları</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {modes.map(({ id, title, label, description, icon: Icon }) => (
            <button key={id} type="button" className={`league-mode league-mode-${id}`} onClick={() => onMatch(id)}>
              <Icon size={24} className="league-mode-icon" aria-hidden="true" />
              <span className="league-mode-name">{title}</span>
              <span className="league-mode-meta">{label}</span>
              <span className="league-mode-description">{description}</span>
              <ArrowRight size={18} className="league-mode-arrow" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <div className="league-shortcuts">
        {links.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => onNavigate(id)}>
            <Icon size={17} aria-hidden="true" /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}
