import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { submitRating } from '../lib/api';

export default function Rating() {
  const [params] = useSearchParams();
  const pid = params.get('pid') || '';
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRating(pid, rating);
    navigate(`/end?pid=${encodeURIComponent(pid)}`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-center">
      <p>¿Cómo calificas moralmente la decisión de los negociadores?</p>
      <input
        type="range"
        min="-9"
        max="9"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full"
      />
      <div>{rating}</div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
        Enviar
      </button>
    </form>
  );
}
