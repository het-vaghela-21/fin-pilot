import React from 'react';
import { listTransactions } from '../lib/api';

export default function Transactions() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const fetchAll = React.useCallback(async () => {
    setLoading(true); setError('');
    try {
      // fetch everything (no date filter)
      const data = await listTransactions();
      // sort newest first
      data.sort((a,b) => new Date(b.date) - new Date(a.date));
      setItems(data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchAll(); }, [fetchAll]);
  React.useEffect(() => {
    // refresh when a new tx is added from modal
    const onAdded = () => fetchAll();
    window.addEventListener('tx-added', onAdded);
    return () => window.removeEventListener('tx-added', onAdded);
  }, [fetchAll]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <div className="rounded-lg border bg-white p-0 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm text-gray-600 dark:text-gray-300">All transactions (Income and Expense)</div>
          <button onClick={fetchAll} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">Refresh</button>
        </div>
        {error ? (
          <div className="px-4 pb-4 text-sm text-red-600">{error}</div>
        ) : null}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">S/N</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Reason</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No transactions yet</td></tr>
              ) : (
                items.map((t, i) => (
                  <tr key={t._id || i} className="bg-white dark:bg-gray-950">
                    <td className="whitespace-nowrap px-4 py-2 text-sm">{i + 1}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">₹{Number(t.amount).toFixed(2)}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">{t.category || '-'}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">{t.note || '-'}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm capitalize">{t.type}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">{new Date(t.date).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
