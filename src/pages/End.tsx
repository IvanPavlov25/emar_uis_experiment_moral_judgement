import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { groupStatus, GroupResults } from '../lib/api';

export default function End() {
  const [params] = useSearchParams();
  const pid = params.get('pid') || '';
  const [payoff, setPayoff] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const status = await groupStatus(pid);
      if (status.status === 'results') {
        const s = status as { results: GroupResults; role: string };
        const r = s.results;
        const p =
          s.role === 'negotiator1'
            ? r.payoff_n1
            : s.role === 'negotiator2'
            ? r.payoff_n2
            : s.role === 'victim'
            ? r.payoff_victim
            : r.payoff_observer;
        setPayoff(p);
      }
    };
    load();
  }, [pid]);

  return (
    <div className="text-center space-y-4">
      <p>Gracias por participar.</p>
      {payoff !== null && <p>Pago final: {payoff}</p>}
    </div>
  );
}
