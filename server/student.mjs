import { crests, resultLabels } from '../src/utils/student.ts';
import { courses } from '../src/utils/competition.ts';

const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'private, no-store' } });
const grade = value => ['5', '6', '7', '8'].includes(value);
const count = value => Number.isInteger(value) && value >= 0 && value <= 12;
function profileOk(p) {
  return typeof p?.name === 'string' && p.name.trim().length >= 2 && p.name.length <= 40 && grade(p.grade) &&
    typeof p.branch === 'string' && /^[A-ZÇĞİÖŞÜ0-9-]{0,8}$/u.test(p.branch) && Object.hasOwn(crests, p.crest) &&
    typeof p.photo === 'string' && (p.photo === '' || (p.photo.length < 100000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(p.photo)));
}
function resultOk(r) {
  return typeof r?.id === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(r.id) && Object.hasOwn(resultLabels, r.kind) &&
    count(r.total) && r.total > 0 && count(r.scored) && r.scored <= r.total &&
    (r.conceded === undefined || (count(r.conceded) && r.conceded <= r.total)) &&
    (r.points === undefined || (Number.isInteger(r.points) && r.points >= 0 && r.points <= 1560)) &&
    Array.isArray(r.attempts) && r.attempts.length <= r.total && r.attempts.every(a =>
      grade(a?.grade) && courses.includes(a.course) && typeof a.outcome === 'string' && a.outcome.length > 0 &&
      a.outcome.length <= 160 && (a.outcomeCode === undefined || (typeof a.outcomeCode === 'string' && a.outcomeCode.length <= 30)) && ['correct', 'wrong', 'blank'].includes(a.status));
}
export async function handleStudent(request, db, user) {
  if (!user) return json({ error: 'SIGN_IN_REQUIRED' }, 401);
  if (!db) return json({ error: 'UNAVAILABLE' }, 503);
  const url = new URL(request.url);
  try {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(user));
    const accountKey = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
    if (request.method === 'GET' && url.pathname === '/api/student') {
      const [profile, history] = await Promise.all([
        db.prepare('SELECT profile FROM student_profiles WHERE user_id = ?').bind(user).first(),
        db.prepare('SELECT result FROM student_results WHERE user_id = ? ORDER BY date DESC').bind(user).all(),
      ]);
      return json({ accountKey, profile: profile ? JSON.parse(profile.profile) : null, results: history.results.map(row => JSON.parse(row.result)) });
    }
    if (request.method !== 'POST') return json({ error: 'NOT_FOUND' }, 404);
    if (request.headers.get('Origin') !== url.origin) return json({ error: 'INVALID_ORIGIN' }, 403);
    if (request.headers.get('X-Student-Account') !== accountKey) return json({ error: 'ACCOUNT_CHANGED' }, 409);
    const raw = await request.text();
    if (raw.length > 105000) return json({ error: 'INVALID_DATA' }, 413);
    const data = JSON.parse(raw);
    if (url.pathname === '/api/student/profile' && profileOk(data)) {
      const { name, grade, branch, crest, photo } = data;
      const profile = { name: name.trim(), grade, branch, crest, photo };
      await db.prepare('INSERT INTO student_profiles (user_id, profile) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET profile=excluded.profile')
        .bind(user, JSON.stringify(profile)).run();
      return json({ profile });
    }
    if (url.pathname === '/api/student/result' && resultOk(data)) {
      const hasProfile = await db.prepare('SELECT 1 FROM student_profiles WHERE user_id = ?').bind(user).first();
      if (!hasProfile) return json({ error: 'PROFILE_REQUIRED' }, 409);
      const { id, kind, scored, conceded, points, total, attempts } = data;
      const date = new Date().toISOString();
      await db.prepare('INSERT OR IGNORE INTO student_results (user_id, id, date, result) VALUES (?, ?, ?, ?)')
        .bind(user, id, date, JSON.stringify({ id, kind, scored, conceded, points, total, attempts, date })).run();
      return json({ ok: true });
    }
    return json({ error: 'INVALID_DATA' }, 400);
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: 'INVALID_DATA' }, 400);
    console.error('Student storage failed', error);
    return json({ error: 'UNAVAILABLE' }, 503);
  }
}
