import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import type { Decision, DecisionRecord, Outcome, Pair, Session } from '../types/models';

export async function recordDecision(
  session: Session,
  pair: Pair,
  participantId: string,
  decision: Decision
): Promise<void> {
  const record: DecisionRecord = {
    id: uuidv4(),
    sessionId: session.id,
    pairId: pair.id,
    participantId,
    decision,
    decidedAt: Date.now(),
  };
  await db.decisions.put(record);

  const decisions = await db.decisions.where('pairId').equals(pair.id).toArray();
  const accepts = decisions.filter(d => d.decision === 'ACCEPT').length;
  const implemented = accepts > 0;
  if (decisions.length === 2) {
    const outcome: Outcome = {
      id: uuidv4(),
      sessionId: session.id,
      pairId: pair.id,
      payoffA: implemented ? session.params.payoffs.accept_any[0] : session.params.payoffs.reject_all[0],
      payoffB: implemented ? session.params.payoffs.accept_any[1] : session.params.payoffs.reject_all[1],
      payoffVictim: implemented ? session.params.payoffs.accept_any[2] : session.params.payoffs.reject_all[2],
      implemented,
    };
    await db.outcomes.put(outcome);
  }
}
