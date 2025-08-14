import { query } from './_db';
import { v4 as uuidv4 } from 'uuid';
import Ably from 'ably';

type Participant = { id: string; faculty: string };

const TREATMENTS = [
  { name: 'INGROUP_HUM', weight: 0.2 },
  { name: 'OUTGROUP_HUM', weight: 0.2 },
  { name: 'INGROUP_ING', weight: 0.2 },
  { name: 'OUTGROUP_ING', weight: 0.2 },
  { name: 'CONTROL', weight: 0.2 },
];

function pickTreatment(): string {
  const r = Math.random();
  let acc = 0;
  for (const t of TREATMENTS) {
    acc += t.weight;
    if (r < acc) return t.name;
  }
  return TREATMENTS[0].name;
}

export async function attemptGrouping() {
  const res = await query<Participant>(`SELECT p.id, p.faculty FROM participants p
    LEFT JOIN members m ON p.id = m.participant_id
    WHERE m.participant_id IS NULL
    ORDER BY p.joined_at ASC`);
  const waiting = res.rows;
  while (waiting.length >= 4) {
    const groupId = uuidv4();
    const treatment = pickTreatment();

    const take = (index: number) => waiting.splice(index, 1)[0];

    // negotiators: prefer same faculty
    let n1: Participant | null = null;
    let n2: Participant | null = null;
    outer: for (let i = 0; i < waiting.length; i++) {
      for (let j = i + 1; j < waiting.length; j++) {
        if (waiting[i].faculty === waiting[j].faculty) {
          n1 = take(j);
          n2 = take(i);
          break outer;
        }
      }
    }
    if (!n1 || !n2) {
      n1 = take(0);
      n2 = take(0);
    }

    // victim selection
    let victimIndex = waiting.findIndex(p =>
      treatment.startsWith('OUTGROUP')
        ? p.faculty !== n1!.faculty
        : p.faculty === n1!.faculty
    );
    if (victimIndex === -1) victimIndex = 0;
    const victim = take(victimIndex);

    // observer selection
    let observerIndex = waiting.findIndex(p => p.faculty === 'neutral');
    let observer_is_neutral = true;
    if (observerIndex === -1) {
      observerIndex = 0;
      observer_is_neutral = false;
    }
    const observer = take(observerIndex);

    await query('INSERT INTO groups(id, treatment, created_at) VALUES ($1,$2,now())', [
      groupId,
      treatment,
    ]);

    const members = [
      { p: n1, role: 'negotiator1' },
      { p: n2, role: 'negotiator2' },
      { p: victim, role: 'victim' },
      { p: observer, role: 'observer', observer_is_neutral },
    ];
    for (const m of members) {
      await query(
        'INSERT INTO members(id, group_id, participant_id, role, observer_is_neutral) VALUES ($1,$2,$3,$4,$5)',
        [uuidv4(), groupId, m.p.id, m.role, m.observer_is_neutral ?? null]
      );
    }

    if (process.env.ABLY_API_KEY) {
      const ably = new Ably.Rest(process.env.ABLY_API_KEY);
      const channel = ably.channels.get(`group:${groupId}`);
      channel.publish('grouped', {});
    }
  }
}
