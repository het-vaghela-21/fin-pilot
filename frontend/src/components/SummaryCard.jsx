import React from 'react';

const SummaryCard = ({ title, amount, color }) => {
  return (
    <div className={`p-4 rounded-xl shadow-md text-white ${color}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-2">₹{amount.toFixed(2)}</p>
    </div>
  );
};

export default SummaryCard;
