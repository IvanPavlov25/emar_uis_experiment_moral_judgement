import type { Participant, Pair, DecisionRecord, Outcome, Session } from '../types/models';

type Key = string;

class Table<T extends { id: Key }> {
  private items = new Map<Key, T>();

  async bulkPut(records: T[]): Promise<void> {
    records.forEach(r => this.items.set(r.id, r));
  }

  async put(record: T): Promise<void> {
    this.items.set(record.id, record);
  }

  where<K extends keyof T>(field: K) {
    return {
      equals: (value: T[K]) => ({
        toArray: async () => Array.from(this.items.values()).filter(r => r[field] === value),
      }),
    };
  }

  async get(id: Key): Promise<T | undefined> {
    return this.items.get(id);
  }

  async toArray(): Promise<T[]> {
    return Array.from(this.items.values());
  }
}

export class InMemoryDB {
  participants = new Table<Participant>();
  pairs = new Table<Pair>();
  decisions = new Table<DecisionRecord>();
  outcomes = new Table<Outcome>();
  sessions = new Table<Session>();
}

export const db = new InMemoryDB();
