import React, { useEffect, useState } from 'react';
import { getRecords, SavedRecord } from '../lib/api';

function downloadCsv(records: SavedRecord[], filename: string) {
  const headers: (keyof SavedRecord)[] = [
    'code',
    'academic_unit',
    'decision',
    'rating',
    'payoff_n1',
    'payoff_n2',
    'payoff_victim',
    'payoff_observer',
  ];
  const rows = records.map((r) =>
    headers
      .map((h) => {
        const value = r[h] ?? '';
        return typeof value === 'string' ? `"${value}"` : value;
      })
      .join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Admin() {
  const [records, setRecords] = useState<SavedRecord[]>([]);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const exportAll = () => downloadCsv(records, 'records.csv');
  const exportOne = (r: SavedRecord) => downloadCsv([r], `record_${r.code}.csv`);

  return (
    <div className="space-y-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={exportAll}
      >
        Exportar todo
      </button>
      <table className="w-full border text-sm">
        <thead>
          <tr>
            <th className="border px-2">Código</th>
            <th className="border px-2">Facultad</th>
            <th className="border px-2">Decisión</th>
            <th className="border px-2">Rating</th>
            <th className="border px-2">N1</th>
            <th className="border px-2">N2</th>
            <th className="border px-2">Víctima</th>
            <th className="border px-2">Observador</th>
            <th className="border px-2">Exportar</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.code}>
              <td className="border px-2">{r.code}</td>
              <td className="border px-2">{r.academic_unit}</td>
              <td className="border px-2">{r.decision}</td>
              <td className="border px-2">{r.rating ?? ''}</td>
              <td className="border px-2">{r.payoff_n1}</td>
              <td className="border px-2">{r.payoff_n2}</td>
              <td className="border px-2">{r.payoff_victim}</td>
              <td className="border px-2">{r.payoff_observer}</td>
              <td className="border px-2 text-center">
                <button
                  className="underline text-blue-600"
                  onClick={() => exportOne(r)}
                >
                  CSV
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
