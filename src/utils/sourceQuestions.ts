import type { Question } from '../types';

const pisa = 'https://www.oecd.org/content/dam/oecd/en/about/programmes/edu/pisa/pisa-test/CY8_TST_PISA2022_MS_Released_MAT_Items_FINAL_IH.pdf';
const lgs = 'https://cdn.eba.gov.tr/yardimcikaynaklar/2026/06/trlgs/a_2026_sayisal.pdf';
const sample = 'https://meb.ai/URbuoyJ';
const burs = (grade: number) => `https://cdn.eba.gov.tr/yardimcikaynaklar/2026/04/bursluluk/${grade}_sinifA_26.pdf`;

export const officialQuestionSources = [
  { label: 'MEB · Beceri temelli sorular', url: 'https://odsgm.meb.gov.tr/www/5-6-ve-7-sinif-duzeylerinde-beceri-temelli-sorular-yayimlanmistir/icerik/491' },
  { label: 'MEBİ · LGS örnek soruları', url: 'https://meb.gov.tr/lgsye-yonelik-birinci-ornek-soru-kitapciklari-mebide-yayimlandi/haber/39138/tr' },
  { label: 'PISA 2022 · OECD', url: pisa },
  { label: '2026 LGS · Sayısal A', url: lgs },
  { label: '2026 İOKBS · Bursluluk', url: 'https://odsgm.meb.gov.tr/www/ilkogretim-ve-ortaogretim-kurumlari-bursluluk-sinavi-iokbs-2026-soru-kitapciklari-ve-cevap-anahtarlari-yayimlandi/icerik/1615/' },
  { label: 'MEB · Kasım 2024 örnek soruları', url: sample },
];

