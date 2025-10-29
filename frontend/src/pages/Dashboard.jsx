import React, { useState } from 'react';
import KPIStat from '../components/dashboard/KPIStat.jsx';
import CashFlowChart from '../components/dashboard/CashFlowChart.jsx';
import InsightCard from '../components/dashboard/InsightCard.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';
import GoalsProgress from '../components/dashboard/GoalsProgress.jsx';
import RangePicker from '../components/dashboard/RangePicker.jsx';
import { getStats, getSummary, listTransactions, getGoal } from '../lib/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totals: { income: 0, expense: 0 }, balance: 0 });
  const [summary, setSummary] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [range, setRange] = useState('30d');
  const [goal, setGoal] = useState(null);

  const num = (v) => (typeof v === 'number' && isFinite(v) ? v : 0);

  const recent = transactions.slice(0, 5).map(t => ({
    name: t.category || (t.type === 'income' ? 'Income' : 'Expense'),
    amount: t.type === 'income' ? t.amount : -t.amount,
  }));

  const goals = [
    { name: 'Goa Trip', current: 12500, target: 20000 },
    { name: 'New Phone', current: 31000, target: 65000 },
    { name: 'Emergency Fund', current: 85000, target: 100000 },
  ];

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
      const [txs, s, sum] = await Promise.all([
        listTransactions(params),
        getStats(params),
        getSummary({ ...params, group: 'day' }),
      ]);
      setTransactions(txs);
      setStats(s);
      setSummary(sum);
    } catch (e) {
      console.error('Fetch error', e);
    }
  }, [range]);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  React.useEffect(() => {
    const sameDay = (a, b) => {
      const da = new Date(a), db = new Date(b);
      return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
    };
    const onAdded = (e) => {
      const tx = e?.detail;
      if (!tx) { refetch(); return; }
      // Optimistic: update transactions
      setTransactions(prev => [tx, ...prev]);
      // Optimistic: update stats
      setStats(prev => {
        const inc = tx.type === 'income' ? Number(tx.amount||0) : 0;
        const exp = tx.type === 'expense' ? Number(tx.amount||0) : 0;
        const totals = {
          income: (prev?.totals?.income || 0) + inc,
          expense: (prev?.totals?.expense || 0) + exp,
        };
        const balance = (prev?.balance || 0) + inc - exp;
        return { totals, balance };
      });
      // Optimistic: update summary for the selected range (today)
      setSummary(prev => {
        const todayIso = new Date().toISOString();
        if (!Array.isArray(prev) || prev.length === 0) {
          return [{ date: todayIso, income: tx.type==='income'?Number(tx.amount||0):0, expense: tx.type==='expense'?Number(tx.amount||0):0, balance: tx.type==='income'?Number(tx.amount||0):-Number(tx.amount||0) }];
        }
        const last = prev[prev.length-1];
        if (sameDay(last.date, todayIso)) {
          const income = (last.income||0) + (tx.type==='income'?Number(tx.amount||0):0);
          const expense = (last.expense||0) + (tx.type==='expense'?Number(tx.amount||0):0);
          const balance = (last.balance||0) + (tx.type==='income'?Number(tx.amount||0):-Number(tx.amount||0));
          const updated = prev.slice(0, -1).concat([{ ...last, income, expense, balance }]);
          return updated;
        } else {
          const income = tx.type==='income'?Number(tx.amount||0):0;
          const expense = tx.type==='expense'?Number(tx.amount||0):0;
          const balance = (last.balance||0) + income - expense;
          return prev.concat([{ date: todayIso, income, expense, balance }]);
        }
      });
      // Finally, reconcile with server
      refetch();
    };
    window.addEventListener('tx-added', onAdded);
    return () => window.removeEventListener('tx-added', onAdded);
  }, [refetch]);

  // Load current year's goal once
  React.useEffect(() => {
    (async () => {
      try {
        const y = new Date().getFullYear();
        const g = await getGoal({ year: y });
        setGoal(g);
      } catch (e) {
        console.error('Goal fetch error', e);
      }
    })();
  }, []);

  const user = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user')||'null'); } catch { return null; }
  }, []);

  return (
    <div className="space-y-6">
      {goal && Number(goal.amount) > 0 && num(stats.balance) >= Number(goal.amount) && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/40 dark:text-green-200">
          You have reached the Goal. Congratulations! Let’s prepare for another goal.
        </div>
      )}
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {user?.name || 'Guest'}!</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Here’s your financial overview for this month.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KPIStat title="Account Balance" value={`₹${num(stats.balance).toFixed(2)}`} accent="indigo" />
        <KPIStat title="Monthly Spending" value={`₹${num(stats.totals?.expense).toFixed(2)}`} accent="red" />
        <KPIStat title="Savings Rate" value={num(stats.totals?.income) ? `${Math.max(0, Math.round((num(stats.balance)/Math.max(1, num(stats.totals?.income)))*100))}%` : '0%'} accent="green" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">Predictive Cash Flow</div>
            <RangePicker value={range} onChange={setRange} />
          </div>
          <CashFlowChart data={summary} events={transactions} goalLine={goal ? Number(goal.amount) : undefined} />
        </div>
        <div className="space-y-6">
          <InsightCard items={transactions} range={range} />
          <RecentTransactions items={recent} />
        </div>
      </div>

      <GoalsProgress goals={goals} />
    </div>
  );
};

export default Dashboard;
