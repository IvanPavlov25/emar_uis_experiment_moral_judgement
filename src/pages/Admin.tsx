import React, { useState } from 'react';

export default function Admin() {
  const [token, setToken] = useState('');

  const exportCsv = async () => {
    const res = await fetch('/api/export?format=csv', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert('Error');
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="password"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Token"
        className="border p-2 w-full"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={exportCsv}>
        Exportar CSV
      </button>
    </div>
  );
}
