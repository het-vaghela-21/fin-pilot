import React from 'react';

export default function InsightCard({ items = [], range = '30d' }) {
  const insight = React.useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) {
      return { title: 'Smart Insight', text: 'Add a few transactions to get personalized advice.' };
    }
    // Sum expenses by bucket/category
    const totals = {};
    let totalExp = 0;
    for (const t of items) {
      if (t.type !== 'expense') continue;
      const key = t.bucket || t.category || 'Miscellaneous';
      totals[key] = (totals[key] || 0) + Number(t.amount || 0);
      totalExp += Number(t.amount || 0);
    }
    const labels = Object.keys(totals);
    if (labels.length === 0) {
      return { title: 'Smart Insight', text: 'No expenses in this period. Log expenses to see insights.' };
    }
    labels.sort((a,b) => totals[b] - totals[a]);
    const top = labels[0];
    const topAmt = totals[top];
    const share = totalExp > 0 ? Math.round((topAmt/totalExp)*100) : 0;
    const text = `You've spent ₹${topAmt.toLocaleString('en-IN')} on ${top} in ${range.toUpperCase()}, ${share}% of your spending. Consider setting a '${top}' budget.`;
    return { title: 'Smart Insight', text };
  }, [items, range]);

  return (
    <div className="rounded-xl border bg-blue-50 p-4 text-blue-900 shadow-sm dark:border-gray-800 dark:bg-blue-900/30 dark:text-blue-100">
      <div className="text-sm font-semibold">{insight.title}</div>
      <p className="mt-2 text-sm">{insight.text}</p>
      <button className="mt-3 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Create a Budget</button>
    </div>
  );
}
