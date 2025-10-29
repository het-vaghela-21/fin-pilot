import React from 'react';

export default function KPIStat({ title, value, accent = 'blue' }) {
  const color = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    indigo: 'bg-indigo-600',
  }[accent] || 'bg-blue-600';

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-semibold">{value}</div>
        <div className={`h-2 w-16 rounded-full ${color}`}></div>
      </div>
    </div>
  );
}
