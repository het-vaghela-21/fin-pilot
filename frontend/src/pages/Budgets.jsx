import React from 'react';
import { createTransaction, listTransactions } from '../lib/api';

const BUCKETS = [
  { id: 'food', label: 'Food' },
  { id: 'clothes', label: 'Clothes' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'daily_needs', label: 'Daily Needs' },
  { id: 'miscellaneous', label: 'Miscellaneous' },
];

const presetOptions = [
  { id: '1w', label: 'Past Week' },
  { id: '1m', label: 'Past Month' },
  { id: '6m', label: 'Past 6 Months' },
  { id: '1y', label: 'Past Year' },
];

export default function Budgets() {
  const [range, setRange] = React.useState('1m');
  const [data, setData] = React.useState({}); // bucket -> items
  const [loading, setLoading] = React.useState(false);

  const computeDates = React.useCallback(() => {
    const now = new Date();
    const start = new Date(now);
    if (range === '1w') start.setDate(now.getDate() - 7);
    else if (range === '1m') start.setMonth(now.getMonth() - 1);
    else if (range === '6m') start.setMonth(now.getMonth() - 6);
    else if (range === '1y') start.setFullYear(now.getFullYear() - 1);
    return { startDate: start.toISOString(), endDate: now.toISOString() };
  }, [range]);

  const fetchBucket = async (bucket, dates) => {
    const items = await listTransactions({ bucket, ...dates });
    // Only expenses in budgets view
    return items.filter(i => i.type === 'expense');
  };

  const refetch = React.useCallback(async () => {
    setLoading(true);
    const dates = computeDates();
    const result = {};
    try {
      for (const b of BUCKETS) {
        result[b.id] = await fetchBucket(b.id, dates);
      }
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [computeDates]);

  React.useEffect(() => { refetch(); }, [refetch]);

  const handleAdd = async (bucketId, amount, reason) => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    // Map bucket to a friendly category name
    const catLabel = BUCKETS.find(b => b.id === bucketId)?.label || 'Misc';
    await createTransaction({ type: 'expense', amount: amt, category: catLabel, note: reason || '', date: new Date().toISOString() });
    window.dispatchEvent(new CustomEvent('tx-added'));
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <div className="flex items-center gap-2">
          {presetOptions.map(p => (
            <button key={p.id} onClick={() => setRange(p.id)} className={`rounded-md border px-2.5 py-1 text-sm ${range===p.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {BUCKETS.map((b) => (
          <div key={b.id} className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-semibold">{b.label}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{loading ? 'Loading...' : `${data[b.id]?.length || 0} items`}</div>
            </div>
            <AddExpenseInline onAdd={(amt, reason)=>handleAdd(b.id, amt, reason)} />
            <div className="mt-3 max-h-56 overflow-y-auto rounded-md border dark:border-gray-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Reason</th>
                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {(data[b.id] || []).map((t) => (
                    <tr key={t._id} className="bg-white dark:bg-gray-950">
                      <td className="whitespace-nowrap px-3 py-1.5 text-sm">₹{Number(t.amount).toFixed(2)}</td>
                      <td className="whitespace-nowrap px-3 py-1.5 text-sm">{t.note || '-'}</td>
                      <td className="whitespace-nowrap px-3 py-1.5 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddExpenseInline({ onAdd }) {
  const [amount, setAmount] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!amount) return;
    setBusy(true);
    try {
      await onAdd(amount, reason);
      setAmount(''); setReason('');
    } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input value={amount} onChange={(e)=>setAmount(e.target.value)} type="number" placeholder="Amount" className="w-28 rounded-md border px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800" />
      <input value={reason} onChange={(e)=>setReason(e.target.value)} type="text" placeholder="Reason" className="flex-1 rounded-md border px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800" />
      <button disabled={busy} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600">Add</button>
    </form>
  );
}
