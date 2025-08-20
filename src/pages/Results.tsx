import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { groupStatus, GroupResults } from '../lib/api';
import { subscribeResults } from '../lib/realtime';

type ResultsData = {
  status: string;
  results: GroupResults;
  role: string;
  group_id?: string;
};

export default function Results() {
  const [params] = useSearchParams();
  const pid = params.get('pid') || '';
  const navigate = useNavigate();
  const [data, setData] = useState<ResultsData | null>(null);

  useEffect(() => {
    let unsub: () => void = () => {};
    const load = async () => {
      const status = await groupStatus(pid);
      if (status.status === 'results') {
        setData(status as ResultsData);
      } else if (status.group_id) {
        unsub = subscribeResults(status.group_id, async () => {
          const s = await groupStatus(pid);
          if (s.status === 'results') setData(s as ResultsData);
        });
      }
    };
    load();
    return () => unsub();
  }, [pid]);

  if (!data) return <p>Esperando resultados...</p>;

  const r = data.results;
  const payoff =
    data.role === 'negotiator1'
      ? r.payoff_n1
      : data.role === 'negotiator2'
      ? r.payoff_n2
      : data.role === 'victim'
      ? r.payoff_victim
      : r.payoff_observer;

  const next = () => {
    if (data.role === 'victim' || data.role === 'observer')
      navigate(`/rating?pid=${encodeURIComponent(pid)}`);
    else navigate(`/end?pid=${encodeURIComponent(pid)}`);
  };

  return (
    <div className="space-y-4 text-center">
      <p>Resultados del grupo:</p>
      <ul className="text-left mx-auto w-48">
        <li>Negociador 1: {r.payoff_n1}</li>
        <li>Negociador 2: {r.payoff_n2}</li>
        <li>Víctima: {r.payoff_victim}</li>
        <li>Observador: {r.payoff_observer}</li>
      </ul>
      <p>Tu pago: {payoff}</p>
      <div className="space-x-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={next}
        >
          Continuar
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => navigate('/')}
        >
          Inicio
        </button>
      </div>
    </div>
  );
}
