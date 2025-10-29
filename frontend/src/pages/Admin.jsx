import React from 'react';
import { listUsers, getStats, getSummary, listTransactions } from '../lib/api';

export default function Admin() {
  const [users, setUsers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [stats, setStats] = React.useState(null);
  const [summary, setSummary] = React.useState([]);
  const [recent, setRecent] = React.useState([]);
  const [range, setRange] = React.useState('30d');

  const loadUsers = React.useCallback(async () => {
    try { setUsers(await listUsers()); } catch (e) { console.error(e); }
  }, []);

  React.useEffect(() => { loadUsers(); }, [loadUsers]);

  const refetch = React.useCallback(async () => {
    if (!selected) return;
    const now = new Date();
    const start = new Date(now);
    if (range === '7d') start.setDate(now.getDate() - 7);
    else if (range === '30d') start.setDate(now.getDate() - 30);
    else if (range === '90d') start.setDate(now.getDate() - 90);
    else if (range === 'ytd') { start.setMonth(0, 1); start.setHours(0,0,0,0); }
    else if (range === '1y') { start.setFullYear(now.getFullYear() - 1); }
    const params = { startDate: start.toISOString(), endDate: now.toISOString(), userId: selected.id };
    try {
      const [s, sum, tx] = await Promise.all([
        getStats(params),
        getSummary({ ...params, group: 'day' }),
        listTransactions(params),
      ]);
      setStats(s);
      setSummary(sum);
      setRecent(tx.slice(0, 5));
    } catch (e) { console.error(e); }
  }, [selected, range]);

  React.useEffect(() => { refetch(); }, [refetch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <div className="flex items-center gap-2">
          {['7d','30d','90d','ytd','1y'].map(p => (
            <button key={p} onClick={()=>setRange(p)} className={`rounded-md border px-2.5 py-1 text-sm ${range===p?'bg-blue-600 text-white border-blue-600':'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700'}`}>{p.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 text-lg font-semibold">Users</div>
          <div className="max-h-[460px] overflow-y-auto divide-y dark:divide-gray-800">
            {users.map(u => (
              <button key={u.id} onClick={()=>setSelected(u)} className={`flex w-full items-center justify-between px-2 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 ${selected?.id===u.id?'bg-gray-50 dark:bg-gray-800':''}`}>
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{u.upiId} · {u.phone}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 min-h-[160px]">
            <div className="mb-2 text-lg font-semibold">Summary {selected?`for ${selected.name}`:''}</div>
            {stats ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-md border p-3 dark:border-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Balance</div>
                  <div className="text-lg font-semibold">₹{Number(stats.balance||0).toLocaleString('en-IN')}</div>
                </div>
                <div className="rounded-md border p-3 dark:border-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Income</div>
                  <div className="text-lg font-semibold text-green-600">₹{Number(stats.totals?.income||0).toLocaleString('en-IN')}</div>
                </div>
                <div className="rounded-md border p-3 dark:border-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Expense</div>
                  <div className="text-lg font-semibold text-red-600">₹{Number(stats.totals?.expense||0).toLocaleString('en-IN')}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">Select a user to view summary.</div>
            )}
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-2 text-lg font-semibold">Recent Transactions</div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
                    <th className="px-3 py-1.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {recent.map(t => (
                    <tr key={t._id} className="bg-white dark:bg-gray-950">
                      <td className="whitespace-nowrap px-3 py-1.5 text-sm">{new Date(t.date).toLocaleString()}</td>
                      <td className="whitespace-nowrap px-3 py-1.5 text-sm capitalize">{t.type}</td>
                      <td className="whitespace-nowrap px-3 py-1.5 text-sm">{t.category}</td>
                      <td className="whitespace-nowrap px-3 py-1.5 text-sm">₹{Number(t.amount).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
