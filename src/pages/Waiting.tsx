import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { groupStatus } from '../lib/api';

export default function Waiting() {
  const [params] = useSearchParams();
  const pid = params.get('pid') || '';
  const navigate = useNavigate();
  const [message, setMessage] = useState('Esperando a otros participantes...');

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const status = await groupStatus(pid);
        if (!active) return;
        if (status.status === 'decision') {
          navigate(`/decision?pid=${encodeURIComponent(pid)}`);
        } else if (status.status === 'results') {
          navigate(`/results?pid=${encodeURIComponent(pid)}`);
        }
      } catch {
        setMessage('Error de conexión. Reintentando...');
      }
    };
    check();
    const id = setInterval(check, 3000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [pid, navigate]);

  return <p>{message}</p>;
}
