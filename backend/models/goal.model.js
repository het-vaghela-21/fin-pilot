const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'demo', index: true },
    year: { type: Number, required: true },
    title: { type: String, default: '' },
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

GoalSchema.index({ userId: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Goal', GoalSchema);
