import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import type { Participant, Pair, Session } from '../types/models';
import { createRNG } from '../utils/rng';

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function pairParticipants(session: Session, participants: Participant[]): Promise<Pair[]> {
  const rng = createRNG(session.seed);
  const human = participants.filter(p => p.exp_academic_unit === 1);
  const ing = participants.filter(p => p.exp_academic_unit === 2);
  const other = participants.filter(p => p.exp_academic_unit === 3);

  const pairs: Pair[] = [];

  function createPairs(group: Participant[], type: 'human' | 'ing'): void {
    const shuffled = shuffle(group, rng);
    for (let i = 0; i + 1 < shuffled.length; i += 2) {
      const [a, b] = [shuffled[i], shuffled[i + 1]];
      const tRand = rng();
      let treatment: 'T1' | 'T2' | 'T3' | 'T4';
      if (type === 'human') {
        treatment = tRand < session.params.t1_prob ? 'T1' : 'T2';
      } else {
        treatment = tRand < session.params.t3_prob ? 'T3' : 'T4';
      }
      const victim_group = treatment === 'T1' || treatment === 'T3' ? 'HUMANAS' : 'INGENIERIAS';
      pairs.push({
        id: uuidv4(),
        sessionId: session.id,
        treatment,
        participantAId: a.id,
        participantBId: b.id,
        victim_group,
        round: 1,
      });
    }
  }

  createPairs(human, 'human');
  createPairs(ing, 'ing');

  const leftovers: Participant[] = [];
  if (human.length % 2 === 1) leftovers.push(human[human.length - 1]);
  if (ing.length % 2 === 1) leftovers.push(ing[ing.length - 1]);
  leftovers.push(...other);

  const shuffledLeft = shuffle(leftovers, rng);
  for (let i = 0; i + 1 < shuffledLeft.length; i += 2) {
    const [a, b] = [shuffledLeft[i], shuffledLeft[i + 1]];
    const victim_group = rng() < 0.5 ? 'HUMANAS' : 'INGENIERIAS';
    pairs.push({
      id: uuidv4(),
      sessionId: session.id,
      treatment: 'T5',
      participantAId: a.id,
      participantBId: b.id,
      victim_group,
      round: 1,
    });
  }

  await db.pairs.bulkPut(pairs);
  return pairs;
}
