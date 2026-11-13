import type { Question } from '../types';

type Scenario = (n: number) => { q: string; a: number; explanation: string };
type Template = [Question['difficulty'], string, Scenario];

const templates: Record<number, Template[]> = {
  5: [
    ['kolay', 'Doğal sayılar • Okul gezisi', n => {
      const students = 36 + 3 * n, seats = 15 + n % 3;
      const buses = Math.ceil(students / seats);
      return { q: `Müze gezisine ${students} öğrenci katılıyor. Her araç ${seats} öğrenci alabiliyor. Herkesin gidebilmesi için en az kaç araç gerekir?`, a: buses, explanation: `${students} sayısını ${seats}’e böl. Kalan varsa bir araç daha gerekir. En az ${buses} araç gerekir.` };
    }],
    ['kolay', 'Zaman • Okul servisi', n => {
      const ride = 20 + n, walk = 5 + n % 4;
      return { q: `Okula giriş saatine 45 dakika var. Serviste yol ${ride} dakika, servisten okul kapısına yürüyüş ${walk} dakika sürüyor. Hemen yola çıkarsan okul kapısına vardığında girişe kaç dakika kalır?`, a: 45 - ride - walk, explanation: `Yolun tamamı ${ride} + ${walk} dakika. Bu süreyi 45 dakikadan çıkar.` };
    }],
    ['orta', 'Kesirler • Su tasarrufu', n => {
      const total = 6 * (15 + n);
      return { q: `Okul bahçesindeki depoda ${total} L su var. Sabah suyun 1/3’ü, öğlen başlangıçtaki suyun 1/6’sı kullanılıyor. Depoda kaç litre kalır?`, a: total / 2, explanation: `Kullanılan kısım 1/3 + 1/6 = 1/2. Kalan su ${total} ÷ 2 = ${total / 2} L.` };
    }],
    ['orta', 'Veri yorumlama • Geri dönüşüm', n => {
      const a = 22 + n, b = 15 + n, c = 8 + n, goal = 60 + 4 * n;
      return { q: `Sınıf üç günde sırasıyla ${a}, ${b} ve ${c} pil topladı. Haftalık hedef ${goal} pil. Hedefe ulaşmak için en az kaç pil daha gerekir?`, a: goal - a - b - c, explanation: `İlk üç gün ${a + b + c} pil toplanmış. Kalan hedef ${goal} − ${a + b + c}.` };
    }],
    ['zor', 'Alan • Bahçe tasarımı', n => {
      const length = 12 + n, width = 8 + n % 4;
      return { q: `Okul bahçesinde ${length} m × ${width} m’lik bir alana çim ekilecek. Uzun kenara bitişik, bu kenar boyunca uzanan 2 m genişliğinde bir yürüyüş şeridi ayrılıyor. Çime kaç m² kalır?`, a: length * (width - 2), explanation: `Şerit, uzun kenar boyunca ${length} m uzanır ve genişliği 2 m’dir. Çim alanı ${length} × (${width} − 2).` };
    }],
    ['zor', 'İşlem stratejisi • Kermes', n => {
      const count = 31 + n, box = 5 + n % 4, pack = box * 9 - 7;
      return { q: `Kermeste en az ${count} bardak gerekiyor. Bir bardak 9 TL, ${box} bardaklık paket ${pack} TL. Tam dolu paketleri ve gereken tekli bardakları alarak tam ${count} bardak satın alınırsa en az kaç TL ödenir?`, a: Math.floor(count / box) * pack + (count % box) * 9, explanation: `Her paket, aynı sayıda tekli bardağa göre 7 TL daha ucuz. ${Math.floor(count / box)} paket ve ${count % box} tekli bardak al.` };
    }],
  ],
  6: [
    ['kolay', 'Tam sayılar • Yayla sıcaklığı', n => {
      const morning = -2 - n % 7, noon = 5 + n;
      return { q: `Yaylada sabah ${morning} °C, öğle vakti ${noon} °C ölçüldü. Sıcaklık kaç derece arttı?`, a: noon - morning, explanation: `Değişim = son sıcaklık − ilk sıcaklık = ${noon} − (${morning}).` };
    }],
    ['kolay', 'Aritmetik ortalama • Bisiklet yolu', n => {
      const average = 8 + n;
      return { q: `Bir öğrenci üç gün boyunca sırasıyla ${average - 3}, ${average + 1} ve ${average + 2} km bisiklet sürdü. Günlük ortalama kaç kilometredir?`, a: average, explanation: `Toplam ${3 * average} km’yi üç güne böl.` };
    }],
    ['orta', 'Oran • Yemekhane planı', n => {
      const servings = 12 + n, factor = 2 + n % 5, total = factor * servings;
      return { q: `Yemekhane ${servings} kişilik çorba için 4 L su kullanıyor. Aynı tarifle ${total} kişilik çorba yapılırsa kaç litre su gerekir?`, a: 4 * factor, explanation: `Kişi sayısı ${total} ÷ ${servings} = ${factor} katına çıktı. Su da 4 × ${factor} litre olur.` };
    }],
    ['orta', 'Ondalık gösterim • Alışveriş', n => {
      const price = 14 + n + 0.5, discount = 3 + n % 5;
      return { q: `Bir dükkânda meyve suyu ${price.toLocaleString('tr-TR')} TL. Dört şişe alınırsa toplam tutardan ${discount} TL indirim yapılıyor. Ödenecek tutar kaç TL?`, a: 4 * price - discount, explanation: `Önce birim fiyatı 4 ile çarp. ${4 * price} TL’den ${discount} TL indirimi çıkar.` };
    }],
    ['zor', 'Kesirler • Etkinlik bütçesi', n => {
      const budget = 12 * (30 + n);
      return { q: `Bilim şenliğinin ${budget} TL bütçesinin 1/3’ü malzemelere ayrılıyor. Kalanın 1/4’ü ulaşıma ayrılıyor. Diğer giderler için kaç TL kalır?`, a: budget / 2, explanation: `İlk ayırmadan sonra bütçenin 2/3’ü kalır. İkinci ayırmadan sonra bunun 3/4’ü kalır. Çarpım 1/2’dir.` };
    }],
    ['zor', 'Ölçek • Mahalle rotası', n => {
      const scale = 20 + n, main = 3 + n % 4, detour = main + 4;
      return { q: `Bir planda 1 cm gerçekte ${scale} m’dir. Meydana giden doğrudan yol ${main} cm, güvenli yaya rotası ${detour} cm ölçülüyor. Güvenli rota kaç metre daha uzundur?`, a: (detour - main) * scale, explanation: `Plan üzerinde fark ${detour} − ${main} = ${detour - main} cm. Bu farkı metreye çevirmek için ${scale} ile çarp.` };
    }],
  ],
  7: [
    ['kolay', 'Yüzdeler • Bisiklet bakımı', n => {
      const price = 300 + 20 * n;
      return { q: `Bisiklet bakımının liste fiyatı ${price} TL. Öğrenci indirimi %15 ise indirimli ücret kaç TL?`, a: price * 85 / 100, explanation: `Fiyatın %85’i ödenir. ${price} × 85 ÷ 100.` };
    }],
    ['kolay', 'Rasyonel sayılar • Depolama', n => {
      const total = 12 + n, used = 2.75;
      return { q: `Bir tablette ${total} GB boş alan var. İki uygulama sırasıyla 2,75 GB ve 1,25 GB alan kaplıyor. Kurulumlardan sonra kaç GB boş alan kalır?`, a: total - used - 1.25, explanation: `İki uygulama toplam 4 GB yer kaplar. ${total} − 4 GB kalır.` };
    }],
    ['orta', 'Orantı • Su dolum noktası', n => {
      const rate = 3 + n % 6, time = 8 + n;
      return { q: `Bir okulun su dolum noktası 4 dakikada ${4 * rate} litre su veriyor. Aynı hızla ${time} dakikada kaç litre verir?`, a: rate * time, explanation: `Dakikada ${4 * rate} ÷ 4 = ${rate} L akar. Süre ile debiyi çarp.` };
    }],
    ['orta', 'Denklem • Atölye bileti', n => {
      const cost = 10 + n, fixed = 40 + n, sessions = 4 + n % 6, total = fixed + sessions * cost;
      return { q: `Bir atölye ${fixed} TL kayıt ücreti ve her oturum için ${cost} TL alıyor. Toplam ${total} TL ödeyen öğrenci kaç oturum satın almıştır?`, a: sessions, explanation: `Önce kayıt ücretini çıkar. Kalan ${total - fixed} TL’yi oturum başına ücrete böl.` };
    }],
    ['zor', 'Yüzde değişimi • Enerji tüketimi', n => {
      const usage = 100 * (2 + n);
      return { q: `Okulun aylık elektrik tüketimi ${usage} kWh iken önce %20 azalıyor. Sonraki ay azalan değer %25 artıyor. İkinci ayın sonunda tüketim kaç kWh olur?`, a: usage, explanation: `İlk çarpan 0,80, ikinci çarpan 1,25. 0,80 × 1,25 = 1 olduğundan başlangıç değerine dönülür.` };
    }],
    ['zor', 'Çember • Yürüyüş parkuru', n => {
      const r = 14 + 7 * n, straight = 22 + n;
      return { q: `Bir spor parkurunda yarıçapı ${r} m olan yarım çemberi, uzunluğu ${straight} m olan bir düz bölüm izliyor. π = 22/7 alınırsa bu iki bölümün toplam uzunluğu kaç metredir?`, a: r * 22 / 7 + straight, explanation: `Yarım çember yayı π × r = ${r * 22 / 7} m. Düz bölümün ${straight} metresini ekle.` };
    }],
  ],
  8: [
    ['kolay', 'Üslü ifadeler • Dijital arşiv', n => {
      const exp = 3 + n % 5, files = 3 + n;
      return { q: `Okul arşivine ${files} video eklenecek. Her biri 2 üzeri ${exp} MB. Toplam ne kadar MB alan gerekir?`, a: files * 2 ** exp, explanation: `Bir video ${2 ** exp} MB. Video sayısıyla çarp.` };
    }],
    ['kolay', 'Kareköklü ifadeler • Sınıf sergisi', n => {
      const side = 6 + n, area = side ** 2;
      return { q: `Kare bir sergi alanının yüzölçümü ${area} m². Çevresine şerit çekilecek. Kaç metre şerit gerekir?`, a: 4 * side, explanation: `Bir kenar √${area} = ${side} m. Dört kenarın toplamı 4 × ${side} m.` };
    }],
    ['orta', 'Doğrusal ilişki • Ulaşım tarifesi', n => {
      const fixed = 30 + 2 * n, rate = 4 + n % 5;
      return { q: `Bir ulaşım tarifesinde açılış ücreti ${fixed} TL, kilometre başına ücret ${rate} TL’dir. ${7 + n} km yolculuğun bedeli kaç TL?`, a: fixed + rate * (7 + n), explanation: `Toplam maliyet = sabit ücret + birim ücret × mesafe. ${fixed} + ${rate} × ${7 + n}.` };
    }],
    ['orta', 'Veri yorumlama • Kalite kontrolü', n => {
      const perBox = 15 + n, rejected = 2 + n % 4;
      return { q: `İki kutunun her birinde ${perBox} kalem var. Her kutuda ${rejected} kalem kusurlu. İki kutudaki kalemler birleştiriliyor. Kusurlu olmayan kaç kalem vardır?`, a: 2 * (perBox - rejected), explanation: `Her kutuda ${perBox} − ${rejected} sağlam kalem var. İki kutu için ikiyle çarp.` };
    }],
    ['zor', 'Pisagor • Park rotası', n => {
      const k = n + 2;
      return { q: `Dikdörtgen bir parkın kenarları ${3 * k} m ve ${4 * k} m. Bir köşeden karşı köşeye iki kenar boyunca gitmek yerine köşegen kullanılırsa kaç metre yol kısalır?`, a: 2 * k, explanation: `Kenar rotası ${7 * k} m. Pisagor bağıntısıyla köşegen ${5 * k} m. Aradaki farkı bul.` };
    }],
    ['zor', 'Eşitsizlik • Veri paketi', n => {
      const budget = 100 + 5 * n, base = 40 + n, perGB = 7 + n % 4;
      return { q: `Bir internet paketinde sabit ücret ${base} TL, her tam GB için ek ücret ${perGB} TL. Bütçen en çok ${budget} TL ise en fazla kaç tam GB satın alabilirsin?`, a: Math.floor((budget - base) / perGB), explanation: `${base} + ${perGB}x ≤ ${budget}. Sabit ücreti çıkar, ${perGB}’ye böl ve sonucu aşmayan en büyük tam sayıyı al.` };
    }],
  ],
};

export const contextQuestions: Question[] = [5, 6, 7, 8].flatMap(grade =>
  templates[grade].flatMap(([difficulty, subject, scenario], index) =>
    Array.from({ length: 15 }, (_, n) => {
      const { q, a, explanation } = scenario(n + 1);
      return { grade, difficulty, subject, q, a: String(a), explanation, category: 'context' as const, family: `context-${grade}-${index}` };
    })
  )
);
