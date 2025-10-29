import React from 'react';

const presets = [
  { id: '7d', label: '7D' },
  { id: '30d', label: '30D' },
  { id: '90d', label: '90D' },
  { id: 'ytd', label: 'YTD' },
  { id: '1y', label: '1Y' },
];

export default function RangePicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      {presets.map(p => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`rounded-md border px-2.5 py-1 text-sm ${value === p.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700'}`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
