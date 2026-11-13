import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { build } from 'esbuild';

const cloudflare = process.argv.includes('--cloudflare');
const dist = new URL('../dist/', import.meta.url);
const mimeFor = (name) => name.endsWith('.woff2') ? 'font/woff2' : mimeTypes[extname(name)];
const mimeTypes = {
  '.png': 'image/png',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};
const assets = Object.create(null);
for (const entry of await readdir(dist, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const mime = mimeFor(entry.name);
  if (!mime) continue;
  const path = join(entry.parentPath, entry.name);
  const route = '/' + path.slice(new URL(dist).pathname.length);
  assets[route] = { mime, content: await readFile(path, /^(image|font)\//.test(mime) ? 'base64' : 'utf8') };
}
if (!assets['/index.html']) throw new Error('Vite index.html bulunamadı.');
const virtualModule = {
  name: 'sites-assets',
  setup(builder) {
    builder.onResolve({ filter: /^\.\/sites-assets\.mjs$/ }, () => ({ path: 'assets', namespace: 'sites' }));
    builder.onLoad({ filter: /.*/, namespace: 'sites' }, () => ({
      contents: `export const assets = Object.assign(Object.create(null), ${JSON.stringify(assets)});`,
      loader: 'js',
    }));
  },
};
await build({
  entryPoints: [cloudflare ? 'server/cloudflare.mjs' : 'server/sites.mjs'],
  outfile: cloudflare ? 'dist/cloudflare/worker.mjs' : 'dist/server/index.js',
  bundle: true,
  format: 'esm',
  minify: true,
  plugins: [virtualModule],
});
if (!cloudflare) {
  await mkdir(new URL('.openai/', dist), { recursive: true });
  await writeFile(new URL('.openai/hosting.json', dist), await readFile(new URL('../.openai/hosting.json', import.meta.url)));
}
