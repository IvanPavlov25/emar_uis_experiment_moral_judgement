import type { Handler } from '@netlify/functions';
import { ensureMigrations, query } from './_db';

const handler: Handler = async (event) => {
  await ensureMigrations();
  const auth = event.headers['authorization'];
  if (auth !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return { statusCode: 401, body: 'unauthorized' };
  }
  const res = await query(`SELECT p.id as participant_id, g.id as group_id, m.role, p.faculty, g.treatment, m.observer_is_neutral,
    d.choice, r.moral_rating, res.payoff_n1, res.payoff_n2, res.payoff_victim, res.payoff_observer,
    p.created_at, g.created_at as group_created_at, d.decided_at, r.rated_at, res.computed_at
    FROM participants p
    LEFT JOIN members m ON m.participant_id=p.id
    LEFT JOIN groups g ON g.id=m.group_id
    LEFT JOIN decisions d ON d.participant_id=p.id AND d.group_id=g.id
    LEFT JOIN ratings r ON r.participant_id=p.id AND r.group_id=g.id
    LEFT JOIN results res ON res.group_id=g.id`);
  const headers = [
    'participant_id','group_id','role','faculty','treatment','observer_is_neutral','choice','moral_rating','payoff_n1','payoff_n2','payoff_victim','payoff_observer','created_at','group_created_at','decided_at','rated_at','computed_at'
  ];
  const rows = res.rows.map((r: Record<string, unknown>) =>
    headers.map(h => String(r[h] ?? '')).join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="export.csv"'
    },
    body: csv,
  };
};

export { handler };
