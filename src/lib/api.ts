export async function join(faculty: string) {
  const pid = crypto.randomUUID();
  localStorage.setItem('participant_id', pid);
  localStorage.setItem('faculty', faculty);
  localStorage.setItem('status', 'decision');
  localStorage.setItem('role', 'negotiator1');
  return { participant_id: pid };
}

export async function groupStatus(pid: string) {
  void pid;
  const status = localStorage.getItem('status') || 'decision';
  if (status === 'results') {
    const results = JSON.parse(localStorage.getItem('results') || '{}');
    const role = localStorage.getItem('role') || 'negotiator1';
    return { status, results, role };
  }
  return { status };
}

export async function submitDecision(pid: string, choice: string) {
  void pid;
  localStorage.setItem('decision', choice);
  const results = {
    payoff_n1: 10,
    payoff_n2: 10,
    payoff_victim: 5,
    payoff_observer: 2,
  };
  localStorage.setItem('results', JSON.stringify(results));
  localStorage.setItem('status', 'results');
}

export async function submitRating(pid: string, rating: number) {
  void pid;
  localStorage.setItem('rating', rating.toString());
}
