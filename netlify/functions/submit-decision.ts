import type { Handler } from '@netlify/functions';
import { ensureMigrations, query } from './_db';
import { verifyParticipant } from './_auth';
import Ably from 'ably';
import { v4 as uuidv4 } from 'uuid';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  await ensureMigrations();
  const body = JSON.parse(event.body || '{}');
  const id = verifyParticipant(body.pid);
  const choice = String(body.choice || '').toLowerCase();
  if (!id || !['accept', 'reject'].includes(choice)) {
    return { statusCode: 400, body: 'datos inválidos' };
  }
  const mRes = await query<{ role: string; group_id: string }>(
    'SELECT role, group_id FROM members WHERE participant_id=$1',
    [id]
  );
  if (mRes.rows.length === 0 || !['negotiator1', 'negotiator2'].includes(mRes.rows[0].role)) {
    return { statusCode: 403, body: 'no autorizado' };
  }
  const groupId = mRes.rows[0].group_id as string;
  await query('INSERT INTO decisions(id, group_id, participant_id, choice, decided_at) VALUES ($1,$2,$3,$4,now())', [
    uuidv4(),
    groupId,
    id,
    choice,
  ]);
  const dRes = await query<{ choice: string }>('SELECT choice FROM decisions WHERE group_id=$1', [groupId]);
  if (dRes.rows.length === 2) {
    const acceptCount = dRes.rows.filter(r => r.choice === 'accept').length;
    const pay = acceptCount > 0 ? { n1: 120, n2: 120, victim: 60, observer: 100 } : { n1: 100, n2: 100, victim: 100, observer: 100 };
    await query('INSERT INTO results(group_id, payoff_n1, payoff_n2, payoff_victim, payoff_observer, computed_at) VALUES ($1,$2,$3,$4,$5,now())', [
      groupId,
      pay.n1,
      pay.n2,
      pay.victim,
      pay.observer,
    ]);
    if (process.env.ABLY_API_KEY) {
      const ably = new Ably.Rest(process.env.ABLY_API_KEY);
      const channel = ably.channels.get(`group:${groupId}`);
      channel.publish('results_ready', {});
    }
  }
  return { statusCode: 200, body: 'ok' };
};

export { handler };