const adaptations: Array<Omit<Question, 'category'>> = [
  { grade: 5, difficulty: 'kolay', subject: 'Çember • Pergel', source: '2026 İOKBS · 5. sınıf A · 1. soru', sourceUrl: burs(5),
    q: 'Pergelin iki ucu cetvelde 4 cm ve 9 cm çizgilerine denk geliyor. Pergel aynı açıklıkla döndürülürse çizilen çemberin yarıçapı kaç santimetre olur?', a: '5', explanation: 'Yarıçap pergelin açıklığıdır. Cetveldeki fark 9 − 4 = 5 cm.' },
  { grade: 5, difficulty: 'zor', subject: 'Basamak değeri • Nüfus verisi', source: '2026 İOKBS · 5. sınıf A · 7. soru', sourceUrl: burs(5),
    q: 'Bir öğrenci 85 824 854 sayısını defterine geçirirken milyonlar rakamını 3, yüzler rakamını 6 azaltıyor ve on binler rakamını 5 artırıyor. Defterdeki sayıyı yaz.', a: '82874254', explanation: 'Milyonlar 5 → 2, on binler 2 → 7, yüzler 8 → 2 olur. Sonuç 82 874 254.' },
  { grade: 5, difficulty: 'orta', subject: 'Örüntü • Renkli üçgenler', source: 'PISA 2022 · CMA150Q01', sourceUrl: pisa, family: 'pisa-triangles',
    q: 'Bir üçgen deseninin ilk dört sırasında sırasıyla 1, 3, 5 ve 7 parça vardır. Her sıra kırmızıyla başlar ve renkler kırmızı–mavi olarak sırayla gider. Dört sıradaki mavi parçaların sayısı kaçtır?', a: '6', explanation: 'Sıralardaki mavi parça sayıları 0, 1, 2 ve 3’tür. Toplam 6 olur.' },
  { grade: 6, difficulty: 'orta', subject: 'Veri analizi • Okçuluk', source: '2026 İOKBS · 6. sınıf A · 5. soru', sourceUrl: burs(6),
    q: 'Yedi okçunun puanları 11, 16, 18, 18, 18, 22 ve 34. Ortanca ile en sık görülen puanı topla, ardından puan aralığının açıklığını çıkar. Sonuç kaçtır?', a: '13', explanation: 'Ortanca 18, tepe değer 18 ve açıklık 34 − 11 = 23. 18 + 18 − 23 = 13.' },
  { grade: 6, difficulty: 'zor', subject: 'Ortak katlar • Voleybol', source: '2026 İOKBS · 6. sınıf A · 2. soru', sourceUrl: burs(6),
    q: 'Voleybol maçında dört setin her biri 20–30 dakika sürdü. Birinci sürenin 1 eksiği 4 ve 5’in, ikinci sürenin 2 fazlası 4 ve 6’nın ortak katı. Üçüncü süre asal ve 2 fazlası 5’in katı. Son süre 3 ve 10’un ortak katı. Dört set toplam kaç dakika sürdü?', a: '96', explanation: 'Uygun süreler sırasıyla 21, 22, 23 ve 30 dakikadır. Toplam 96 dakika.' },
  { grade: 6, difficulty: 'zor', subject: 'Ortak katlar • Ağaçlandırma', source: '2026 İOKBS · 6. sınıf A · 3. soru', sourceUrl: burs(6),
    q: 'Eşit uzunluktaki iki nehir kıyısı 30 metreden kısadır. Bir kıyıda 40 cm, diğerinde 50 cm aralıklarla işaret konuyor. Başlangıç ve bitiş iki tarafta da işaretli. Sadece karşı karşıya gelen işaretlerin her birine ağaç dikilirse en çok kaç ağaç dikilir?', a: '30', explanation: 'Karşılıklı işaretler 200 cm arayla oluşur. Uygun en büyük kıyı uzunluğu 28 m. Her kıyıda 28 ÷ 2 + 1 = 15 işaret, toplam 30 ağaç.' },
  { grade: 6, difficulty: 'orta', subject: 'Ondalık gösterim • Güneş sistemi', source: 'PISA 2022 · CMA123Q02', sourceUrl: pisa,
    q: 'Neptün’ün Güneş’e ortalama uzaklığı 30,05 astronomik birimdir. 1 astronomik birimi 150 milyon km al. Neptün’ün uzaklığı yüz milyon kilometreye yuvarlandığında kaç milyon kilometre olur?', a: '4500', explanation: '30,05 × 150 = 4507,5 milyon km. En yakın 100 milyon km’ye yuvarlandığında 4500 milyon km olur.' },
  { grade: 7, difficulty: 'zor', subject: 'Tam sayılar • Uzaklık ve çarpım', source: '2026 İOKBS · 7. sınıf A · 3. soru', sourceUrl: burs(7),
    q: 'Sayı doğrusunda a sayısı −3’e 5 birim, b sayısı 5’e 3 birim uzaktır. Olası a ve b değerlerini düşün. a × b için elde edilebilecek en küçük değer nedir?', a: '-64', explanation: 'a değeri −8 veya 2, b değeri 2 veya 8 olabilir. En küçük çarpım −8 × 8 = −64.' },
  { grade: 7, difficulty: 'orta', subject: 'Yüzdeler • Market bütçesi', source: '2026 İOKBS · 7. sınıf A · 19. soru', sourceUrl: burs(7),
    q: 'Bir alışverişte 2200 TL’lik gıda sepetine %5, 1600 TL’lik temizlik sepetine %10 indirim uygulanıyor. İndirimli iki tutar birlikte kaç TL eder?', a: '3530', explanation: 'Gıda 2200 × 0,95 = 2090 TL, temizlik 1600 × 0,90 = 1440 TL. Toplam 3530 TL.' },
  { grade: 7, difficulty: 'orta', subject: 'Örüntü ve yüzde • Renkli parçalar', source: 'PISA 2022 · CMA150Q02', sourceUrl: pisa, family: 'pisa-triangles',
    q: 'Bir mozaikte ilk dört sırada 1, 3, 5 ve 7 üçgen var. Sıralar kırmızıyla başlıyor, renkler kırmızı–mavi şeklinde ilerliyor. Aynı kuralla beşinci sıra eklendiğinde bütün parçaların yüzde kaçı mavidir? Yüzde işareti olmadan yaz.', a: '40', explanation: 'Beşinci sırada 9 üçgenin 4’ü mavidir. Beş sırada 25 üçgen ve 10 mavi parça olur. 10 ÷ 25 × 100 = 40.' },
  { grade: 8, difficulty: 'zor', subject: 'Ortak katlar ve tam kareler • Merdiven', source: '2026 İOKBS · 8. sınıf A · 1. soru', sourceUrl: burs(8),
    q: 'İki merdiven aynı yüksekliğe çıkıyor. Birindeki basamaklar 25 cm, diğerindekiler 40 cm yüksekliğinde. Çıkılan yükseklik santimetre cinsinden pozitif bir tam kare ise iki merdivende toplam en az kaç basamak olabilir?', a: '26', explanation: '25 ve 40’ın EKOK’u 200’dür. Bu sayının en küçük tam kare katı 400. Basamak sayıları 16 ve 10, toplam 26.' },
  { grade: 8, difficulty: 'orta', subject: 'Aralarında asal sayılar', source: '2026 İOKBS · 8. sınıf A · 2. soru', sourceUrl: burs(8),
    q: 'a < 29 < b < 37 sıralamasında a ve b doğal sayıları 50 ile aralarında asal. a + b toplamını en çok kaç yapabilirsin?', a: '60', explanation: '50 ile aralarında asal olmak için sayı 2’ye ya da 5’e bölünmemeli. En büyük uygun a = 27 ve b = 33. Toplam 60.' },
  { grade: 8, difficulty: 'kolay', subject: 'Kareköklü ifadeler • Tam kare', source: '2026 LGS · Sayısal A · 1. soru', sourceUrl: lgs,
    q: '3, 9, 18 ve 27 kartlarından yalnızca birindeki sayı, bir pozitif tam sayının karesidir. Karttaki sayıyı yaz.', a: '9', explanation: '3 × 3 = 9. Diğer üç değer iki ardışık tam kare arasında kalır.' },
  { grade: 8, difficulty: 'zor', subject: 'Olasılık • Mutfak', source: '2026 LGS · Sayısal A · 5. soru', sourceUrl: lgs,
    q: '60 cm kenarlı kare gözlemenin sol yarısı peynirli, sağ yarısı patatesli. Kenarlara paralel kesimlerle 12 cm kenarlı kare dilimler elde ediliyor. Rastgele bir dilimin tamamen peynirli olma olasılığını sade kesirle yaz.', a: '2/5', explanation: '5 × 5 = 25 dilim oluşur. Ortadaki sütun iki harç içerir. Yalnızca ilk iki sütundaki 10 dilim tamamen peynirlidir. 10/25 = 2/5.' },
  { grade: 8, difficulty: 'zor', subject: 'EBOB ve en az paket • Üretim', source: '2026 LGS · Sayısal A · 11. soru', sourceUrl: lgs,
    q: '168 beyaz ve 200 sarı mum, tek renkli ve her biri eşit adetli paketlere ayrılıyor. Paket sayısı olabildiğince az tutuluyor. 17 beyaz ve 11 sarı mum kırılmışsa en çok kaç paket tümüyle sağlam olabilir?', a: '41', explanation: 'EBOB(168, 200) = 8, dolayısıyla toplam 46 paket vardır. Kırıklar en az 3 beyaz ve 2 sarı pakete sığar. 46 − 5 = 41.' },
  { grade: 8, difficulty: 'zor', subject: 'Üslü ifadeler • Enerji dönüşümü', source: '2026 LGS · Sayısal A · 9. soru', sourceUrl: lgs,
    q: 'Bir enerji karşılaştırmasında 1 kg toryum, 3 500 000 kg kömüre denk kabul ediliyor. 100 000 kg kömür 80 aracın ihtiyacına yetiyor. Aynı ihtiyaçtaki 28 araç için kaç kilogram toryuma denk enerji gerekir?', a: '0,01', explanation: '28 araç için 100 000 × 28 ÷ 80 = 35 000 kg kömür eşdeğeri gerekir. 35 000 ÷ 3 500 000 = 0,01 kg.' },
  { grade: 8, difficulty: 'orta', subject: 'Çarpanlara ayırma • Cebir', source: 'MEB Kasım 2024 · Matematik örneği · 6. soru', sourceUrl: sample,
    q: '4xy − 6y ifadesinin ortak çarpanı 2y’dir. Bu çarpanı ayırdığında parantezde kalan ifade x = 5 için kaç değerini alır?', a: '7', explanation: '4xy − 6y = 2y(2x − 3). Parantezde x = 5 yazarsak 10 − 3 = 7.' },
  { grade: 8, difficulty: 'zor', subject: 'Eşitsizlik • Belediye otobüsü', source: 'MEB Kasım 2024 · Matematik örneği · 8. soru', sourceUrl: sample,
    q: 'Bir otobüs 43 yolcuyla hareket ediyor ve son durağa kadar dört ara duraktan geçiyor. Her ara durakta 0–5 kişi binebilir ve 0–2 kişi inebilir. Son durağa vardığında olası en büyük ve en küçük yolcu sayılarının farkı kaçtır?', a: '28', explanation: 'En yüksek sayı 43 + 4 × 5 = 63, en düşük 43 − 4 × 2 = 35. Fark 28.' },
  { grade: 8, difficulty: 'zor', subject: 'Olasılık ve örüntü • Parçalı battaniye', source: 'MEB Kasım 2024 · Matematik örneği · 5. soru', sourceUrl: sample,
    q: '160 × 240 cm bir battaniye 20 cm kenarlı karelerle kaplanıyor. Her sıra 8 kare uzunluğunda. Renkler sarı, mavi, kırmızı olarak sırayı kesmeden tekrarlanıyor. Yedi sıra tamamlandığında kalan karelerden rastgele seçilen birinin kırmızı olma olasılığını sade kesirle yaz.', a: '7/20', explanation: 'Battaniye 96 kare ister. 56 kare kullanıldığında 40 kare kalır. Kalan dizide önce bir kırmızı, ardından 13 tam üçlü vardır. 14 kırmızıdan olasılık 14/40 = 7/20.' },
  { grade: 8, difficulty: 'zor', subject: 'Veri yorumlama • Güneş sistemi', source: 'PISA 2022 · CMA123Q01', sourceUrl: pisa,
    q: 'Güneş’e ortalama uzaklıklar Mars 1,52, Jüpiter 5,20, Satürn 9,58, Uranüs 19,20, Neptün 30,05 astronomik birim. Uzaklık sırasına göre seçilen üç gezegen arasında önce 4,38, sonra 9,62 birim fark vardır. Ortadaki gezegenin adını yaz.', a: 'Satürn', explanation: '9,58 − 5,20 = 4,38 ve 19,20 − 9,58 = 9,62. Sıra Jüpiter, Satürn, Uranüs’tür.' },
];

export const sourceQuestions: Question[] = adaptations.map(question => ({ ...question, category: 'adaptation' }));
