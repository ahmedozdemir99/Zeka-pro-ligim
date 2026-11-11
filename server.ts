import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes for AI capabilities
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { question, answer, subject, grade } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY bulunamadı. Lütfen Ayarlar > Secrets bölümünü kontrol edin.' });
    }

    const prompt = `Sen Zekâ Akademisi'nin neşeli, uzman ve motive edici ortaokul matematik öğretmenisin.
Aşağıdaki soru için ${grade ? grade + '. sınıf' : 'ortaokul'} seviyesinde bir öğrenciye adım adım, anlaşılır ve ilgi çekici bir çözüm açıklaması yaz.

Konu: ${subject || 'Matematik'}
Soru: ${question}
Doğru Cevap: ${answer}

Açıklama Kuralları:
1. Türkçe dilinde, dostane ve net bir üslup kullan.
2. Adımları maddedeler halinde açıkla.
3. En sonda "💡 Püf Nokta" başlığıyla bu tarz sorularda dikkat edilecek mantık ipucunu ekle.
4. Çözümü tam ve doğru şekilde bitir.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('AI Explain error:', error);
    res.status(500).json({ error: error.message || 'AI yanıtı üretilirken bir hata oluştu.' });
  }
});

app.post('/api/ai/hint', async (req, res) => {
  try {
    const { gameType, puzzleState } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY tanımlı değil.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Öğrenci zekâ oyunu (${gameType}) oynuyor. Doğrudan cevabı söylemeden 1-2 cümlelik stratejik mantık ipucu ver. 
Oyun Durumu/Bilgisi: ${JSON.stringify(puzzleState)}`,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('AI Hint error:', error);
    res.status(500).json({ error: 'İpucu alınamadı.' });
  }
});

app.post('/api/ai/generate-question', async (req, res) => {
  try {
    const { grade, topic, difficulty } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY tanımlı değil.' });
    }

    const prompt = `Ortaokul ${grade || 7}. sınıf ${topic || 'Matematik ve Mantık'} konusu için MEB/LGS beceri temelli, ${difficulty || 'orta'} zorlukta yeni özgün bir soru üret.
Lütfen yanıtını SADECE aşağıdaki geçerli JSON formatında döndür:
{
  "q": "Soru metni (Gerekiyorsa basit sayısal veriler ve net senaryo içersin)",
  "a": "Kısa net cevap (örn: 36 veya 3/4 veya 150)",
  "subject": "Konu Başlığı",
  "explanation": "Detaylı adım adım çözüm açıklaması"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('AI Generate Question error:', error);
    res.status(500).json({ error: 'Özgün soru üretilemedi.' });
  }
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(
          url,
          `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0b1128" />
    <title>Zekâ Akademisi • Pro Lig & Zekâ Oyunları</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#0b1128] text-[#f7f8ff]">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
        );
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 Zekâ Akademisi sunucusu http://localhost:${PORT} üzerinde çalışıyor.`);
  });
}

startServer();
