import React, { useState } from 'react';
import { Calculator, Lightbulb, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface MathItem {
  icon: string;
  title: string;
  question: string;
  explanation: string;
}

const mathItems: MathItem[] = [
  {
    icon: '🧩',
    title: 'İki Kapı Problemi',
    question: 'Bir kapı doğru yola, diğeri yanlış yola gidiyor. İki bekçiden biri hep doğru, biri hep yanlış söyler. Tek soru hakkın var. Doğru kapıyı nasıl seçersin?',
    explanation: "Bir bekçiye: 'Diğer bekçiye hangi kapı doğru diye sorsaydım hangisini gösterirdi?' diye sor ve gösterdiği kapının TERSİNİ seç. Doğru söyleyen yalancının yalanını iletir, yalancı da doğrunun cevabını yalanlar. İkisi de kesinlikle YANLIŞ kapıyı gösterir!"
  },
  {
    icon: '🔢',
    title: 'Kare Sayıların Geometrik Deseni',
    question: '1, 4, 9, 16, 25 dizisini ezberlemek yerine geometrik olarak tek sayılarla nasıl açıklayabilirsin?',
    explanation: 'n² sayısı, kenarı n olan karedir. 1 (1x1), 1+3=4 (2x2), 4+5=9 (3x3), 9+7=16 (4x4). Ardışık karelerin farkı ardışık tek sayılardır (1, 3, 5, 7, 9...).'
  },
  {
    icon: '📐',
    title: 'Üçgenin İç Açıları Neden 180°?',
    question: 'Bir üçgenin iç açıları toplamı neden her zaman 180° eder?',
    explanation: 'Üçgenin bir köşesinden karşı kenara paralel bir doğru çizin. İç ters açılardan dolayı üçgenin diğer iki açısı bu doğru üzerinde yan yana gelerek düz bir doğru (180°) oluşturur!'
  },
  {
    icon: '🧠',
    title: 'İmkânsız Kare',
    question: 'Bir karenin alanı 36 ise çevresi neden kesinlikle 24 olmak zorundadır?',
    explanation: 'Karenin alanı a × a = a²’dir. a² = 36 ise bir kenarı a = √36 = 6 m’dir. Çevre 4 × a = 4 × 6 = 24 m’dir. Başka bir değer geometrik olarak imkânsızdır.'
  },
  {
    icon: '🔍',
    title: 'Dizideki Gizli Kural',
    question: '3, 6, 11, 18, 27, ? dizisinde soru işareti yerine ne gelmelidir?',
    explanation: 'Farklara bakalım: +3, +5, +7, +9. Farklar 2’şer artan tek sayılardır! Sonraki fark +11 olmalıdır. 27 + 11 = 38.'
  },
  {
    icon: '🎯',
    title: 'Sıfırın Çift Sayı Olmasının Mantığı',
    question: '0 neden bir çift sayıdır?',
    explanation: 'Çift sayı 2’nin tam katı olan tam sayılardır. 0 = 2 × 0 olduğundan ve 2 ile tam bölündüğünden 0 kesinlikle çifttir.'
  }
];

export const MathSection: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    sound.playClick();
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-gradient-to-r from-[#1a2450] to-[#121938] border border-white/10 p-5 shadow-xl space-y-2">
        <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 font-extrabold text-xs border border-cyan-500/30">
          🔢 MATEMATİKSEL DÜŞÜNME
        </span>
        <h2 className="text-2xl font-black text-white">Matematik ve Mantık Bulmacaları</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Ezberci işlem yapmak yerine düşünmeyi, muhakeme etmeyi ve arkasındaki derin mantığı görmeyi öğrenin.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {mathItems.map((item, index) => {
          const isOpen = expandedIndex === index;
          return (
            <div key={index} className="bg-[#171f42] border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-cyan-500/30 transition-all">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="text-sm font-extrabold text-white">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.question}</p>
              </div>

              <div>
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-cyan-300 hover:bg-white/10 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-yellow-300" /> Düşünceyi & Çözümü Gör
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isOpen && (
                  <div className="mt-2 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-100 leading-relaxed animate-fadeIn">
                    {item.explanation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
