import type { Handler } from '@netlify/functions';
import { ensureMigrations, query } from './_db';
import { newParticipantId, signParticipant } from './_auth';
import { attemptGrouping } from './_grouping';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  await ensureMigrations();
  const body = JSON.parse(event.body || '{}');
  const faculty = String(body.faculty || '').toLowerCase();
  if (!['ingenierias', 'humanidades', 'neutral'].includes(faculty)) {
    return { statusCode: 400, body: 'faculty requerida' };
  }
  const id = newParticipantId();
  await query('INSERT INTO participants(id, faculty, created_at) VALUES ($1,$2,now())', [id, faculty]);
  await attemptGrouping();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participant_id: signParticipant(id) }),
  };
};

export { handler };
