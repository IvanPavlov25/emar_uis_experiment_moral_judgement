export type AcademicUnitRaw = 0 | 1 | 2 | 3 | 4;
export type ExpAcademicUnit = 1 | 2 | 3; // 1=Humanas, 2=Ingenierías, 3=Otras
export type Treatment = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
export type Decision = 'ACCEPT' | 'REJECT';

export interface Participant {
  id: string;
  sessionId: string;
  academic_unit: AcademicUnitRaw;
  exp_academic_unit: ExpAcademicUnit;
  createdAt: number;
}

export interface Pair {
  id: string;
  sessionId: string;
  treatment: Treatment;
  participantAId: string;
  participantBId: string;
  victim_group: 'HUMANAS' | 'INGENIERIAS';
  victim_id?: string;
  round: number;
}

export interface DecisionRecord {
  id: string;
  sessionId: string;
  pairId: string;
  participantId: string;
  decision: Decision;
  decidedAt: number;
}

export interface Outcome {
  id: string;
  sessionId: string;
  pairId: string;
  payoffA: number;
  payoffB: number;
  payoffVictim: number;
  implemented: boolean;
}

export interface SessionParams {
  t1_prob: number;
  t2_prob: number;
  t3_prob: number;
  t4_prob: number;
  t5_enabled: boolean;
  victim_selection: 'random' | 'none';
  payoffs: {
    reject_all: [number, number, number];
    accept_any: [number, number, number];
  };
}

export interface Session {
  id: string;
  name: string;
  seed: string;
  createdAt: number;
  params: SessionParams;
}

// Helper for mapping academic_unit to experimental groups
export function mapAcademicUnit(unit: AcademicUnitRaw): ExpAcademicUnit {
  if (unit === 1) return 1;
  if (unit === 2 || unit === 3) return 2;
  return 3; // Ciencias (0) or Salud (4)
}
