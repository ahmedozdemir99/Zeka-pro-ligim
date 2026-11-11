import React from 'react';
import { Lightbulb } from 'lucide-react';

interface Proof {
  title: string;
  explanation: string;
}

const proofsData: Proof[] = [
  {
    title: '0⁰ Neden Özel ve Farklı Ele Alınır?',
    explanation: 'Üs kurallarını doğrudan bütün durumlara uygulamak dikkat ister. Sıfırıncı kuvvetin a≠0 için 1 olması çarpma zincirinin tersinden gelir. Ancak 0⁰ ifadesi farklı bağlamlarda farklı şekilde ele alınır; limitlerde belirsiz biçim olarak da karşımıza çıkar.'
  },
  {
    title: 'Negatif × Negatif Neden Pozitiftir?',
    explanation: 'Dağılma özelliğini korumak zorundayız. 0 = (-a) + a olduğundan b ile çarparsak 0 = (-a)b + ab olur. Eğer b negatifse işaretleri düzenlediğimizde iki negatif sayının çarpımının pozitif olması matematiksel olarak zorunludur.'
  },
  {
    title: '√(a²) Neden Mutlak Değer |a|\'dır?',
    explanation: 'Karekök sembolü asal kökü, yani negatif olmayan kökü ifade eder. a = -5 için a² = 25 ve √25 = 5\'tir. Sonuç -5 olamayacağı için √(a²) = |a| olur.'
  },
  {
    title: '1 Sayısı Neden Asal Sayı Değildir?',
    explanation: 'Asal sayı tam olarak iki pozitif böleni olan 1\'den büyük tam sayıdır. 1\'in yalnızca bir pozitif böleni vardır: kendisi. Aritmetiğin Temel Teoremi (her sayının benzersiz asal çarpanlara ayrılması) için 1 asal kabul edilmez.'
  },
  {
    title: '0 Sayısı Neden Çift Sayıdır?',
    explanation: 'Çift sayı, 2\'nin tam katı olan tam sayıdır. 0 = 2 × 0 olduğundan çift sayı tanımına doğrudan uyar.'
  },
  {
    title: 'Pi (π) Sayısı Neden Bir Sabittir?',
    explanation: 'Bir dairenin çevresinin çapına oranı, dairenin büyüklüğünden bağımsızdır. Daireyi büyüttüğümüzde çevre ve çap aynı oranda büyür; oran hiç değişmez. Bu evrensel sabit π = 3.14159... olarak adlandırılır.'
  },
  {
    title: 'Pisagor Teoremi (a² + b² = c²) Neden Çalışır?',
    explanation: 'Dik üçgende iki dik kenar üzerine kurulan karelerin alanlarının toplamı, hipotenüs üzerine kurulan karenin alanına eşittir. Bunu alan parçalama ve cebirsel açılımla kolayca ispatlayabiliriz.'
  },
  {
    title: 'Çokgenlerin Dış Açıları Toplamı Neden Her Zaman 360°\'dir?',
    explanation: 'Her köşede bir dış açı seçildiğinde çokgenin etrafında tam bir tur (360°) dönülmüş olur. Köşe sayısı ne olursa olsun etrafında 1 tam tur dönüldüğü için dış açılar toplamı 360°\'dir.'
  },
  {
    title: 'Devirli Ondalık Sayılar Neden Kesir Olarak Yazılabilir?',
    explanation: 'Örneğin x = 0,333... olsun. 10x = 3,333... Çıkarırsak 9x = 3 elde edilir ve x = 3/9 = 1/3 bulunur. Bütün devirli sayılar bu yöntemle rasyonel kesre dönüştürülebilir.'
  },
  {
    title: 'Üçgenin Alanı Neden (Taban × Yükseklik) / 2\'dir?',
    explanation: 'Üçgeni aynı büyüklükteki bir eşüçgenle birleştirdiğinizde bir paralelkenar elde edersiniz. Paralelkenarın alanı taban × yükseklik olduğundan, tek üçgen bu alanın tam yarısıdır!'
  }
];

export const WhySection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-gradient-to-r from-[#1a2450] to-[#121938] border border-white/10 p-5 shadow-xl space-y-2">
        <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 font-extrabold text-xs border border-amber-500/30">
          💡 KEŞFET • TAHMİN ET • İSPATLA
        </span>
        <h2 className="text-2xl font-black text-white">Neden Böyle? (Matematiksel İspatlar)</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Matematiğin arkasındaki fikirleri ezberden değil, gerekçesiyle ve mantığıyla öğrenin.
        </p>
      </div>

      <div className="space-y-3">
        {proofsData.map((proof, index) => (
          <div key={index} className="bg-[#171f42] border border-white/10 rounded-2xl p-4 space-y-2 hover:border-amber-500/40 transition-all">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" /> {proof.title}
            </h3>
            <div className="bg-[#0e1530] border border-white/5 rounded-xl p-3 text-xs text-slate-300 leading-relaxed border-l-4 border-l-amber-400">
              {proof.explanation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
