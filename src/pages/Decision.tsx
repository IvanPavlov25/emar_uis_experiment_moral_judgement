import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { submitDecision } from '../lib/api';

export default function Decision() {
  const [params] = useSearchParams();
  const pid = params.get('pid') || '';
  const navigate = useNavigate();

  const send = async (choice: string) => {
    await submitDecision(pid, choice);
    navigate(`/waiting?pid=${encodeURIComponent(pid)}`);
  };

  return (
    <div className="space-y-4 text-center">
      <p>Elige tu decisión:</p>
      <div className="flex justify-center space-x-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => send('accept')}
        >
          Aceptar
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => send('reject')}
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
