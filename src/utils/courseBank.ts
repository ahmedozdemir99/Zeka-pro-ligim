import type { Course, Question } from '../types';

// Rows contain a specific learning outcome, the prompt, the key and three distractors.
const bank: Record<Exclude<Course, 'mathematics'>, string[]> = {
  turkish: [
    `Cümlenin yüklem türünü tanıma|“Bugünkü toplantı çok verimliydi.” Yüklemine göre cümle türü nedir?|İsim cümlesi|Fiil cümlesi|Eksiltili cümle|Devrik cümle
Fiilimsiyi tanıma|“Koşarak otobüse yetişti.” cümlesindeki fiilimsi nedir?|Koşarak|Otobüse|Yetişti|Otobüs
Metinde gerekçeyi belirleme|“Kütüphane hafta sonu açık olmalı çünkü birçok öğrenci hafta içi gelemiyor.” Önerinin gerekçesi nedir?|Öğrencilerin hafta içi gelememesi|Kitapların artması|Sınavın ertelenmesi|Kütüphanenin taşınması
Cümlenin ögelerini belirleme|“Mert akşam çantasını hazırladı.” cümlesinin öznesi nedir?|Mert|Akşam|Çantasını|Hazırladı
Ana düşünceyi belirleme|“Bir karar vermeden önce farklı kaynaklara bakmak, yanlış bilginin etkisini azaltır.” Ana düşünce nedir?|Bilgiyi farklı kaynaklardan doğrulamak önemlidir|Tek kaynağa güvenmek yeterlidir|Hızlı karar her zaman iyidir|Bilgi paylaşımı durdurulmalıdır`,
  ],
  science: [
    `DNA ile gen arasındaki ilişkiyi açıklama|Kalıtsal bilgi taşıyan DNA bölümü nedir?|Gen|Hücre|Doku|Organ
Katı basıncını yorumlama|Karda geniş tabanlı ayakkabı giymek yüzeye uygulanan basıncı nasıl değiştirir?|Azaltır|Artırır|Değiştirmez|Önce artırır
Mevsimlerin oluşumunu açıklama|Dünya’nın Güneş çevresindeki dolanımıyla birlikte mevsimleri oluşturan özellik nedir?|Eksen eğikliği|Ay’ın evreleri|Dünya’nın çekirdeği|Okyanusların tuzluluğu
Basit makinelerde kuvvet kazancını yorumlama|Yükü aynı yüksekliğe çıkaran daha uzun bir rampada gerekli kuvvet nasıl değişir?|Azalır|Artar|Değişmez|Sıfır olur
Madde döngülerini açıklama|Bitkiler fotosentezde atmosferden hangi gazı alır?|Karbondioksit|Oksijen|Helyum|Hidrojen`,
  ],
  social: [
    `Millî Mücadele’de egemenlik anlayışını açıklama|“Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.” sözü hangi genelgede yer alır?|Amasya Genelgesi|Havza Genelgesi|Tekâlif-i Milliye|Misak-ı Millî
Kongrelerin kararlarını tanıma|Millî cemiyetlerin tek çatı altında toplandığı kongre hangisidir?|Sivas Kongresi|Erzurum Kongresi|Balıkesir Kongresi|Alaşehir Kongresi
TBMM’nin açılışını yorumlama|23 Nisan 1920’de hangi kurum açılmıştır?|Türkiye Büyük Millet Meclisi|Türk Dil Kurumu|Türk Tarih Kurumu|Millet Mektepleri
Atatürk ilkeleriyle inkılapları ilişkilendirme|Saltanatın kaldırılması ve Cumhuriyet’in ilanı en doğrudan hangi ilkeyle ilişkilidir?|Cumhuriyetçilik|Devletçilik|Milliyetçilik|Halkçılık
Millî Mücadele’nin diplomatik sonuçlarını tanıma|Yeni Türk devletinin bağımsızlığını uluslararası düzeyde tanıtan antlaşma hangisidir?|Lozan Barış Antlaşması|Sevr Antlaşması|Mondros Ateşkes Antlaşması|Brest-Litovsk Antlaşması`,
  ],
  religion: [
    `Kader ve insanın sorumluluğunu ilişkilendirme|Bir öğrencinin sınava hazırlanmayı seçmesi hangi kavramla açıklanır?|İrade|Tesadüf|Kıble|İnfak
Zekâtın toplumsal işlevini açıklama|Zekâtın ihtiyaç sahiplerine verilmesi hangi toplumsal değeri güçlendirir?|Dayanışma|Rekabet|Gösteriş|İsraf
Hz. Muhammed’in örnek davranışlarını tanıma|Hz. Muhammed’in güvenilirliğini anlatan lakap nedir?|El-Emin|El-Fatih|El-Âlim|El-Melik
Kur’an’ın temel konularını ayırt etme|Peygamberlerin hayatından ders veren anlatılara ne ad verilir?|Kıssa|Sure|Cüz|Meal
Din ve hayat arasındaki ilişkiyi yorumlama|Bir satıcının ürünündeki kusuru müşteriye söylemesi hangi ahlaki ilkeye örnektir?|Dürüstlük|İsraf|Gösteriş|Kıskançlık`,
  ],
  english: [
    `Friendship • Davete verilen cevabı yorumlama|“Would you like to join us?” “I’d love to, but I have a match.” What does the reply express?|Refusal with a reason|Acceptance|A new invitation|A request for directions
Teen Life • Alışkanlık bilgisini yorumlama|“I usually practice guitar after school.” What does she usually do after school?|Practices guitar|Plays football|Reads magazines|Meets her cousins
In the Kitchen • İşlem sırasını takip etme|“First chop the onions. Then heat the oil.” What comes before heating the oil?|Chopping the onions|Adding salt|Serving the meal|Washing the pan
On the Phone • Mesaj bırakma amacını anlama|“Could you tell Mert to call me back?” What does the caller want Mert to do?|Return the call|Send an email|Visit the caller|Buy a new phone
The Internet • Güvenli internet davranışını tanıma|“Never share your password with strangers.” What should you keep private?|Your password|Your favorite sport|A weather report|A public article`,
  ],
};
const gradeEightCodes: Record<string, string[]> = {
  turkish: ['T.8.4.19', 'T.8.3.9', 'T.8.3.14', 'T.8.4.18', 'T.8.3.17'],
  science: ['F.8.2.1.1', 'F.8.3.1.1', 'F.8.1.1.1', 'F.8.5.1.1', 'F.8.6.2.2'],
  social: ['İTA.8.2.5', 'İTA.8.2.5', 'İTA.8.2.6', 'İTA.8.4.1', 'İTA.8.3.6'],
  religion: ['DKAB.8.1.2', 'DKAB.8.2.3', 'DKAB.8.4.1', 'DKAB.8.5.2', 'DKAB.8.3.1'],
  english: ['E8.1.R1', 'E8.2.R1', 'E8.3.R1', 'E8.4.R1', 'E8.5.R1'],
};

export const courseBank: Question[] = Object.entries(bank).flatMap(([course, levels]) =>
  levels[0].split('\n').map((row, number) => {
    const [outcome, q, a, ...distractors] = row.split('|');
    return { course: course as Course, grade: 8, difficulty: number < 2 ? 'kolay' : number < 4 ? 'orta' : 'zor',
      outcome, outcomeCode: gradeEightCodes[course][number], subject: outcome, q, a, distractors, category: 'context' };
  }));
