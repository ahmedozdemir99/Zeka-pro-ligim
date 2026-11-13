import { competitionQuestions, correctAnswer, defaults, validSettings } from '../src/utils/competition.ts';
import { studentAttempt } from '../src/utils/student.ts';

const lifetime = 2 * 60 * 60 * 1000;
const codePattern = /^\d{6}$/;
const roomPattern = /^[0-9a-f-]{36}$/;

function reply(data, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

function failure(error, status = 409) {
  return reply({ error }, status);
}

async function hashToken(token) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
}

async function newPlayer(name) {
  const token = crypto.randomUUID();
  return { token, player: { name, tokenHash: await hashToken(token), ready: false, score: 0, correct: 0 } };
}

function addAttempt(room, slot, answer) {
  const player = room.players[slot];
  if (!player) return;
  player.attempts ??= [];
  player.attempts.push(studentAttempt(room.questions[room.current], answer));
}
function nextQuestion(room, time) {
  room.current++;
  room.submitted = {};
  room.startedAt = time;
  if (room.current >= room.questions.length) room.status = 'finished';
}
function deadline(room) {
  return room.status === 'playing' && room.settings?.seconds
    ? room.startedAt + room.settings.seconds * 1000 : undefined;
}
function expireQuestions(room, now) {
  let end = deadline(room);
  if (end === undefined || end > now) return false;
  while (end !== undefined && end <= now) {
    for (const slot of [0, 1]) if (!room.submitted[slot]) addAttempt(room, slot, '');
    nextQuestion(room, end);
    end = deadline(room);
  }
  return true;
}
function saveRoom(db, row, room, now) {
  return db.prepare('UPDATE duel_rooms SET state = ?, version = version + 1, expires_at = ? WHERE id = ? AND version = ?')
    .bind(JSON.stringify(room), now + lifetime, row.id, row.version).run();
}
function publicRoom(row, room, slot, now) {
  const question = room.questions[room.current];
  return {
    code: row.code, grade: room.grade, status: room.status, current: room.current,
    total: room.questions.length, settings: room.settings, serverNow: now, deadline: deadline(room),
    attempts: room.status === 'finished' ? room.players[slot].attempts ?? [] : undefined,
    players: room.players.flatMap((player, index) => player ? [{
      slot: index, name: player.name, ready: player.ready,
      me: index === slot, score: player.score, correct: player.correct,
    }] : []),
    submitted: room.submitted,
    forfeitWinner: room.forfeitWinner,
    question: room.status === 'playing' && question ? {
      q: question.q, subject: question.subject, category: question.category,
      course: question.course, outcomeCode: question.outcomeCode, options: question.options, figure: question.figure,
    } : undefined,
  };
}

