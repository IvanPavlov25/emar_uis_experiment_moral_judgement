declare module 'pg' {
  export interface QueryResultRow {
    [column: string]: unknown;
  }

  export interface QueryResult<T extends QueryResultRow = QueryResultRow> {
    rows: T[];
  }

    export class Pool {
      constructor(config?: unknown);
      query<T extends QueryResultRow = QueryResultRow>(
        text: string,
        params?: unknown[],
      ): Promise<QueryResult<T>>;
    }
}
