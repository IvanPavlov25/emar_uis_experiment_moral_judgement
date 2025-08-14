import type { Handler } from '@netlify/functions';
import { ensureMigrations, query } from './_db';
import { verifyParticipant } from './_auth';

const handler: Handler = async (event) => {
  await ensureMigrations();
  const pid = event.queryStringParameters?.pid;
  const id = verifyParticipant(pid);
  if (!id) return { statusCode: 400, body: 'pid inválido' };

  const mRes = await query(
    'SELECT m.role, m.group_id FROM members m WHERE m.participant_id=$1',
    [id]
  );
  if (mRes.rows.length === 0) {
    return { statusCode: 200, body: JSON.stringify({ status: 'waiting' }) };
  }
  const role = mRes.rows[0].role as string;
  const groupId = mRes.rows[0].group_id as string;

  const rRes = await query('SELECT * FROM results WHERE group_id=$1', [groupId]);
  if (rRes.rows.length > 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'results', role, group_id: groupId, results: rRes.rows[0] }),
    };
  }

  if (role === 'negotiator1' || role === 'negotiator2') {
    const dRes = await query(
      'SELECT choice FROM decisions WHERE group_id=$1 AND participant_id=$2',
      [groupId, id]
    );
    if (dRes.rows.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'decision', role, group_id: groupId }),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'waiting', role, group_id: groupId }),
  };
};

export { handler };
