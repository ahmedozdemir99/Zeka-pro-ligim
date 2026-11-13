import { handleDuel } from './duel.mjs';
import { handleStudent } from './student.mjs';
import { handleCoach } from './coach.mjs';
import { assets } from './sites-assets.mjs';

export function createWorker(getUser, requireLogin = false) {
  return { async fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    if (pathname === '/healthz' && request.method === 'GET') {
      return new Response('Zekâ Pro Ligim', { headers: { 'Cache-Control': 'no-store' } });
    }
    const user = requireLogin || pathname.startsWith('/api/student') ? await getUser(request, context) : undefined;
    if (requireLogin && !user) return new Response('Bu uygulama için Cloudflare Access ile giriş gerekir.', {
      status: 401, headers: { 'Cache-Control': 'private, no-store' },
    });
    if (pathname.startsWith('/duel/')) return handleDuel(request, env.DB);
    if (pathname === '/api/student' || pathname.startsWith('/api/student/')) return handleStudent(request, env.DB, user);
    if (pathname.startsWith('/api/ai/')) return handleCoach(request, env);
    if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405 });
    const asset = assets[pathname === '/' ? '/index.html' : pathname];
    if (!asset) return new Response('Sayfa bulunamadı.', { status: 404 });
    const content = /^(image|font)\//.test(asset.mime) ? Uint8Array.from(atob(asset.content), char => char.charCodeAt(0)) : asset.content;
    return new Response(request.method === 'HEAD' ? null : content, {
      headers: {
        'Content-Type': asset.mime,
        'Cache-Control': /^\/assets\/[^/]+-[\w-]+\.(js|css)$/.test(pathname) ? 'public, max-age=31536000, immutable' : 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } };
}

export default createWorker(request => request.headers.get('oai-authenticated-user-id'));
