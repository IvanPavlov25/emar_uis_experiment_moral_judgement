import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { join } from '../lib/api';

export default function ConsentFaculty() {
  const [faculty, setFaculty] = useState('ingenierias');
  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await join(faculty);
    navigate(`/waiting?pid=${encodeURIComponent(res.participant_id)}`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm">
        Este estudio es anónimo y con fines académicos. Puedes retirarte en cualquier momento.
      </p>
      <label className="block">
        <span className="block mb-1">Facultad</span>
        <select
          className="border p-2 w-full"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          required
        >
          <option value="ingenierias">Ingenierías</option>
          <option value="humanidades">Humanidades</option>
          <option value="neutral">Otra/Neutral</option>
        </select>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>Acepto participar</span>
      </label>
      <button
        type="submit"
        disabled={!consent}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Continuar
      </button>
    </form>
  );
}
