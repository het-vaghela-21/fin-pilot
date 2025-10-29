import React from 'react';
import CashFlowChart from '../components/dashboard/CashFlowChart.jsx';
import RangePicker from '../components/dashboard/RangePicker.jsx';
import { getSummary, listTransactions, getGoal } from '../lib/api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Reports() {
  const [range, setRange] = React.useState('30d');
  const [summary, setSummary] = React.useState([]);
  const [txs, setTxs] = React.useState([]);
  const [goal, setGoal] = React.useState(null);

  const refetch = React.useCallback(async () => {
    const now = new Date();
    const start = new Date(now);
    if (range === '7d') start.setDate(now.getDate() - 7);
    else if (range === '30d') start.setDate(now.getDate() - 30);
    else if (range === '90d') start.setDate(now.getDate() - 90);
    else if (range === 'ytd') { start.setMonth(0, 1); start.setHours(0,0,0,0); }
    else if (range === '1y') { start.setFullYear(now.getFullYear() - 1); }
    const params = { startDate: start.toISOString(), endDate: now.toISOString() };
    try {
      const [sum, items] = await Promise.all([
        getSummary({ ...params, group: 'day' }),
        listTransactions(params),
      ]);
      setSummary(sum);
      // sort by date asc for event line
      items.sort((a,b) => new Date(a.date) - new Date(b.date));
      setTxs(items);
    } catch (e) { console.error('Reports fetch error', e); }
  }, [range]);

  React.useEffect(() => { refetch(); }, [refetch]);
  React.useEffect(() => {
    const onAdded = () => refetch();
    window.addEventListener('tx-added', onAdded);
    return () => window.removeEventListener('tx-added', onAdded);
  }, [refetch]);

  React.useEffect(() => { (async () => { try { const g = await getGoal({ year: new Date().getFullYear() }); setGoal(g); } catch {} })(); }, []);

  // Build pie data from expenses by bucket/category
  const expenseByBucket = React.useMemo(() => {
    const buckets = {};
    for (const t of txs) {
      if (t.type !== 'expense') continue;
      const key = t.bucket || t.category || 'Miscellaneous';
      buckets[key] = (buckets[key] || 0) + Number(t.amount || 0);
    }
    const labels = Object.keys(buckets);
    const values = labels.map(l => buckets[l]);
    return { labels, values };
  }, [txs]);

  const pieData = {
    labels: expenseByBucket.labels,
    datasets: [{
      label: 'Expenditure',
      data: expenseByBucket.values,
      backgroundColor: ['#f87171','#fb923c','#fbbf24','#34d399','#60a5fa','#a78bfa','#f472b6','#22d3ee','#94a3b8'],
      borderWidth: 1,
    }]
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <RangePicker value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Big line chart */}
        <div className="xl:col-span-2">
          <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-semibold">Overall Balance (by transactions)</div>
            </div>
            <CashFlowChart data={summary} events={txs} goalLine={goal ? Number(goal.amount) : undefined} />
          </div>
        </div>

        {/* Pie chart */}
        <div>
          <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-semibold">Expenditure</div>
              <span className="text-xs text-gray-500 dark:text-gray-400">By category/bucket</span>
            </div>
            <div className="h-72 w-full">
              {expenseByBucket.values.length ? (
                <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' }}}} />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">No expenses in this period</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
