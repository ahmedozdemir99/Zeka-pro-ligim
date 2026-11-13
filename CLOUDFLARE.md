# Zekâ Pro Ligim’i Cloudflare’da yayımlama

## 1. Worker ve veritabanı

Node.js 22.12+ kurulu bir bilgisayarda proje klasörünü açın.

```sh
npm ci
npx wrangler login
npx wrangler d1 create zeka-pro-ligim --binding DB --update-config
```

`wrangler.jsonc` dosyasındaki `database_id` alanına D1 veritabanının gerçek UUID’si yazılmış olmalı. Komut mevcut alanı değiştirmezse, Cloudflare panelindeki D1 veritabanı kimliğini bu alana yazın. Ardından:

```sh
npx wrangler d1 migrations apply DB --remote
npx wrangler deploy
```

GitHub bağlantısıyla dağıtım yapacaksanız önce yukarıdaki D1 bağlama ve migration adımlarını tamamlayın. Cloudflare Workers Builds’te proje kökü deponun kökü, dağıtım komutu `npx wrangler deploy` olur. Wrangler, `npm run build:cloudflare` komutunu çalıştırır. Gerekiyorsa Worker panelinden `GEMINI_API_KEY` adlı gizli değişkeni ekleyin. Koç, anahtar olmadan da yerleşik açıklamaları kullanır.

Sites ve Cloudflare farklı veritabanları kullanır. Bu kurulum Cloudflare’da boş bir veritabanı oluşturur. Eski Sites profilleri, maç sonuçları ve odalar taşınmaz.

## 2. Öğrenci girişi

1. Worker panelinde **Access** sekmesinde üretim Worker’ını koruyun veya **Zero Trust → Access → Applications** altında öğrencilerle paylaşacağınız tam adres için **Self-hosted** uygulama ekleyin.
2. **One-time PIN** girişini etkinleştirin. **Allow** kuralına kendi e-posta adresinizi ve erişecek öğrencilerin okul e-posta adreslerini ekleyin. Kural, yalnızca izin verdiğiniz hesapları kapsasın.
3. Paylaşacağınız adresi gizli sekmede açın. E-posta koduyla giriş yapın ve **Profilim** ekranından bir deneme kaydı oluşturun. İkinci izinli hesapla giriş yapıp ilk hesabın profilinin ve maç geçmişinin görünmediğini kontrol edin.

Worker, öğrenci kimliğini Cloudflare Access’in doğruladığı oturumdan alır. Access kurulmadan ana uygulama 401 yanıtı verir. `/healthz` adresi bağlantı kontrolü için kullanılır ve kişisel veri içermez.

## 3. DNS ve Wi-Fi testi

- Alan adınız varsa Cloudflare panelinde DNS durumu **Active** olan alan adının ilk düzey bir alt alan adını seçin (örneğin `lig.okulunuz.com`). Worker’da **Settings → Domains & Routes → Add → Custom Domain** üzerinden ekleyin. Cloudflare DNS kaydını ve HTTPS sertifikasını yönetir. Ayrı bir A veya CNAME kaydı eklemeniz gerekmez.
- Alan adınız yoksa ilk deneme için Worker’ın `workers.dev` adresini kullanın. Bu adres, okul ağı tarafından filtrelenirse okulun ağ yöneticisiyle görüşün veya kendi alan adınızla tekrar deneyin.
- Alan adını Cloudflare DNS’e yeni taşıyorsanız önce mevcut DNS kayıtlarını karşılaştırın. Registrar’daki nameserver’ların Cloudflare’ın verdiği değerlerle eşleştiğini doğrulayın. Eski DNSSEC DS kaydı varsa Cloudflare’ın taşıma yönergesini izleyin.
- Öğrencilere **tek bir HTTPS adresi** gönderin. Önce Wi-Fi, sonra mobil veri üzerinden, aynı adresi gizli sekmede açın. İki ayrı cihazla bir oda kodu oluşturup katılın. Aynı bağlantının okul Wi-Fi’sında da açıldığını doğrulayın.
- `DNS_PROBE_FINISHED_NXDOMAIN` veya `ERR_NAME_NOT_RESOLVED` görülürse Cloudflare’da alan adı ve DNS durumuna bakın. Sadece okul ağında görülüyorsa ağ yöneticisine açılmayan tam adresi iletin. `401` veya Access giriş ekranı görülüyorsa bağlantı Worker’a ulaşmıştır. Bu durumda öğrenci e-postası ve Access kuralı kontrol edilir.

Kaynaklar: [Worker özel alan adları](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [Cloudflare Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/), [DNS taşıma sorunları](https://developers.cloudflare.com/dns/zone-setups/full-setup/troubleshooting/).
