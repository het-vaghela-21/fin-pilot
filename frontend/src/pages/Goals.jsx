import React from 'react';
import { getGoal, setGoal, getStats } from '../lib/api';

export default function Goals() {
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [title, setTitle] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [current, setCurrent] = React.useState(null);
  const [balance, setBalance] = React.useState(0);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const g = await getGoal({ year });
      setCurrent(g);
      setTitle(String(g?.title || ''));
      setAmount(String(g?.amount || ''));
    } finally { setLoading(false); }
  }, [year]);

  React.useEffect(() => { load(); }, [load]);

  const loadStats = React.useCallback(async () => {
    try {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const s = await getStats({ startDate: start.toISOString(), endDate: now.toISOString() });
      setBalance(Number(s?.balance || 0));
    } catch {}
  }, []);
  React.useEffect(() => { loadStats(); }, [loadStats]);
  React.useEffect(() => {
    const onAdded = () => { loadStats(); };
    window.addEventListener('tx-added', onAdded);
    return () => window.removeEventListener('tx-added', onAdded);
  }, [loadStats]);

  const onSave = async (e) => {
    e.preventDefault();
    const amt = Number(amount || 0);
    await setGoal({ year, amount: amt, title });
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Goals</h1>
      <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <form onSubmit={onSave} className="grid grid-cols-1 gap-3 md:grid-cols-4 md:items-end">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Year</label>
            <select value={year} onChange={(e)=>setYear(Number(e.target.value))} className="rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
              {Array.from({length:5}).map((_,i)=>{
                const y = new Date().getFullYear() - 1 + i; // last, current, next years
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
          <div className="flex-1 md:col-span-2">
            <label className="block text-sm text-gray-600 dark:text-gray-300">Goal name</label>
            <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g. Save for Bike" className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 dark:text-gray-300">Goal amount (₹)</label>
            <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="e.g. 200000" className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          </div>
          <button disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600">Save Goal</button>
        </form>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {loading ? 'Loading current goal…' : (
            <span>Current goal for {year}: <strong>{current?.title || 'Unnamed goal'}</strong> · <strong>₹{Number(current?.amount || 0).toLocaleString()}</strong></span>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Real-time balance this month: <strong>₹{Number(balance).toLocaleString('en-IN')}</strong>
          {Number(current?.amount||0) > 0 && (
            <span> · Progress: <strong>{Math.round(Math.max(0, Math.min(100, (Number(balance)/Number(current?.amount))*100)))}%</strong></span>
          )}
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="text-gray-600 dark:text-gray-300 text-sm">Tip: The Dashboard chart can show a green dashed line at your goal level. When your balance meets or exceeds the goal, a congratulation banner appears.</p>
      </div>
    </div>
  );
}