export async function handleDuel(request, db) {
  const url = new URL(request.url);
  const action = url.pathname.slice('/duel/'.length);
  if (!db) return failure('SERVICE_UNAVAILABLE', 503);
  const now = Date.now();

  if (request.method === 'GET' && roomPattern.test(action)) {
    const token = request.headers.get('X-Player-Token') || '';
    const hash = await hashToken(token.slice(0, 100));
    for (let attempt = 0; attempt < 5; attempt++) {
      const row = await db.prepare('SELECT id, code, state, version FROM duel_rooms WHERE id = ? AND expires_at > ?').bind(action, now).first();
      if (!row) return failure('NOT_FOUND', 404);
      const room = JSON.parse(row.state);
      const slot = room.players.findIndex(player => player?.tokenHash === hash);
      if (slot < 0 || room.status === 'closed') return failure('UNAUTHORIZED', 401);
      if (expireQuestions(room, now) && !(await saveRoom(db, row, room, now)).meta.changes) continue;
      return reply(publicRoom(row, room, slot, now));
    }
    return failure('BUSY', 503);
  }
  if (request.method !== 'POST') return failure('NOT_FOUND', 404);
  if (request.headers.has('Origin') && request.headers.get('Origin') !== url.origin) return failure('UNAUTHORIZED', 403);

  let input;
  try {
    const text = await request.text();
    if (text.length > 2048) return failure('INVALID_BODY', 413);
    input = JSON.parse(text);
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error();
  } catch {
    return failure('INVALID_BODY', 400);
  }

  const joining = action === 'join';
  const creating = action === 'create';
  let entrant;
  if (joining || creating) {
    const name = typeof input.name === 'string' ? input.name.trim().replace(/\s+/g, ' ') : '';
    if (name.length < 2 || name.length > 24) return failure('INVALID_NAME', 400);
    entrant = await newPlayer(name);
  }

  if (creating) {
    const grade = Number(input.grade);
    if (![5, 6, 7, 8].includes(grade)) return failure('INVALID_GRADE', 400);
    const settings = input.settings ?? defaults;
    if (!validSettings(settings)) return failure('INVALID_SETTINGS', 400);
    const questions = competitionQuestions(String(grade), 5, settings);
    if (!questions.length) return failure('NO_QUESTIONS', 400);
    const id = crypto.randomUUID();
    const room = { grade, settings, status: 'waiting', players: [entrant.player], questions, current: 0, submitted: {} };
    await db.prepare('DELETE FROM duel_rooms WHERE expires_at <= ?').bind(now).run();
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = String(100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000);
      const inserted = await db.prepare('INSERT OR IGNORE INTO duel_rooms (id, code, state, expires_at) VALUES (?, ?, ?, ?)')
        .bind(id, code, JSON.stringify(room), now + lifetime).run();
      if (inserted.meta.changes) return reply({ code, duelId: id, playerToken: entrant.token }, 201);
    }
    return failure('BUSY', 503);
  }

  const lookup = joining ? input.code : input.duelId;
  if (typeof lookup !== 'string' || !(joining ? codePattern : roomPattern).test(lookup)) return failure('INVALID_BODY', 400);
  const token = request.headers.get('X-Player-Token') || '';
  const hash = joining ? null : await hashToken(token.slice(0, 100));
  const query = joining
    ? 'SELECT id, code, state, version FROM duel_rooms WHERE code = ? AND expires_at > ?'
    : 'SELECT id, code, state, version FROM duel_rooms WHERE id = ? AND expires_at > ?';

  for (let attempt = 0; attempt < 5; attempt++) {
    const row = await db.prepare(query).bind(lookup, now).first();
    if (!row) return failure(joining ? 'CODE_NOT_FOUND' : 'NOT_FOUND', 404);
    const room = JSON.parse(row.state);
    const slot = joining ? 1 : room.players.findIndex(player => player?.tokenHash === hash);
    if (room.status === 'closed' || slot < 0) return failure(joining ? 'CODE_NOT_FOUND' : 'UNAUTHORIZED', joining ? 404 : 401);

    if (!joining && expireQuestions(room, now)) {
      if (!(await saveRoom(db, row, room, now)).meta.changes) continue;
      if (action === 'answer') return failure('QUESTION_CHANGED');
      continue;
    }
    switch (action) {
      case 'join':
        if (room.status !== 'waiting') return failure('MATCH_ALREADY_STARTED');
        if (room.players[1]) return failure('MATCH_FULL');
        room.players[1] = entrant.player;
        break;
      case 'ready':
        if (room.status !== 'waiting') return failure('NOT_WAITING');
        room.players[slot].ready = input.ready === true;
        break;
      case 'start':
        if (slot !== 0) return failure('HOST_ONLY', 403);
        if (room.status !== 'waiting') return failure('NOT_WAITING');
        if (!room.players[0]?.ready || !room.players[1]?.ready) return failure('BOTH_NOT_READY');
        room.status = 'playing';
        room.startedAt = now;
        break;
      case 'answer': {
        if (room.status !== 'playing') return failure('NOT_PLAYING');
        if (input.questionIndex !== room.current) return failure('QUESTION_CHANGED');
        if (room.submitted[slot]) return failure('ALREADY_ANSWERED');
        if (typeof input.answer !== 'string' || !input.answer.trim() || input.answer.length > 160) return failure('INVALID_ANSWER', 400);
        const question = room.questions[room.current];
        if (question.options && !question.options.includes(input.answer.trim())) return failure('INVALID_ANSWER', 400);
        addAttempt(room, slot, input.answer);
        if (correctAnswer(question, input.answer)) {
          room.players[slot].correct++;
          room.players[slot].score += now - room.startedAt <= 10000 ? 130 : 100;
        }
        room.submitted[slot] = true;
        if (room.submitted[0] && room.submitted[1]) nextQuestion(room, now);
        break;
      }
      case 'leave':
        if (room.status === 'waiting' && slot === 1) {
          room.players.pop();
          room.players[0].ready = false;
        } else if (room.status === 'playing') {
          room.status = 'finished';
          room.forfeitWinner = 1 - slot;
        } else if (room.status === 'waiting') {
          room.status = 'closed';
        }
        break;
      default:
        return failure('NOT_FOUND', 404);
    }

    const updated = await saveRoom(db, row, room, now);
    if (!updated.meta.changes) continue;
    return joining
      ? reply({ code: row.code, duelId: row.id, playerToken: entrant.token })
      : reply({ ok: true });
  }
  return failure('BUSY', 503);
}
