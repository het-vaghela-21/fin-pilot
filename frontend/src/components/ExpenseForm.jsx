
import React, { useState } from 'react';

const ExpenseForm = ({ onAdd }) => {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    onAdd({ type, category, amount: parseFloat(amount), description, date: new Date().toISOString() });
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 space-y-4 w-full">
      <h2 className="text-xl font-semibold text-gray-800">Add Transaction</h2>

      <div className="flex space-x-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-lg p-2 flex-1"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg p-2 flex-1"
        />
      </div>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border rounded-lg p-2 w-full"
      />

      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded-lg p-2 w-full"
      />

      <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg w-full">
        Add
      </button>
    </form>
  );
};

export default ExpenseForm;

