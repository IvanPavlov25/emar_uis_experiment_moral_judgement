import type { AcademicUnitRaw } from '../types/models';
import { toExpGroup } from '../types/models';

export async function join(academicUnit: AcademicUnitRaw, studentCode: string) {
  const pid = crypto.randomUUID();
  localStorage.setItem('participant_id', pid);
  localStorage.setItem('academic_unit', academicUnit.toString());
  localStorage.setItem('student_code', studentCode);
  const exp = toExpGroup(academicUnit);
  localStorage.setItem('exp_academic_unit', exp.toString());
  localStorage.setItem('status', 'decision');
  localStorage.setItem('role', 'negotiator1');
  return { participant_id: pid };
}

export type GroupResults = {
  payoff_n1: number;
  payoff_n2: number;
  payoff_victim: number;
  payoff_observer: number;
};

export interface SavedRecord extends GroupResults {
  code: string;
  academic_unit: string;
  decision: string;
  rating?: number;
}

export type GroupStatusResponse =
  | { status: 'results'; results: GroupResults; role: string; group_id?: string }
  | { status: string; group_id?: string };

export async function groupStatus(pid: string): Promise<GroupStatusResponse> {
  void pid;
  const status = localStorage.getItem('status') || 'decision';
  const group_id = localStorage.getItem('group_id') || undefined;
  if (status === 'results') {
    const results = JSON.parse(localStorage.getItem('results') || '{}') as GroupResults;
    const role = localStorage.getItem('role') || 'negotiator1';
    return { status: 'results', results, role, group_id };
  }
  return { status, group_id };
}

export async function submitDecision(pid: string, choice: string) {
  void pid;
  localStorage.setItem('decision', choice);
  const results = {
    payoff_n1: 10,
    payoff_n2: 10,
    payoff_victim: 5,
    payoff_observer: 2,
  };
  localStorage.setItem('results', JSON.stringify(results));
  localStorage.setItem('status', 'results');
}

export async function submitRating(pid: string, rating: number) {
  void pid;
  localStorage.setItem('rating', rating.toString());
}

export function finalizeRecord() {
  const code = localStorage.getItem('student_code');
  if (!code) return;
  const record: SavedRecord = {
    code,
    academic_unit: localStorage.getItem('academic_unit') || '',
    decision: localStorage.getItem('decision') || '',
    rating: localStorage.getItem('rating')
      ? Number(localStorage.getItem('rating'))
      : undefined,
    ...(JSON.parse(localStorage.getItem('results') || '{}') as GroupResults),
  };
  const records = JSON.parse(localStorage.getItem('records') || '[]') as SavedRecord[];
  const idx = records.findIndex((r) => r.code === code);
  if (idx >= 0) records[idx] = record;
  else records.push(record);
  localStorage.setItem('records', JSON.stringify(records));
}

export function getRecords(): SavedRecord[] {
  return JSON.parse(localStorage.getItem('records') || '[]') as SavedRecord[];
}
