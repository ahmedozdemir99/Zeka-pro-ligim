import { Question } from '../types';

export const initialMatchQuestions: Question[] = [
  // 5. SINIF
  { grade: 5, difficulty: 'kolay', subject: 'Ondalık Gösterim • Günlük yaşam', q: 'Okul kantininde bir tost 24,50 TL, ayran 8,50 TL. İkisini alan öğrenci kaç TL öder?', a: '33', explanation: '24,50 + 8,50 = 33,00 TL.' },
  { grade: 5, difficulty: 'kolay', subject: 'Doğal Sayılar • Zaman', q: 'Bir okul gezisi için 6 otobüsün her birine 38 öğrenci biniyor. Toplam kaç öğrenci taşınır?', a: '228', explanation: '6 × 38 = 228 öğrenci.' },
  { grade: 5, difficulty: 'kolay', subject: 'Geometri • Çevre', q: 'Kare biçimindeki bir bahçenin bir kenarı 9 metredir. Bahçenin çevresine bir tur tel çekmek için kaç metre tel gerekir?', a: '36', explanation: 'Kare çevre = 4 × 9 = 36 m.' },
  { grade: 5, difficulty: 'orta', subject: 'Kesirler • Tarif', q: 'Bir tarifte 3 kişiye 3/4 litre süt kullanılıyor. Aynı tarif 6 kişi için hazırlanırsa kaç litre süt gerekir?', a: '1,5', explanation: 'Kişi sayısı 2 katına çıktığından süt 3/4 × 2 = 6/4 = 1,5 litre olur.' },
  { grade: 5, difficulty: 'orta', subject: 'Veri yorumlama • Alışveriş', q: 'Bir kırtasiyede defter 18 TL, kalem 7 TL\'dir. 2 defter ve 3 kalem alan biri 100 TL verirse kaç TL para üstü alır?', a: '43', explanation: 'Toplam Harcama = (2 × 18) + (3 × 7) = 36 + 21 = 57 TL. Para Üstü = 100 - 57 = 43 TL.' },
  { grade: 5, difficulty: 'orta', subject: 'Alan • Planlama', q: 'Dikdörtgen bir oyun alanı 12 m uzunluğunda, 7 m genişliğindedir. Alanın 20 m²\'sine kauçuk döşenirse açıkta kaç m² kalır?', a: '64', explanation: 'Toplam Alan = 12 × 7 = 84 m². Kalan = 84 - 20 = 64 m².' },
  { grade: 5, difficulty: 'zor', subject: 'Çok adımlı problem • Ulaşım', q: 'Bir gezi otobüsü 240 km yolun önce 3/8\'ini, sonra 60 km\'sini gidiyor. Gidilecek kaç kilometre kalır?', a: '90', explanation: '240 × 3/8 = 90 km. Toplam gidilen = 90 + 60 = 150 km. Kalan = 240 - 150 = 90 km.' },
  { grade: 5, difficulty: 'zor', subject: 'Örüntü • Tasarım', q: 'Bir duvar süslemesinde 1. sıraya 4, 2. sıraya 7, 3. sıraya 10 üçgen konuyor. Kural aynıysa 8. sırada kaç üçgen olur?', a: '25', explanation: 'Artış miktarı 3\'tür. n. terim = 3n + 1. 8. terim = 3(8) + 1 = 25.' },
  { grade: 5, difficulty: 'zor', subject: 'Kesir ve karşılaştırma • Gıda israfı', q: 'Bir pastanın sabah 2/5\'i, öğleden sonra kalanının 1/3\'ü yeniyor. Pastanın tamamının hangi kesri kalır? Cevabı sade kesir olarak yaz.', a: '2/5', explanation: 'Kalan = 1 - 2/5 = 3/5. Öğleden sonra yenilen = 3/5 × 1/3 = 1/5. Son Kalan = 3/5 - 1/5 = 2/5.' },
  { grade: 5, difficulty: 'zor', subject: 'Geometri • Görsel model', q: 'Çevresi 40 metre olan bir dikdörtgen bahçenin uzun kenarı 14 metredir. Kısa kenarı kaç metredir?', a: '6', explanation: 'Çevre = 2 × (Uzun + Kısa) => 40 = 2 × (14 + Kısa) => 20 = 14 + Kısa => Kısa = 6 m.' },

  // 6. SINIF
  { grade: 6, difficulty: 'kolay', subject: 'Oran • Tarif', q: 'Bir içecek için 2 ölçü şuruba 5 ölçü su ekleniyor. 10 ölçü su kullanılırsa kaç ölçü şurup gerekir?', a: '4', explanation: 'Oran 2/5\'tir. 10 su 5×2 olduğundan şurup da 2×2 = 4 olur.' },
  { grade: 6, difficulty: 'kolay', subject: 'Tam sayılar • Sıcaklık', q: 'Sabah hava −3 °C, öğlen 8 °C ölçülüyor. Sıcaklık kaç derece artmıştır?', a: '11', explanation: 'Fark = 8 - (-3) = 11 °C.' },
  { grade: 6, difficulty: 'kolay', subject: 'Alan • Ev yaşamı', q: '4 m uzunluğunda ve 3 m genişliğindeki bir odanın taban alanı kaç metrekaredir?', a: '12', explanation: 'Alan = 4 × 3 = 12 m².' },
  { grade: 6, difficulty: 'orta', subject: 'Ondalık gösterim • Yakıt', q: 'Bir araç 100 km\'de 6,4 litre yakıt tüketiyor. 250 km\'lik yolda aynı tüketimle kaç litre yakıt harcar?', a: '16', explanation: '2.5 × 6,4 = 16 litre.' },
  { grade: 6, difficulty: 'orta', subject: 'Veri yorumlama • Okuma', q: 'Dört öğrencinin bir haftada okuduğu sayfa sayıları 24, 31, 29 ve 36\'dır. Bu öğrencilerin okuduğu ortalama sayfa sayısı kaçtır?', a: '30', explanation: 'Toplam = 24 + 31 + 29 + 36 = 120. Ortalama = 120 / 4 = 30.' },
  { grade: 6, difficulty: 'orta', subject: 'Cebir • Bütçe', q: 'Bir müze giriş bileti yetişkinler için 45 TL, öğrenciler için 25 TL. 2 yetişkin ve 4 öğrenci toplam kaç TL öder?', a: '190', explanation: '(2 × 45) + (4 × 25) = 90 + 100 = 190 TL.' },
  { grade: 6, difficulty: 'zor', subject: 'Oran ve çok adımlı problem', q: 'Bir okulda kız öğrencilerin erkek öğrencilere oranı 4:5, toplam öğrenci sayısı 270\'tir. Erkek öğrenci sayısı kaçtır?', a: '150', explanation: 'Toplam kat = 4 + 5 = 9 kat. 1 kat = 270 / 9 = 30. Erkekler = 5 × 30 = 150.' },
  { grade: 6, difficulty: 'zor', subject: 'Kesirler • Su tasarrufu', q: 'Bir depo doluyken suyun önce 1/4\'ü, sonra kalan suyun 1/3\'ü kullanılıyor. Depoda başlangıçtaki suyun hangi kesri kalır? Sade kesir yaz.', a: '1/2', explanation: 'Kalan = 3/4. 3/4 × (1 - 1/3) = 3/4 × 2/3 = 2/4 = 1/2.' },
  { grade: 6, difficulty: 'zor', subject: 'Geometri • Ölçekli plan', q: 'Bir parkın planda 8 cm görünen yolu gerçekte 200 m\'dir. Aynı ölçekte 5,5 cm görünen başka bir yol gerçekte kaç metredir?', a: '137,5', explanation: '1 cm = 200 / 8 = 25 m. 5,5 cm = 5,5 × 25 = 137,5 m.' },
  { grade: 6, difficulty: 'zor', subject: 'Veri ve çıkarım • Grafikler', q: 'Üç günde sırasıyla 15, 20 ve 10 sayfa okuyan öğrenci, 4. gün ilk 3 günün ortalaması kadar okursa 4 günde toplam kaç sayfa okur?', a: '60', explanation: '3 günün toplamı = 45. Ortalama = 15. 4 günde toplam = 45 + 15 = 60 sayfa.' },

  // 7. SINIF
  { grade: 7, difficulty: 'kolay', subject: 'Yüzdeler • İndirim', q: 'Etiketi 400 TL olan bir çantaya %15 indirim uygulanıyor. İndirimli fiyat kaç TL\'dir?', a: '340', explanation: 'İndirim = 400 × 0,15 = 60 TL. Satış fiyatı = 400 - 60 = 340 TL.' },
  { grade: 7, difficulty: 'kolay', subject: 'Rasyonel sayılar • Günlük yaşam', q: 'Bir yürüyüşçü sabah 1,2 km, akşam 0,85 km yürüyor. Toplam kaç kilometre yürür?', a: '2,05', explanation: '1,20 + 0,85 = 2,05 km.' },
  { grade: 7, difficulty: 'kolay', subject: 'Doğrular ve açılar', q: 'Bir kavşakta komşu bütünler açılardan biri 68° ise diğeri kaç derecedir?', a: '112', explanation: 'Bütünler açılar toplamı 180°dir. 180 - 68 = 112°.' },
  { grade: 7, difficulty: 'orta', subject: 'Orantı • Üretim', q: '4 makine 3 saatte 240 parça üretiyor. Aynı hızla çalışan 6 makine 3 saatte kaç parça üretir?', a: '360', explanation: '1 makine 3 saatte = 240 / 4 = 60 parça. 6 makine = 6 × 60 = 360 parça.' },
  { grade: 7, difficulty: 'orta', subject: 'Cebir • Telefon paketi', q: 'Bir telefon paketinde 80 TL sabit ücret ve kullanılan her GB için 12 TL ücret var. Fatura 164 TL ise kaç GB kullanılmıştır?', a: '7', explanation: '80 + 12x = 164 => 12x = 84 => x = 7 GB.' },
  { grade: 7, difficulty: 'orta', subject: 'Çember • Tasarım', q: 'Yarıçapı 7 cm olan bir çemberin çevresini π=22/7 alarak hesaplayınız. Sonuç kaç cm\'dir?', a: '44', explanation: 'Çevre = 2 × π × r = 2 × (22/7) × 7 = 44 cm.' },
  { grade: 7, difficulty: 'zor', subject: 'Yüzde değişimi • Alışveriş', q: 'Bir ürünün fiyatı önce %20 artırılıp sonra yeni fiyat üzerinden %20 indirilirse başlangıç fiyatı 500 TL olan ürün kaç TL olur?', a: '480', explanation: '500 × 1,20 = 600 TL. 600 × 0,80 = 480 TL.' },
  { grade: 7, difficulty: 'zor', subject: 'Cebirsel düşünme • Taksi', q: 'Bir taksi açılışta 25 TL, her kilometre için 14 TL alıyor. 165 TL ödeyen yolcu kaç kilometre gitmiştir?', a: '10', explanation: '25 + 14x = 165 => 14x = 140 => x = 10 km.' },
  { grade: 7, difficulty: 'zor', subject: 'Alan • Planlama', q: 'Dikdörtgen bir arsanın uzun kenarı kısa kenarının 2 katından 3 m fazladır. Kısa kenar 9 m ise arsanın alanı kaç m²\'dir?', a: '189', explanation: 'Kısa = 9. Uzun = 2(9) + 3 = 21 m. Alan = 9 × 21 = 189 m².' },
  { grade: 7, difficulty: 'zor', subject: 'Olasılık • Oyun', q: 'Bir kutuda 4 kırmızı, 3 mavi ve 5 sarı kart vardır. Rastgele seçilen kartın sarı olmama olasılığı nedir? Sade kesir yaz.', a: '7/12', explanation: 'Sarı olmayan kart sayısı = 4 + 3 = 7. Toplam kart = 12. Olasılık = 7/12.' },

  // 8. SINIF
  { grade: 8, difficulty: 'kolay', subject: 'Üslü ifadeler • Dijital veri', q: 'Bir dosya 2⁵ MB büyüklüğündedir. Bu dosya kaç MB\'tır?', a: '32', explanation: '2⁵ = 32 MB.' },
  { grade: 8, difficulty: 'kolay', subject: 'Kareköklü ifadeler • Alan', q: 'Alanı 196 m² olan kare biçimindeki bir meydanın bir kenarı kaç metredir?', a: '14', explanation: '√196 = 14 m.' },
  { grade: 8, difficulty: 'kolay', subject: 'Doğrusal denklem • Bütçe', q: 'Aynı fiyatlı 3 bilet ve 20 TL hizmet bedeli toplam 170 TL tutuyor. Bir bilet kaç TL\'dir?', a: '50', explanation: '3x + 20 = 170 => 3x = 150 => x = 50 TL.' },
  { grade: 8, difficulty: 'orta', subject: 'Eğim • Rampa', q: 'Bir rampada yatay ilerleme 12 m, yükseklik artışı 3 m\'dir. Eğim (yükseklik/yatay) kaçtır? Sade kesir yaz.', a: '1/4', explanation: 'Eğim = 3 / 12 = 1/4.' },
  { grade: 8, difficulty: 'orta', subject: 'Olasılık • Üretim', q: 'Bir fabrikadaki ürünlerin %4\'ü kusurludur. Rastgele seçilen 250 üründe beklenen kusurlu ürün sayısı kaçtır?', a: '10', explanation: '250 × 0,04 = 10 kusurlu ürün.' },
  { grade: 8, difficulty: 'orta', subject: 'Eşitsizlik • Yaş sınırı', q: 'Bir etkinliğe katılmak için yaşın en az 12, 18\'den küçük olması gerekiyor. Kaç farklı tam sayı yaş uygundur?', a: '6', explanation: '12, 13, 14, 15, 16, 17 yaşları uygundur (6 farklı değer).' },
  { grade: 8, difficulty: 'zor', subject: 'Doğrusal ilişki • Su deposu', q: 'Bir depoda başlangıçta 180 litre su vardır. Her dakika sabit 6 litre su boşalıyor. Depoda 42 litre su kalması kaç dakika sürer?', a: '23', explanation: '180 - 6t = 42 => 6t = 138 => t = 23 dakika.' },
  { grade: 8, difficulty: 'zor', subject: 'Pisagor • Erişilebilirlik', q: 'Bir bina girişine yapılan rampanın yatay uzunluğu 15 m, yüksekliği 8 m\'dir. Rampanın eğimli uzunluğu kaç metredir?', a: '17', explanation: '8² + 15² = 64 + 225 = 289. √289 = 17 m (8-15-17 özel üçgeni).' },
  { grade: 8, difficulty: 'zor', subject: 'Çok adımlı yüzde problemi', q: 'Bir ürün %20 indirimle 720 TL\'ye satılıyor. İndirimden önceki etiket fiyatı kaç TL\'dir?', a: '900', explanation: '%80\'i 720 TL ise %100\'ü (720 / 0.80) = 900 TL.' },
  { grade: 8, difficulty: 'zor', subject: 'Veri yorumlama • Satış grafiği', q: '1. mağaza 2 haftada sırasıyla 30 ve 35 satış yapıyor. 2. mağaza ise 40 ve 45 satış yapıyor. 2. mağaza toplam kaç adet fazla satış yapmıştır?', a: '20', explanation: '1. Mağaza Toplam = 65. 2. Mağaza Toplam = 85. Fark = 85 - 65 = 20.' },
];

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : Math.abs(a);
}

