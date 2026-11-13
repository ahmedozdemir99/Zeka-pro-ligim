import type { Course, Question } from '../types';

type Block = { grade: number; course: Course; code: string; outcome: string; rows: string };
const blocks: Block[] = [
  { grade: 5, course: 'turkish', code: 'T.O.5.5', outcome: 'Sözcük anlamını bağlamdan çıkarma', rows: `
“Yokuşun sonunda oturup biraz soluklandı.” Soluklanmak bu cümlede ne demektir?|Dinlenmek|Hızlanmak|Yön değiştirmek|Seslenmek
“Otobüs doluydu, ancak arka sırada tek bir boş yer kalmıştı.” Burada “boş” ne demektir?|Kullanılmayan|Değersiz|Yetersiz|Gereksiz
“Deniz feneri karanlıkta tekneye kılavuzluk etti.” Kılavuzluk etmek ne demektir?|Yol göstermek|Hızı artırmak|Yük taşımak|Uyarıyı gizlemek
“Pazar tezgâhındaki elmaların bir bölümü bereliydi, kabuklarında ezik izleri vardı.” Bereli ne demektir?|Ezilmiş|Olgunlaşmamış|Yıkanmış|Soyulmuş
“Rehber, köprüden geçerken temkinli yürümemizi, adımlarımıza dikkat etmemizi istedi.” Temkinli ne demektir?|Tedbirli|Neşeli|Sabırsız|Kararsız` },
  { grade: 6, course: 'turkish', code: 'T.O.6.8', outcome: 'Metinden basit çıkarım yapma', rows: `
“Derya, montunu alıp pencereden sokağa baktı. Evden çıkmadan şemsiyesini de çantasına koydu.” Hangi çıkarım desteklenir?|Yağışa hazırlık yaptı|Okula gitmek istemedi|Montunu değiştirdi|Şemsiyesini unuttu
“Yusuf tabelayı görünce konuşmayı kesti ve kitabını açtı.” Tabelanın en olası mesajı nedir?|Sessiz olun|Sıraya girin|Çıkış sağda|Çanta bırakmayın
“Bir gün önce çiçeklerin toprağı çatlamıştı. Bugün Elif sulama kabını alarak bahçeye çıktı.” Elif’in amacı ne olabilir?|Toprağı sulamak|Çiçekleri sökmek|Saksıları boyamak|Çiçekleri saymak
“Öğretmen süreyi duyurunca Ali daha önce işaretlediği sorulara döndü.” Ali büyük olasılıkla ne yapmak istiyor?|Cevaplarını kontrol etmek|Yeni bir defter almak|Sınıftan çıkmak|Sınavı uzatmak
“Sınıfa iki misafir gelince Eda masanın yanına iki sandalye taşıdı.” Eda’nın davranışından hangi sonuç çıkarılır?|Misafirlere oturacak yer hazırladı|Sınıfın yerini değiştirdi|Sandalye sayısını azalttı|Dersi bitirdi` },
  { grade: 7, course: 'turkish', code: 'T.O.7.7', outcome: 'Metinden basit çıkarım yapma', rows: `
“Çarşıdaki yeni tabela satıcıları iki gruba ayırdı. Bazıları yayaların daha rahat yürüdüğünü, diğerleri mal taşımanın zorlaştığını söyledi.” Tabelanın konusu ne olabilir?|Araç girişinin sınırlandırılması|Dükkânların boyanması|Satış vergisinin düşmesi|Pazarın açılış saati
“Kulüp her hafta parkta antrenman yapıyordu. Bu hafta çimlere bakım yapıldığı için üyeler spor salonunda toplandı.” Yer değişikliğinin gerekçesi nedir?|Park zemininin bakımı|Takımın dağıtılması|Oyuncu sayısının artması|Salonun kapanması
“Banka görevlisi, verilen bağlantının resmi siteye gitmediğini görünce müşteriyi uyardı.” Uyarının gerekçesi ne olabilir?|Bağlantının güvenilir olmaması|İnternetin yavaş olması|Telefonun şarjının bitmesi|Bankanın erken kapanması
“Okul, iki hafta boyunca servislerin varış saatlerini kaydetti ve en sık geciken duraktaki hareket saatini değiştirdi.” Okul kararını neye dayandırdı?|Toplanan varış verilerine|Öğrenci notlarına|Sınıf mevcuduna|Öğretmen kıdemine
“Grupta herkes aynı görevi seçince proje lideri iş listesini yeniden dağıttı.” Liderin önlemek istediği durum nedir?|Bazı görevlerin sahipsiz kalması|Görevlerin eşit sürede bitmesi|İşlerin sırasının görünmesi|Katılımcıların birbirini tanıması` },
  { grade: 5, course: 'science', code: 'FB.5.1.2', outcome: 'Ay’ın özelliklerini ve hareketlerini yorumlama', rows: `
Ay’ın Dünya çevresinde yaptığı hareketin adı nedir?|Dolanma|Dönme|Titreşim|Yansıma
Bir öğrenci modelde Ay küresini kendi ekseni etrafında çeviriyor. Hangi hareketi gösteriyor?|Dönme|Dolanma|Kırılma|Salınım
Ay’ın yüzeyinde çok sayıda çukur gözleniyor. Bu çukurlara ne ad verilir?|Krater|Ova|Nehir|Buzul
Ay gündüz de görülebilir. Ay’ı görünür yapan ışığın kaynağı nedir?|Güneş|Dünya’nın çekirdeği|Ay’ın yüzeyi|Venüs
Modelde Ay’ın hem kendi çevresinde hem de Dünya çevresinde hareket etmesi, sırasıyla hangi iki hareketi gösterir?|Dönme ve dolanma|Dolanma ve dönme|Yansıma ve dönme|Dolanma ve titreşim` },
  { grade: 6, course: 'science', code: 'FB.6.1.2.1', outcome: 'Tutulmalarla ilgili bilimsel çıkarım yapma', rows: `
Bir modelde Güneş ile Dünya arasında Ay var ve gölgesi Dünya’ya düşüyor. Hangi olay modellenmiştir?|Güneş tutulması|Ay tutulması|Ay’ın dönmesi|Dünya’nın dönmesi
Ay’ın Dünya’nın gölgesine girdiği bir gecede hangi olay gözlenir?|Ay tutulması|Güneş tutulması|Güneş lekesi|Kutup ışığı
Güneş tutulmasını modelleyen bir öğrenci Dünya’ya ulaşan ışığın bir bölümünü hangi cisimle engellemelidir?|Ay|Dünya|Güneş|Mars
Ay tutulmasını gösteren modelde ışık kaynağı, ortadaki küre ve gölgedeki küre sırasıyla neyi temsil eder?|Güneş, Dünya, Ay|Güneş, Ay, Dünya|Dünya, Güneş, Ay|Ay, Güneş, Dünya
Güneş tutulması Dünya’nın yalnızca belirli bir bölgesinden tam tutulma olarak izleniyorsa o bölgenin ortak özelliği nedir?|Ay’ın tam gölgesinde kalması|Dünya’nın tam gölgesinde kalması|Ay’a en uzak yer olması|Yer çekiminin azalması` },
  { grade: 7, course: 'science', code: 'FB.7.1.2.2', outcome: 'Yıldız, galaksi ve evren ilişkisini yorumlama', rows: `
Güneş aşağıdaki gruplardan hangisine girer?|Yıldız|Uydu|Gezegen|Galaksi
Güneş Sistemi’nin içinde bulunduğu galaksi hangisidir?|Samanyolu|Andromeda|Orion|Büyük Ayı
Bir modelde yıldızlar küçük noktalarla gösteriliyor. Çok sayıda yıldızdan oluşan bağlı bir sistem neyi temsil eder?|Galaksiyi|Bir uydunun yörüngesini|Bir gezegenin atmosferini|Tek bir yıldızı
Bir sunumda Samanyolu evrenin tamamı olarak gösterilmiş. Hata nasıl düzeltilir?|Samanyolu evrendeki galaksilerden biri olarak gösterilir|Evren bir yıldızın içine yerleştirilir|Güneş bir galaksi olarak etiketlenir|Samanyolu, Dünya’nın içine alınır
Kapsam bakımından küçükten büyüğe doğru sıralama hangisidir?|Yıldız, galaksi, evren|Evren, yıldız, galaksi|Galaksi, evren, yıldız|Galaksi, yıldız, evren` },
  { grade: 5, course: 'social', code: 'SB.5.1.1', outcome: 'Gruplar ve rollerini ilişkilendirme', rows: `
Aynı öğrenci evde abla, okul takımında kaptandır. Bu durum neyi gösterir?|Roller gruba göre değişebilir|Bir kişinin tek rolü olur|Ev ve okul aynı gruptur|Roller yaşla hiç değişmez
Sınıfın kütüphane sorumlusu hangi işi üstlenir?|Kitapların düzenini takip etmek|Sınav notlarını vermek|Servis sürmek|Maçta hakemlik yapmak
Ece, tiyatro grubunda kostümleri düzenler. Ece’nin bu gruptaki rolü nedir?|Kostüm sorumlusu|Sahne seyircisi|Spor kaptanı|Sınıf temsilcisi
Bir öğrenci bilim kulübünde rapor yazar ve ailede sofrayı hazırlar. Hangi ifade doğrudur?|Her grup farklı sorumluluklar getirebilir|Yalnız okulda rol üstlenir|Evdeki görevi bilim kulübünü yönetmektir|İki görevi aynı gruptadır
Takım antrenmanında kaleci kaleyi korurken kaptan takım adına konuşuyor. Bu iş bölümü neyi gösterir?|Bir grupta farklı roller bulunabilir|Her üyenin görevi aynıdır|Roller yalnızca evde vardır|Görev paylaşımı grubu ortadan kaldırır` },
  { grade: 6, course: 'social', code: 'SB.6.2.2', outcome: 'Doğal ve beşerî çevre arasındaki ilişkiyi çözümleme', rows: `
Doğu Karadeniz’de çay tarımının yaygınlaşmasına hangi iklim özelliği katkı sağlar?|Bol yağış|Uzun kuraklık|Çok az nem|Yıl boyu don
Dağlık arazide iki kıyı yerleşimi arasında tünel açılması hangi ilişkiye örnektir?|Yer şekilleri ulaşımı etkiler|Ulaşım iklimi belirler|Nüfus denizi oluşturur|Yağış maden çıkarır
Bir kıyı kentinde doğal limanın varlığı hangi ekonomik faaliyeti doğrudan kolaylaştırır?|Deniz taşımacılığı|Yayla hayvancılığı|Ormancılık|Yer altı madenciliği
Az yağış alan bir ovada damla sulama kullanılıyor. İnsanlar hangi doğal koşula uyum sağlamıştır?|Suyun sınırlı olmasına|Ormanın sık olmasına|Dalgaların yükselmesine|Kıyının girintili olmasına
Yoğun kar alan köyde evlerin çatıları dik eğimli yapılmış. Bu tercih hangi amaca hizmet eder?|Karın çatıda birikmesini azaltmak|Evin yer değiştirmesini sağlamak|Daha az yağmur yağdırmak|Rüzgâr yönünü değiştirmek` },
  { grade: 7, course: 'social', code: 'SB.7.1.1', outcome: 'Gruplarda etkili iletişimin önemini sorgulama', rows: `
Tartışmada arkadaşının sözünü kesen öğrenciye en yapıcı öneri nedir?|Önce dinleyip sonra konuşması|Daha yüksek sesle konuşması|Konuyu değiştirmesi|Grubu terk etmesi
Bir takımda iki kişi aynı görevi üstlenmiş ve üçüncü görev unutulmuş. İletişim sorunu nasıl azaltılır?|Görevleri birlikte belirleyip teyit ederek|Mesajları gizleyerek|Yalnızca bir üyeye haber vererek|Görev listesini silerek
Bir arkadaşın konuşması yanlış anlaşıldığında ilk adım hangisi olabilir?|Ne demek istediğini sormak|Onun niyetini varsaymak|Herkese şikâyet etmek|Konuşmayı bitirmek
Sunum sırasında gürültü arttığında grup başkanı hangi ifadeyle iletişimi destekler?|“Birbirimizi duyabilmek için sırayla konuşalım.”|“Kimse konuşmasın, ben karar veririm.”|“Gürültü yapanlar gitsin.”|“Beni dinlemeyen konuşamaz.”
Bir grubun yazışmalarında sıkça yanlış anlaşılma oluyorsa hangi değişiklik yardımcı olur?|Mesajları açık yazıp anlaşılmayan noktayı sormak|Cevapları tahmin etmek|Mesajları okumadan silmek|Her mesaja tek emoji koymak` },
  { grade: 5, course: 'religion', code: 'DKAB.5.1.2', outcome: 'Allah’ın birliğiyle ilgili kavramları yorumlama', rows: `
Allah’ın birliğine inanmayı ifade eden kavram nedir?|Tevhit|İnfak|Şükür|Tövbe
Bir öğrenci “Allah’ın eşi ve benzeri yoktur.” diyor. Bu düşünce hangi kavramla ilişkilidir?|Tevhit|Sabır|Adalet|İstişare
Bir afişin başlığı “Allah’ın Birliği” ise hangi cümle afişle en iyi örtüşür?|Allah birdir|İnsan hata yapabilir|Yardım dayanışmayı artırır|Vakit değerlidir
“Allah tektir.” ifadesinde vurgulanan özellik nedir?|Birlik|Çokluk|Değişkenlik|Sınırlılık
Evrendeki düzen üzerine konuşan öğrencilerden hangisi Allah’ın birliği inancını dile getirmiştir?|“Yaratıcının eşi ve ortağı yoktur.”|“Günler mevsime göre uzar.”|“Birlikte çalışmak işi kolaylaştırır.”|“Dürüst davranmak gerekir.”` },
  { grade: 6, course: 'religion', code: 'DKAB.6.1.3', outcome: 'İlahi kitapları ilişkilendirme', rows: `
Hz. Musa’ya gönderilen ilahi kitap hangisidir?|Tevrat|İncil|Zebur|Kur’an-ı Kerim
Hz. Davud ile hangi ilahi kitap ilişkilendirilir?|Zebur|Tevrat|İncil|Kur’an-ı Kerim
Bir zaman çizelgesinde Hz. İsa ile eşleştirilmesi gereken ilahi kitap hangisidir?|İncil|Tevrat|Zebur|Kur’an-ı Kerim
İslam’a göre son ilahi kitap hangisidir?|Kur’an-ı Kerim|İncil|Tevrat|Zebur
Bir öğrenci Hz. Musa, Hz. Davud, Hz. İsa sırasıyla kitapları eşleştiriyor. Doğru sıra nedir?|Tevrat, Zebur, İncil|Zebur, İncil, Tevrat|İncil, Tevrat, Zebur|Tevrat, İncil, Zebur` },
  { grade: 7, course: 'religion', code: 'DKAB.7.1.2', outcome: 'Ahiret hayatının aşamalarını çözümleme', rows: `
Ölümden sonra yeniden dirilmeye ne ad verilir?|Ba’s|İnfak|Kıble|Niyet
Yeniden diriltilen insanların bir araya toplanması hangi kavramla ifade edilir?|Haşir|İhram|Tavaf|Kıyam
İslam inancında insanın dünyadaki davranışlarından sorgulanması hangi kavramla ifade edilir?|Hesap|İmsak|İtikâf|Tebliğ
Ahiret aşamalarını gösteren bir şemada dirilişten önce hangi olay bulunur?|Ölüm|Haşir|Hesap|Mizan
“Yeniden dirilme, toplanma ve sorgulanma” kavramlarının sıralaması hangisidir?|Ba’s, haşir, hesap|Haşir, hesap, ba’s|Hesap, ba’s, haşir|Ba’s, hesap, haşir` },
  { grade: 5, course: 'english', code: 'ENG.5.1.R3', outcome: 'Okul yaşamıyla ilgili yazılı metni anlama', rows: `
“Please walk in the corridor.” What should students do?|Walk|Run|Sing|Jump
“The science club meets in Room 4.” Where does the club meet?|Room 4|Room 2|The gym|The canteen
“Bring a pencil to the art club.” What does a new member need?|A pencil|A ball|A coat|A spoon
“The library opens after lunch today.” When does it open?|After lunch|Before class|At night|Before breakfast
“Chess club is on Monday. Drama club is on Friday.” Which club meets first in the week?|Chess club|Drama club|Both on Friday|Neither club` },
  { grade: 6, course: 'english', code: 'ENG.6.1.R3', outcome: 'Okul rutini ve görevlerini metinden anlama', rows: `
“The class monitor checks the list before lessons.” Who checks the list?|The class monitor|The coach|The driver|The librarian
“Students must return library books by Thursday.” What is the deadline?|Thursday|Friday|Tuesday|Monday
“After lunch, Deniz cleans the board and Ali opens the windows.” What is Ali’s responsibility?|Opening the windows|Cleaning the board|Preparing lunch|Checking homework
“Bring your permission form. Without it, you cannot go on the school trip.” What is necessary?|A permission form|A sports bag|A new pencil|A library book
“Today the first lesson starts at nine, half an hour later than usual.” What is the usual start time?|Half past eight|Half past nine|Nine o’clock|Eight o’clock` },
  { grade: 7, course: 'english', code: 'ENG.7.1.R3', outcome: 'Okul yarışmalarıyla ilgili duyuruyu yorumlama', rows: `
“Teams need three players to enter the quiz.” Can a pair enter as a full team?|No|Yes|Only on Tuesday|Only after lunch
“The running race was postponed because of heavy rain.” Why was the race postponed?|Because of heavy rain|Because of a new coach|Because of a holiday|Because of a missing trophy
“Sign up by Thursday. The chess competition begins on Friday.” What must happen first?|Students sign up|The competition begins|The prizes are given|The results are announced
“Bring a bottle, but the school will provide rackets.” What should players bring?|A bottle|A racket|A trophy|A net
“Music practice ends at 3:30. The spelling contest starts at 3:15.” Why can’t Bora attend all of both events?|The events overlap|Both events were cancelled|They are on different days|He needs a racket` },
];

