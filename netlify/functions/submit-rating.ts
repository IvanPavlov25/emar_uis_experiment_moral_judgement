import type { Handler } from '@netlify/functions';
import { ensureMigrations, query } from './_db';
import { verifyParticipant } from './_auth';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  await ensureMigrations();
  const body = JSON.parse(event.body || '{}');
  const id = verifyParticipant(body.pid);
  const rating = Number(body.rating);
  if (!id || isNaN(rating) || rating < -9 || rating > 9) {
    return { statusCode: 400, body: 'datos inválidos' };
  }
  const mRes = await query('SELECT role, group_id FROM members WHERE participant_id=$1', [id]);
  if (mRes.rows.length === 0 || !['victim', 'observer'].includes(mRes.rows[0].role)) {
    return { statusCode: 403, body: 'no autorizado' };
  }
  const groupId = mRes.rows[0].group_id as string;
  await query('INSERT INTO ratings(id, group_id, participant_id, moral_rating, rated_at) VALUES ($1,$2,$3,$4,now())', [
    require('uuid').v4(),
    groupId,
    id,
    rating,
  ]);
  return { statusCode: 200, body: 'ok' };
};

export { handler };
