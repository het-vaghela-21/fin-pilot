const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    bucket: {
      type: String,
      enum: ['food', 'clothes', 'jewellery', 'daily_needs', 'miscellaneous', 'income'],
      default: 'miscellaneous',
      index: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    // For multi-user later
    userId: {
      type: String,
      default: 'demo',
      index: true,
    },
  },
  { timestamps: true }
);

// Helpful index for date queries per user
TransactionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
