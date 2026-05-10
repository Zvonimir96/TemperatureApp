const BASE = '/api';

export async function fetchDays() {
  const res = await fetch(`${BASE}/days`);
  if (!res.ok) throw new Error('Failed to fetch days');
  return res.json();
}

export async function fetchReadings(date) {
  const res = await fetch(`${BASE}/readings?date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch readings');
  return res.json();
}
