import React from 'react';

export default function RecentTransactions({ items = [] }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 text-lg font-semibold">Recent Transactions</div>
      <ul className="space-y-3">
        {items.length === 0 && (
          <li className="text-sm text-gray-500 dark:text-gray-400">No transactions yet.</li>
        )}
        {items.map((t, i) => (
          <li key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: t.color || '#9CA3AF' }}></span>
              <span className="text-gray-700 dark:text-gray-200">{t.name}</span>
            </div>
            <div className={t.amount < 0 ? 'text-red-500' : 'text-green-500'}>
              {t.amount < 0 ? '-' : '+'} ₹{Math.abs(t.amount).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
