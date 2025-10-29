import React, { useState } from 'react';
import { createTransaction } from '../lib/api';

export default function AddTransactionModal({ open, onClose }) {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!category || !amt || amt <= 0) return;
    setLoading(true);
    try {
      const tx = await createTransaction({ type, category, amount: amt, note, date: new Date().toISOString() });
      // notify listeners (Dashboard) to refetch
      window.dispatchEvent(new CustomEvent('tx-added', { detail: tx }));
      // reset
      setCategory(''); setAmount(''); setNote(''); setType('expense');
      onClose?.();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl border bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Transaction</h3>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Close</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex gap-3">
            <select value={type} onChange={(e)=>setType(e.target.value)} className="flex-1 rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Reason / Category" className="flex-1 rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          </div>
          <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount" className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          <input value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Description (optional)" className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          <button disabled={loading} className="w-full rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600">
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>
    </div>
  );
}
