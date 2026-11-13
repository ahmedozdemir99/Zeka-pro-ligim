import type { Question } from '../types';

type Seed = Pick<Question, 'q' | 'a' | 'explanation' | 'figure' | 'distractors'>;
type Family = { grade: number; code: string; name: string; make: (n: number) => Seed };
const numeric = (q: string, answer: number, explanation: string, figure?: Question['figure']): Seed =>
  ({ q, a: String(answer), explanation, figure });

const families: Family[] = [
  { grade: 5, code: 'MAT.5.1.2', name: 'Doğal sayılarla günlük yaşam problemleri', make: n => {
    const boxes = 8 + n;
    return numeric(`Okulun kitap kampanyasında ${boxes} kutunun her birinde 24 kitap var. İlk gün 37 kitap dağıtılıyor. Kalan kitaplar 5 rafa eşit paylaştırılırsa raflar dışında kaç kitap kalır?`,
      (24 * boxes - 37) % 5, `Önce 24 × ${boxes} − 37 işlemi yapılır. Sonucun 5’e bölümünden kalan aranır.`);
  }},
  { grade: 5, code: 'MAT.5.1.4', name: 'Farklı gösterimlerde kesirleri karşılaştırma', make: n => {
    const a = 11 + 2 * n;
    return { q: `Bahçe grubunun topladığı atıkların A kutusunda %${a}, B kutusunda ${a - 2}/100, C kutusunda 0,${a + 4}, D kutusunda ${a + 1}/100 oranında kâğıt var. Kâğıt oranı en yüksek kutu hangisidir?`,
      a: 'C', distractors: ['A', 'B', 'D'], explanation: 'Dört oran yüzde olarak yazıldığında C’nin payı en büyüktür.' };
  }},
  { grade: 5, code: 'MAT.5.4.1', name: 'Çevresi verilen dikdörtgenin kenarlarını yorumlama', make: n => {
    const w = 11 + n, h = 4 + n % 4;
    return numeric(`Şekildeki okul panosunun çevresi ${2 * (w + h)} cm. Kısa kenarı ${h} cm ise gösterilmeyen uzun kenarı kaç santimetredir?`, w,
      `Çevrenin yarısı iki komşu kenarın toplamıdır. ${w + h} − ${h} = ${w}.`, { kind: 'rectangle', width: w, height: h, hideWidth: true });
  }},
  { grade: 5, code: 'MAT.5.4.2', name: 'Dikdörtgenin alanını birim kareyle ilişkilendirme', make: n => {
    const w = 9 + n, h = 5 + n % 3;
    return numeric('Şekildeki dikdörtgen 1 cm kenarlı karelerle boşluk kalmadan kaplanacak. Kaç kare gerekir?', w * h,
      `Her sırada ${w} kare ve ${h} sıra vardır. ${w} × ${h} = ${w * h}.`, { kind: 'rectangle', width: w, height: h });
  }},
  { grade: 6, code: 'MAT.6.1.4', name: 'Ortak katları ve ortak bölenleri yorumlama', make: n => {
    const x = 3 + n;
    return numeric(`İki servis aynı anda hareket ediyor. Birincisi her ${2 * x}, ikincisi her ${3 * x} dakikada bir kalkıyor. Kaç dakika sonra tekrar birlikte kalkarlar?`, 6 * x,
      `İki sürenin sıfırdan büyük en küçük ortak katı ${6 * x} dakikadır.`);
  }},
  { grade: 6, code: 'MAT.6.1.7', name: 'Kesir, ondalık gösterim ve yüzdeyle problem çözme', make: n => {
    const total = 20 * (4 + n);
    return numeric(`Okul maçında ${total} bilet var. Önce tüm biletlerin %25’i, sonra kalanların 1/5’i satılıyor. Kaç bilet kalır?`, total * 0.6,
      `İlk satıştan sonra ${total * 0.75} bilet kalır. Bunun 4/5’i ${total * 0.6} eder.`);
  }},
  { grade: 6, code: 'MAT.6.4.2', name: 'Dikdörtgenden üçgenin alan bağıntısına ulaşma', make: n => {
    const w = 12 + 2 * n, h = 5 + n % 4;
    return numeric('Şekildeki karton, köşegen boyunca kesiliyor. Oluşan üçgenlerden birinin alanı kaç santimetrekaredir?', w * h / 2,
      `Köşegen dikdörtgeni eş alanlı iki üçgene ayırır. ${w} × ${h} ÷ 2 = ${w * h / 2}.`, { kind: 'rectangle', width: w, height: h, diagonal: true });
  }},
  { grade: 7, code: 'MAT.7.1.4', name: 'Rasyonel sayılarla gerçek yaşam problemleri', make: n => {
    const start = 4 + n;
    return numeric(`Depoda sıcaklık −${start} °C. Her yarım saatte 1,5 °C artıyor. İki saat sonra sıcaklık kaç °C olur?`, 6 - start,
      `İki saatte dört yarım saat vardır. −${start} + 4 × 1,5 = ${6 - start}.`);
  }},
  { grade: 7, code: 'MAT.7.1.7', name: 'Doğru orantıyla problem çözme', make: n => {
    const count = 9 + n;
    return numeric(`4 özdeş boya kutusu 18 m² alanı kaplıyor. Aynı şartlarda ${count} kutu kaç metrekare alanı kaplar?`, 4.5 * count,
      `Bir kutu 18 ÷ 4 = 4,5 m² kaplar. 4,5 × ${count} işlemi yapılır.`);
  }},
  { grade: 7, code: 'MAT.7.4.6', name: 'Prizma hacmiyle ilgili günlük hayat problemleri', make: n => {
    const w = 12 + n, h = 5 + n % 3;
    return numeric('Şekilde bir kutunun dikdörtgen biçimindeki tabanı görülüyor. Kutunun yüksekliği 8 cm olduğuna göre hacmi kaç santimetreküptür?', w * h * 8,
      `Taban alanı ${w} × ${h} cm². Hacim taban alanının 8 ile çarpımıdır.`, { kind: 'rectangle', width: w, height: h });
  }},
  { grade: 8, code: 'M.8.3.1.5', name: 'Pisagor bağıntısıyla problem çözme', make: n => {
    const k = n + 1;
    return numeric('Şekildeki dik üçgen biçimli desteğin ? ile işaretli uzunluğu kaç santimetredir?', 5 * k,
      `Hipotenüs √(${4 * k}² + ${3 * k}²) = ${5 * k} cm.`, { kind: 'triangle', width: 4 * k, height: 3 * k });
  }},
  { grade: 8, code: 'M.8.1.2.2', name: 'Üslü ifadelerde eşdeğer gösterimler', make: n => {
    const x = n % 4 + 2, y = 3 + n;
    return numeric(`Bir cihazda 2^${x} klasörün her birinde 2^${y} dosya var. Toplam dosya sayısı 2^k olarak yazılırsa k kaçtır?`, x + y,
      `Tabanlar aynı olduğundan üsler toplanır: ${x} + ${y} = ${x + y}.`);
  }},
];
export const mathOutcomeQuestions: Question[] = families.flatMap(({ grade, code, name, make }) =>
  Array.from({ length: 12 }, (_, n) => ({
    ...make(n), grade, course: 'mathematics', outcome: name, outcomeCode: code, subject: name,
    difficulty: n % 3 === 0 ? 'kolay' : n % 3 === 1 ? 'orta' : 'zor',
    category: 'context', family: code,
  })));
