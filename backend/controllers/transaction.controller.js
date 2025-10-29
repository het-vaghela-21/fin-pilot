const Transaction = require('../models/transaction.model');
const mongoose = require('mongoose');

const parseDateRange = (query) => {
  const { startDate, endDate } = query;
  const range = {};
  if (startDate) range.$gte = new Date(startDate);
  if (endDate) {
    const d = new Date(endDate);
    // include entire end day
    d.setHours(23, 59, 59, 999);
    range.$lte = d;
  }
  return Object.keys(range).length ? range : undefined;
};

const BUCKETS = [
  { name: 'food', keywords: ['food','hotel','restaurant','zomato','swiggy','meal','dinner','lunch','breakfast','groceries'] },
  { name: 'clothes', keywords: ['clothes','apparel','garment','shopping','shirt','pant','dress','shoe'] },
  { name: 'jewellery', keywords: ['jewellery','jewelry','ornament','gold','silver','ring','necklace'] },
  { name: 'daily_needs', keywords: ['daily','needs','utility','toiletries','soap','milk','bread','vegetable'] },
];

const detectBucket = (type, category = '', note = '') => {
  if (type === 'income') return 'income';
  const text = `${category} ${note}`.toLowerCase();
  for (const b of BUCKETS) {
    if (b.keywords.some(k => text.includes(k))) return b.name;
  }
  return 'miscellaneous';
};

exports.create = async (req, res) => {
  try {
    const { type, amount, category, note, date, userId = 'demo' } = req.body;
    const bucket = detectBucket(type, category, note);
    const tx = await Transaction.create({ type, amount, category, note, date, userId, bucket });
    res.status(201).json(tx);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { type, category, bucket, userId = 'demo' } = req.query;
    const filter = { userId };
    const dateRange = parseDateRange(req.query);
    if (dateRange) filter.date = dateRange;
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (bucket) filter.bucket = bucket;

    const items = await Transaction.find(filter).sort({ date: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.stats = async (req, res) => {
  // totals and net balance for a range
  try {
    const { userId = 'demo' } = req.query;
    const match = { userId };
    const dateRange = parseDateRange(req.query);
    if (dateRange) match.date = dateRange;

    const result = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totals = { income: 0, expense: 0 };
    for (const r of result) totals[r._id] = r.total;
    const balance = totals.income - totals.expense;

    res.json({ totals, balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.summary = async (req, res) => {
  // group by day|month|year for charts
  try {
    const { group = 'day', userId = 'demo' } = req.query;
    const match = { userId };
    const dateRange = parseDateRange(req.query);
    if (dateRange) match.date = dateRange;

    const groupStage = (() => {
      if (group === 'year')
        return { year: { $year: '$date' } };
      if (group === 'month')
        return { year: { $year: '$date' }, month: { $month: '$date' } };
      // default day
      return { year: { $year: '$date' }, month: { $month: '$date' }, day: { $dayOfMonth: '$date' } };
    })();

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: Object.assign({ type: '$type' }, groupStage),
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
          },
          income: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ];

    const data = await Transaction.aggregate(pipeline);
    // Normalize output into dates and values
    const points = data.map((d) => ({
      date: new Date(
        d._id.year,
        (d._id.month || 1) - 1,
        d._id.day || 1
      ),
      income: d.income,
      expense: d.expense,
      balance: d.income - d.expense,
    }));

    res.json(points);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
