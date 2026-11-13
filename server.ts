import express from 'express';
import { handleCoach } from './server/coach.mjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

app.all('/api/ai/:operation', async (req, res) => {
  const origin = req.get('origin');
  const originUrl = origin && URL.canParse(origin) ? new URL(origin) : undefined;
  const protocol = originUrl && originUrl.host === req.get('host') ? originUrl.protocol : req.protocol + ':';
  const url = new URL(req.originalUrl, `${protocol}//${req.get('host')}`);
  const headers = new Headers();
  if (origin) headers.set('Origin', origin);
  const body = req.method === 'POST' ? JSON.stringify(req.body ?? {}) : undefined;
  const response = await handleCoach(new Request(url, { method: req.method, headers, body }), process.env);
  res.status(response.status).set(Object.fromEntries(response.headers)).send(await response.text());
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
