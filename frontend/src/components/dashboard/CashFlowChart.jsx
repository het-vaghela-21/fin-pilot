import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  Title,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, Title);

export default function CashFlowChart({ data = [], goalLine, events = [] }) {
  const hasEvents = Array.isArray(events) && events.length > 0;
  const hasSummary = Array.isArray(data) && data.length > 0;
  if (!hasEvents && !hasSummary) {
    return (
      <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-semibold">Predictive Cash Flow</div>
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">No data</span>
        </div>
        <div className="flex h-56 w-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          Add a transaction or change the time range to see the chart.
        </div>
      </div>
    );
  }

  // Prefer per-transaction events for point-by-point movement; fallback to summary
  let labels = [];
  let series = [];
  let deltas = [];
  if (hasEvents) {
    const sorted = [...events].sort((a,b) => new Date(a.date) - new Date(b.date));
    let bal = 0;
    for (const t of sorted) {
      const delta = (t.type === 'income' ? 1 : -1) * Number(t.amount || 0);
      bal += delta;
      labels.push(new Date(t.date).toLocaleString());
      series.push(bal);
      deltas.push(delta);
    }
    if (series.length === 1) {
      // seed previous point so a line is drawn
      const firstDate = new Date(sorted[0].date);
      const prevDate = new Date(firstDate);
      prevDate.setMinutes(firstDate.getMinutes() - 1);
      labels.unshift(prevDate.toLocaleString());
      series.unshift(0);
      deltas.unshift(0);
    }
  } else {
    let bal = 0;
    labels = data.map(d => new Date(d.date).toLocaleDateString());
    series = data.map(d => {
      bal += Number(d.income || 0) - Number(d.expense || 0);
      deltas.push((Number(d.income||0)) - (Number(d.expense||0)));
      return bal;
    });
    if (series.length === 1) {
      const firstDate = new Date(data[0].date);
      const prevDate = new Date(firstDate);
      prevDate.setDate(firstDate.getDate() - 1);
      labels.unshift(prevDate.toLocaleDateString());
      series.unshift(0);
      deltas.unshift(0);
    }
  }

  const datasets = [
    {
      label: 'Net Balance',
      data: series,
      borderColor: '#22c55e',
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 4,
      tension: 0.2,
      fill: false,
      segment: {
        borderColor: ctx => {
          const curr = ctx.p1.parsed.y;
          const prev = ctx.p0.parsed.y;
          return curr - prev >= 0 ? '#22c55e' : '#ef4444';
        }
      },
    },
  ];
  if (typeof goalLine === 'number') {
    datasets.push({
      label: 'Goal',
      data: Array(labels.length).fill(Number(goalLine)),
      borderColor: '#f59e0b',
      borderDash: [6, 4],
      pointRadius: 0,
      fill: false,
    });
  }

  // Plugin to draw delta labels next to points (+₹X/-₹Y)
  const valueLabels = {
    id: 'valueLabels',
    afterDatasetsDraw: (chart) => {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      ctx.save();
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      meta.data.forEach((pt, idx) => {
        if (idx === 0) return; // skip seeded or first point label
        const delta = deltas[idx] ?? 0;
        if (!delta) return;
        const color = delta >= 0 ? '#22c55e' : '#ef4444';
        ctx.fillStyle = color;
        const text = `${delta >= 0 ? '+' : '-'}₹${Math.abs(delta).toLocaleString('en-IN')}`;
        ctx.fillText(text, pt.x + 4, pt.y - 8);
      });
      ctx.restore();
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ₹${Number(ctx.parsed.y).toLocaleString('en-IN')}`,
        }
      },
      valueLabels: {},
    },
    scales: {
      x: {
        grid: { color: 'rgba(148,163,184,0.25)' },
        ticks: { maxRotation: 0, autoSkip: true },
      },
      y: {
        grid: { color: 'rgba(148,163,184,0.25)' },
        ticks: {
          callback: (val) => `₹${Number(val).toLocaleString('en-IN')}`,
        }
      }
    },
    elements: { line: { spanGaps: true } }
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-lg font-semibold">Predictive Cash Flow</div>
        <span className="rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">Goal Overlay</span>
      </div>
      <div className="h-72 w-full">
        <Line data={{ labels, datasets }} options={options} plugins={[valueLabels]} />
      </div>
    </div>
  );
}
