import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mapAcademicUnit } from '../src/types/models';
import { pairParticipants } from '../src/services/pairing';
import { db } from '../src/services/db';
import { v4 as uuidv4 } from 'uuid';
import type { Participant, Session } from '../src/types/models';

test('map academic unit', () => {
  assert.equal(mapAcademicUnit(1), 1);
  assert.equal(mapAcademicUnit(2), 2);
  assert.equal(mapAcademicUnit(3), 2);
  assert.equal(mapAcademicUnit(0), 3);
  assert.equal(mapAcademicUnit(4), 3);
});

test('pairing produces treatments', async () => {
  const session: Session = {
    id: uuidv4(),
    name: 's1',
    seed: 'seed',
    createdAt: Date.now(),
    params: {
      t1_prob: 1,
      t2_prob: 0,
      t3_prob: 1,
      t4_prob: 0,
      t5_enabled: true,
      victim_selection: 'random',
      payoffs: {
        reject_all: [100, 100, 100],
        accept_any: [120, 120, 60],
      },
    },
  };

  const participants: Participant[] = [
    { id: uuidv4(), sessionId: session.id, academic_unit: 1, exp_academic_unit: 1, createdAt: 0 },
    { id: uuidv4(), sessionId: session.id, academic_unit: 1, exp_academic_unit: 1, createdAt: 0 },
    { id: uuidv4(), sessionId: session.id, academic_unit: 2, exp_academic_unit: 2, createdAt: 0 },
    { id: uuidv4(), sessionId: session.id, academic_unit: 2, exp_academic_unit: 2, createdAt: 0 },
  ];

  await db.participants.bulkPut(participants);
  const pairs = await pairParticipants(session, participants);
  assert.equal(pairs.length, 2);
  assert.equal(pairs[0].treatment, 'T1');
  assert.equal(pairs[1].treatment, 'T3');
});