function simpleFraction(num: number, den: number): string {
  const g = gcd(Math.round(num), Math.round(den)) || 1;
  return `${Math.round(num / g)}/${Math.round(den / g)}`;
}

export function buildSupplementaryQuestions(): Question[] {
  const out: Question[] = [];
  const patterns: Record<number, Array<(n: number) => [string, string, 'kolay' | 'orta' | 'zor', string]>> = {
    5: [
      (n) => { let a = 12 + n, b = 8 + (n % 6); return [`Okul kermesinde ${a} TL'lik sandviç ve ${b} TL'lik içecek alan öğrenci toplam kaç TL öder?`, String(a + b), 'kolay', 'Ondalık ve doğal sayılar • Alışveriş']; },
      (n) => { let a = 24 + n, b = 3 + (n % 5); return [`Bir geziye ${a} öğrenci katılıyor. Her minibüs ${b} öğrenci alırsa en az kaç minibüs gerekir?`, String(Math.ceil(a / b)), 'kolay', 'Doğal sayılar • Ulaşım planı']; },
      (n) => { let a = 5 + (n % 8); return [`Kare biçimindeki oyun alanının bir kenarı ${a} metredir. Çevresi kaç metredir?`, String(4 * a), 'kolay', 'Geometri • Çevre']; },
      (n) => { let a = 2 + (n % 5), b = 3 + (n % 4); return [`Bir tarifte ${a} kişiye ${b} bardak un kullanılıyor. Aynı ölçüyle ${a * 2} kişilik tarif için kaç bardak un gerekir?`, String(b * 2), 'orta', 'Kesir ve oran • Tarif']; },
      (n) => { let a = 15 + n, b = 6 + (n % 5), c = 2 + (n % 4); return [`Bir öğrenci ${a} TL'lik defterden 2 tane ve tanesi ${b} TL olan kalemlerden ${c} tane alıyor. 100 TL verirse kaç TL para üstü alır?`, String(100 - (2 * a + c * b)), 'orta', 'Çok adımlı işlem • Bütçe']; },
      (n) => { let a = 8 + (n % 9), b = 4 + (n % 6), c = 10 + (n % 12); return [`Dikdörtgen bir bahçenin kenarları ${a} m ve ${b} m'dir. Bahçenin ${c} m²'si çiçeklendirilirse çim için kaç m² kalır?`, String(a * b - c), 'orta', 'Alan • Planlama']; },
      (n) => { let a = 120 + 10 * n, b = 1 + (n % 4); return [`Bir yürüyüş rotasının ${a} metresinin önce 1/${b + 1}'i tamamlanıyor. Kaç metre yol kalır?`, String(a - a / (b + 1)), 'zor', 'Kesir • Rota planlama']; },
      (n) => { let a = 2 + n % 5, b = 3 + n % 4, k = 5 + n % 6; return [`Bir sayı örüntüsü ${a}, ${a + b}, ${a + 2 * b}, ... biçiminde ilerliyor. Aynı kurala göre ${k}. terim kaçtır?`, String(a + (k - 1) * b), 'zor', 'Örüntü • Kural bulma']; },
      (n) => { let a = 2 + (n % 3), b = 5 + (n % 4); return [`Bir su şişesinin önce ${a}/${b + 2}'si, sonra kalanının yarısı içiliyor. Başlangıçtaki suyun ne kadarı kalır? Sade kesir yaz.`, simpleFraction(b + 2 - a, 2 * (b + 2)), 'zor', 'Kesirler • Su tasarrufu']; },
      (n) => { let a = 6 + n % 7, b = 3 + n % 5; return [`Bir dikdörtgenin uzunluğu ${a} m, genişliği ${b} m'dir. Çevresi boyunca her 1 metrede bir işaret konursa kaç işaret gerekir?`, String(2 * (a + b)), 'zor', 'Geometri • Modelleme']; }
    ],
    6: [
      (n) => { let a = 2 + n % 5; return [`Bir içecek için 3 ölçü meyve özüne ${a} ölçü su ekleniyor. 12 ölçü meyve özü kullanılırsa kaç ölçü su gerekir?`, String(4 * a), 'kolay', 'Oran • Tarif']; },
      (n) => { let a = -8 + n % 5, b = 7 + n % 6; return [`Sabah sıcaklık ${a} °C, öğlen ${b} °C ölçülüyor. Sıcaklık kaç derece artmıştır?`, String(b - a), 'kolay', 'Tam sayılar • Hava durumu']; },
      (n) => { let a = 3 + n % 6, b = 2 + n % 5; return [`Uzunluğu ${a} m, genişliği ${b} m olan dikdörtgen odanın alanı kaç m²'dir?`, String(a * b), 'kolay', 'Alan • Ev yaşamı']; },
      (n) => { let a = 4 + n % 5, d = 2 + n % 4; return [`Bir araç 100 km'de ${a} litre yakıt tüketiyor. ${100 + d * 50} km'de aynı tüketimle kaç litre yakıt harcar?`, String(a * (100 + d * 50) / 100), 'orta', 'Oran • Yakıt tüketimi']; },
      (n) => { let a = 18 + n, b = 24 + n % 7, c = 30 + n % 9; return [`Üç öğrencinin haftalık okuduğu sayfa sayıları ${a}, ${b} ve ${c}'dir. Üç öğrencinin ortalaması kaç sayfadır?`, String((a + b + c) / 3), 'orta', 'Veri analizi • Okuma']; },
      (n) => { let a = 30 + n % 20, b = 15 + n % 10; return [`Bir etkinliğin biletleri yetişkinler için ${a} TL, öğrenciler için ${b} TL'dir. 3 yetişkin ve 4 öğrenci toplam kaç TL öder?`, String(3 * a + 4 * b), 'orta', 'Cebirsel düşünme • Bütçe']; },
      (n) => { let parts = 4 + n % 5, total = (parts + 5) * (30 + n % 10); return [`Bir sınıfta kızların erkeklere oranı ${parts}:5 ve toplam öğrenci sayısı ${total} ise erkek öğrenci sayısı kaçtır?`, String(total * 5 / (parts + 5)), 'zor', 'Oran • Sınıf verileri']; },
      (n) => { let a = 2 + n % 4, b = 4 + n % 5; return [`Bir depodaki suyun önce 1/${a + 2}'si, sonra kalan suyun 1/${b}'i kullanılıyor. Başlangıçtaki suyun hangi kesri kalır? Sade kesir yaz.`, simpleFraction((a + 1) * (b - 1), (a + 2) * b), 'zor', 'Kesirler • Kaynak yönetimi']; },
      (n) => { let a = 4 + n % 6; return [`Bir haritada ${a} cm uzunluğundaki yol gerçekte ${a * 25} m'dir. Aynı ölçekte 7,2 cm'lik yol gerçekte kaç metredir?`, '180', 'zor', 'Ölçek • Harita okuryazarlığı']; },
      (n) => { let a = 10 + n % 8, b = 14 + n % 9, c = 8 + n % 7; return [`Üç günde sırasıyla ${a}, ${b} ve ${c} sayfa okuyan öğrenci, dördüncü gün ilk üç günün ortalaması kadar okuyor. Dört günde toplam kaç sayfa okur?`, String(a + b + c + (a + b + c) / 3), 'zor', 'Veri yorumlama • Okuma']; }
    ],
    7: [
      (n) => { let a = 200 + 20 * n, p = 10 + 5 * (n % 4); return [`Etiketi ${a} TL olan bir ürüne %${p} indirim uygulanıyor. İndirimli fiyat kaç TL'dir?`, String(a * (100 - p) / 100), 'kolay', 'Yüzdeler • Alışveriş']; },
      (n) => { let a = 0.4 + n / 10, b = 0.25 + (n % 5) / 100; return [`Bir öğrenci sabah ${a.toFixed(2)} km, akşam ${b.toFixed(2)} km yürüyor. Toplam kaç km yürümüştür?`, (a + b).toFixed(2).replace('.', ','), 'kolay', 'Rasyonel sayılar • Sağlık']; },
      (n) => { let a = 45 + n % 40; return [`Bir kavşakta komşu bütünler açılardan biri ${a}° ise diğer açı kaç derecedir?`, String(180 - a), 'kolay', 'Açılar • Trafik güvenliği']; },
      (n) => { let a = 3 + n % 5, b = 2 + n % 4, c = 120 + n * 10; return [`${a} makine ${b} saatte ${c} parça üretiyor. Aynı hızla ${a * 2} makine aynı sürede kaç parça üretir?`, String(c * 2), 'orta', 'Orantı • Üretim']; },
      (n) => { let a = 50 + n * 2, b = 8 + n % 7, c = 130 + n * 3; return [`Bir telefon paketinde ${a} TL sabit ücret ve GB başına ${b} TL ücret var. Fatura ${c} TL ise kaç GB kullanılmıştır?`, String((c - a) / b), 'orta', 'Cebir • Dijital yaşam']; },
      (n) => { let r = 3 + n % 9; return [`Yarıçapı ${r} cm olan çemberin çevresini π=3 alarak yaklaşık hesaplayınız. Çevre kaç cm olur?`, String(6 * r), 'orta', 'Çember • Tasarım']; },
      (n) => { let a = 300 + 50 * n; return [`Bir ürünün fiyatı önce %10 artırılıyor, sonra yeni fiyat üzerinden %10 azaltılıyor. Başlangıç fiyatı ${a} TL ise son fiyat kaç TL olur?`, String(a * 1.1 * 0.9), 'zor', 'Yüzde değişimi • Finansal okuryazarlık']; },
      (n) => { let a = 15 + n % 20, b = 8 + n % 9, total = a + b * 10; return [`Bir taksi ${a} TL açılış ücreti ve kilometre başına ${b} TL alıyor. Yolculuk ${total} TL tuttuğuna göre kaç km gidilmiştir?`, String((total - a) / b), 'zor', 'Denklem • Ulaşım']; },
      (n) => { let x = 5 + n % 8; return [`Dikdörtgen arsanın uzun kenarı kısa kenarının 2 katından 1 m fazladır. Kısa kenar ${x} m ise alan kaç m²'dir?`, String(x * (2 * x + 1)), 'zor', 'Cebir ve alan • Arazi planı']; },
      (n) => { let a = 3 + n % 5, b = 4 + n % 6, c = 5 + n % 4; return [`Bir torbada ${a} kırmızı, ${b} mavi ve ${c} sarı kart var. Rastgele seçilen kartın sarı olmama olasılığı nedir? Sade kesir yaz.`, simpleFraction(a + b, a + b + c), 'zor', 'Olasılık • Oyun tasarımı']; }
    ],
    8: [
      (n) => { let a = 3 + n % 5; return [`Bir dosyanın boyutu 2 üzeri ${a} MB'tır. Dosyanın boyutu kaç MB'tır?`, String(2 ** a), 'kolay', 'Üslü ifadeler • Dijital veri']; },
      (n) => { let a = 81 + 9 * (n % 8); return [`Alanı ${a * a} m² olan kare meydanın bir kenarı kaç metredir?`, String(a), 'kolay', 'Kareköklü ifadeler • Alan']; },
      (n) => { let a = 25 + n * 3; return [`Aynı fiyatlı 4 bilet ve 20 TL hizmet bedeli toplam ${4 * a + 20} TL tutuyor. Bir bilet kaç TL'dir?`, String(a), 'kolay', 'Denklem • Bütçe']; },
      (n) => { let a = 6 + n % 10, b = 2 + n % 5; return [`Bir rampada yatay ilerleme ${a * 2} m, yükseklik artışı ${b} m'dir. Eğim (yükseklik/yatay) kaçtır? Sade kesir yaz.`, simpleFraction(b, a * 2), 'orta', 'Eğim • Erişilebilir tasarım']; },
      (n) => { let p = 2 + (n % 7); return [`Bir üretim bandındaki ürünlerin %${p}’si kusurludur. Rastgele seçilen ${100 * (n % 3 + 2)} üründe beklenen kusurlu ürün sayısı kaçtır?`, String(p * (100 * (n % 3 + 2)) / 100), 'orta', 'Yüzde • Kalite kontrol']; },
      (n) => { let a = 11 + n % 5, b = 18 + n % 5; return [`Bir etkinlik için yaş en az ${a}, ${b}'den küçük olmalıdır. Tam sayı yaşları dikkate alındığında kaç farklı yaş uygundur?`, String(b - a), 'orta', 'Eşitsizlik • Etkinlik kuralları']; },
      (n) => { let a = 150 + n * 5, b = 5 + n % 7, c = 30 + n % 20; return [`Bir depoda başlangıçta ${a} litre su vardır. Her dakika ${b} litre su boşalıyor. Depoda ${c} litre kalması kaç dakika sürer?`, String((a - c) / b), 'zor', 'Doğrusal ilişki • Su yönetimi']; },
      (n) => { let a = 6 + n % 10, b = 8 + n % 9; return [`Bir dik üçgende dik kenarlar ${a} m ve ${b} m'dir. Hipotenüs uzunluğu kaç metredir?`, String(Math.sqrt(a * a + b * b)), 'zor', 'Pisagor • İnşaat']; },
      (n) => { let price = 600 + 20 * n; return [`Bir ürün %20 indirimle ${price * 0.8} TL'ye satılıyor. İndirimden önceki fiyatı kaç TL'dir?`, String(price), 'zor', 'Yüzde • Tüketici matematiği']; },
      (n) => { let a = 20 + n % 20, b = 30 + n % 15, c = 25 + n % 18, d = 35 + n % 20; return [`İki mağazanın iki haftalık satışları sırasıyla A: ${a} ve ${b}, B: ${c} ve ${d} adettir. İki haftada hangi mağaza kaç adet fazla satış yapmıştır?`, String(Math.abs((c + d) - (a + b))), 'zor', 'Veri yorumlama • Karşılaştırma']; }
    ]
  };

  for (const grade of [5, 6, 7, 8]) {
    const templates = patterns[grade];
    for (let i = 0; i < 140; i++) {
      const t = Math.floor(i / 14);
      const n = (i % 14) + 1;
      const result = templates[t](n);
      out.push({
        grade,
        difficulty: result[2],
        subject: result[3],
        q: result[0],
        a: String(result[1]),
        source: 'Özgün Soru • MEB/LGS beceri yaklaşımı'
      });
    }
  }

  return out;
}

export const allQuestions: Question[] = [
  ...initialMatchQuestions,
  ...buildSupplementaryQuestions()
];