export const reviewedQuestions: Question[] = blocks.flatMap(({ grade, course, code, outcome, rows }) =>
  rows.trim().split('\n').map((row, i) => {
    const [q, a, ...distractors] = row.trim().split('|');
    return { grade, course, outcome, outcomeCode: code, subject: outcome, q, a, distractors,
      difficulty: i < 2 ? 'kolay' : i < 4 ? 'orta' : 'zor', category: 'context' };
  }));

const extra: Array<[grade: number, course: Course, code: string, outcome: string, prompt: string, answer: string, ...distractors: [string, string, string]]> = [
  [5, 'turkish', 'T.O.5.8', 'Metinden basit çıkarım yapma', '“Saha kapısında birikmiş suyu gören kaptan takımı salona götürdü.” Kaptan neden salonu seçmiş olabilir?', 'Açık saha ıslak olduğu için', 'Salon daha uzakta olduğu için', 'Takım dağıldığı için', 'Kapı boyandığı için'],
  [5, 'turkish', 'T.O.5.8', 'Metinden basit çıkarım yapma', '“Nehir, sırt çantasına hem pusula hem de patika haritası koydu.” Nehir neye hazırlanıyor olabilir?', 'Doğa yürüyüşüne', 'Yüzme dersine', 'Müzik provasına', 'Yazılı sınava'],
  [6, 'turkish', 'T.O.6.5', 'Sözcük anlamını bağlamdan çıkarma', '“Duru’nun önerisi sınıfta yankı uyandırdı, arkadaşları gün boyu bu öneriyi konuştu.” Yankı uyandırmak burada ne demektir?', 'İlgi çekmek', 'Ses kaydetmek', 'Yanlış anlaşılmak', 'Unutulmak'],
  [6, 'turkish', 'T.O.6.5', 'Sözcük anlamını bağlamdan çıkarma', '“Ece, oyuncular arasında ara buluculuk yaptı; iki tarafın da kabul ettiği bir çözüm buldu.” Ara buluculuk burada ne demektir?', 'Anlaşmaya yardımcı olmak', 'Kuralları tek başına değiştirmek', 'Kazananı ilan etmek', 'Tartışmayı büyütmek'],
  [5, 'science', 'FB.5.1.4', 'Güneş, Dünya ve Ay’ı modelleme', 'Güneş, Dünya ve Ay’ı büyüklük sırasına göre üç farklı top temsil edecek. En büyük top hangi gök cismine ayrılmalı?', 'Güneş', 'Dünya', 'Ay', 'Dünya ve Ay birlikte'],
  [5, 'science', 'FB.5.1.4', 'Güneş, Dünya ve Ay’ı modelleme', 'Bir öğrenci Dünya’yı Güneş’in çevresinde hareket ettiriyor. Bu hareket modelde hangi olguyu temsil eder?', 'Dünya’nın Güneş çevresinde dolanmasını', 'Dünya’nın kendi ekseninde dönmesini', 'Ay’ın kendi ekseninde dönmesini', 'Güneş’in Dünya çevresinde dolanmasını'],
  [6, 'science', 'FB.6.1.1.1', 'Gezegenleri özelliklerine göre sınıflandırma', 'Dünya ve Mars benzer yapıları nedeniyle aynı gruba alınmış. Bu grubun adı nedir?', 'Karasal gezegenler', 'Gaz devleri', 'Doğal uydular', 'Yıldızlar'],
  [6, 'science', 'FB.6.1.1.1', 'Gezegenleri özelliklerine göre sınıflandırma', 'Jüpiter ve Satürn hangi ortak yapısal özellikle aynı gruba alınabilir?', 'Gaz devi olmaları', 'Güneş’e en yakın olmaları', 'Kendi ışıklarını üretmeleri', 'Yörüngelerinin Dünya’nın içinde olması'],
  [7, 'science', 'FB.7.2.1.2', 'Kinetik ve potansiyel enerjiyi karşılaştırma', 'Aynı kütlede iki top aynı yükseklikte. Birinin sürati 2 m/s, diğerinin 4 m/s. Hangisinin kinetik enerjisi büyüktür?', '4 m/s süratli topun', '2 m/s süratli topun', 'İkisinin eşittir', 'Hız bilgisi yetersizdir'],
  [7, 'science', 'FB.7.2.1.2', 'Kinetik ve potansiyel enerjiyi karşılaştırma', 'Özdeş iki kutu farklı yükseklikteki raflarda duruyor. Hangisinin yere göre çekim potansiyel enerjisi daha büyüktür?', 'Yüksek raftakinin', 'Alçak raftakinin', 'İkisinin eşittir', 'Hareketsiz kutuların potansiyel enerjisi yoktur'],
  [5, 'social', 'SB.5.1.2', 'Kültürel özelliklere saygıyı yorumlama', 'Sınıfta farklı yörelerin oyunları tanıtılacak. Hangi davranış kültürel farklılıklara saygıyı gösterir?', 'Her gruba kendi oyununu anlatma fırsatı vermek', 'Yalnız en kalabalık grubun oyununu seçmek', 'Farklı oyunlarla alay etmek', 'Bütün gruplara tek bir oyun dayatmak'],
  [5, 'social', 'SB.5.1.2', 'Kültürel özelliklere saygıyı yorumlama', 'Kermeste iki aile farklı yemekler getiriyor. Ziyaretçilerin birlikte öğrenmesini sağlayan düzenleme hangisidir?', 'Her aileye yemeğini ve öyküsünü anlatacağı yer ayırmak', 'Farklı yemekleri kaldırmak', 'Yemekleri tanıtmayı yasaklamak', 'Bir ailenin getirdiklerini saklamak'],
  [6, 'social', 'SB.6.2.1', 'Türkiye’nin göreceli konumunu belirleme', 'Bir öğrenci Türkiye’nin göreceli konumunu anlatacak. Hangi bilgiyi kullanabilir?', 'Asya ve Avrupa arasında yer alması', '36° ve 42° kuzey enlemleri arasında bulunması', 'Doğu meridyenlerinde yer alması', 'Başlangıç meridyeninin doğusunda belirli derecelerde olması'],
  [6, 'social', 'SB.6.2.1', 'Türkiye’nin göreceli konumunu belirleme', 'Türkiye’nin kuzeyindeki komşu deniz hangisidir?', 'Karadeniz', 'Akdeniz', 'Ege Denizi', 'Kızıldeniz'],
  [7, 'social', 'SB.7.1.2', 'Fırsat eşitliği için çözüm geliştirme', 'Tekerlekli sandalye kullanan öğrencinin sahneye çıkabilmesi için hangi düzenleme doğrudan yardımcı olur?', 'Erişilebilir bir rampa eklemek', 'Sahne ışıklarını artırmak', 'Etkinliği kısaltmak', 'Salonun adını değiştirmek'],
  [7, 'social', 'SB.7.1.2', 'Fırsat eşitliği için çözüm geliştirme', 'Okul duyurularındaki küçük yazıları bazı öğrenciler okuyamıyor. Hangi çözüm duyuruları daha erişilebilir yapar?', 'Büyük ve yüksek kontrastlı yazı kullanmak', 'Duyuruyu daha yükseğe asmak', 'Yazıyı daha da küçültmek', 'Duyuru panosunu kaldırmak'],
  [5, 'religion', 'DKAB.5.1.4', 'İhlas suresinin anlamını yorumlama', 'İhlas suresinde “O’nun hiçbir dengi yoktur.” ifadesi neyi vurgular?', 'Allah’ın eşsizliğini', 'İnsanların çeşitliliğini', 'İbadet vakitlerini', 'Paylaşmanın önemini'],
  [5, 'religion', 'DKAB.5.1.4', 'İhlas suresinin anlamını yorumlama', 'İhlas suresini özetleyen bir sunumda hangi başlık uygun olur?', 'Allah’ın birliği ve eşsizliği', 'Hac yolculuğu', 'Oruçta dikkat edilecekler', 'Peygamberlerin hayatı'],
  [6, 'religion', 'DKAB.6.1.2', 'Vahyin amacını yorumlama', 'Bir öğrenci vahyin insanlara gönderiliş amacını anlatıyor. Hangi ifade uygundur?', 'İnsanlara doğru yolu göstermeye rehberlik etmek', 'Yalnızca geçmiş tarihleri sıralamak', 'Her insanın seçimini onun yerine yapmak', 'İnsanların araştırmasını gereksiz kılmak'],
  [6, 'religion', 'DKAB.6.1.2', 'Vahyin amacını yorumlama', 'Bir metinde vahyin dürüstlük ve adalet gibi davranışlara yönelttiği anlatılıyor. Bu, vahyin hangi yönüne örnektir?', 'Davranışlara rehberlik etmesine', 'Takvim hazırlamasına', 'Ticaret fiyatı belirlemesine', 'Hava olaylarını değiştirmesine'],
  [7, 'religion', 'DKAB.7.1.1', 'Melekleri görevlerine göre sınıflandırma', 'İslam inancında vahyi peygamberlere ulaştırmakla görevli melek hangisidir?', 'Cebrail', 'Mikâil', 'İsrafil', 'Azrail'],
  [7, 'religion', 'DKAB.7.1.1', 'Melekleri görevlerine göre sınıflandırma', '“İsrafil” adını görev kartıyla eşleştiren bir öğrenci hangi kartı seçmelidir?', 'Sûra üflemek', 'Vahyi iletmek', 'Can almak', 'Amelleri yazmak'],
  [5, 'english', 'ENG.5.1.R3', 'Okul yaşamıyla ilgili yazılı metni anlama', '“Football club members must wear trainers.” What should a member wear?', 'Trainers', 'A scarf', 'Gloves', 'A school tie'],
  [5, 'english', 'ENG.5.1.R3', 'Okul yaşamıyla ilgili yazılı metni anlama', '“The school show is in the hall, not the garden.” Where is the show?', 'In the hall', 'In the garden', 'In the library', 'In the playground'],
  [6, 'english', 'ENG.6.1.R3', 'Okul rutini ve görevlerini metinden anlama', '“The sports captain collects the balls after practice.” When does the captain collect them?', 'After practice', 'Before practice', 'During lunch', 'Before school'],
  [6, 'english', 'ENG.6.1.R3', 'Okul rutini ve görevlerini metinden anlama', '“Visitors sign in at the office before meeting the teacher.” Where do visitors go first?', 'The office', 'The classroom', 'The gym', 'The library'],
  [7, 'english', 'ENG.7.1.R3', 'Okul yarışmalarıyla ilgili duyuruyu yorumlama', '“The winning team will present its project at Friday’s school assembly.” Who will present a project?', 'The winning team', 'All visitors', 'The judges', 'The last team to enter'],
  [7, 'english', 'ENG.7.1.R3', 'Okul yarışmalarıyla ilgili duyuruyu yorumlama', '“Participants may bring notes, but phones must stay in their bags.” Which action follows the rule?', 'Reading written notes', 'Checking a phone', 'Calling a friend', 'Taking a photo with a phone'],
];
reviewedQuestions.push(...extra.map(([grade, course, outcomeCode, outcome, q, a, ...distractors]): Question =>
  ({ grade, course, outcomeCode, outcome, subject: outcome, q, a, distractors, difficulty: 'orta', category: 'context' })));
