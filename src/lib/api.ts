export async function join(faculty: string) {
  const res = await fetch('/api/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ faculty }),
  });
  if (!res.ok) throw new Error('Error al unirse');
  return res.json();
}

export async function groupStatus(pid: string) {
  const res = await fetch(`/api/group-status?pid=${encodeURIComponent(pid)}`);
  if (!res.ok) throw new Error('Error de estado');
  return res.json();
}

export async function submitDecision(pid: string, choice: string) {
  const res = await fetch('/api/submit-decision', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pid, choice }),
  });
  if (!res.ok) throw new Error('Error al enviar decisión');
}

export async function submitRating(pid: string, rating: number) {
  const res = await fetch('/api/submit-rating', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pid, rating }),
  });
  if (!res.ok) throw new Error('Error al enviar rating');
}
