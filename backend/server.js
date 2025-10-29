// backend/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Add this line
require('dotenv').config();
const User = require('./models/user.model');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Add this block for DB Connection ---
const uri = process.env.MONGO_URI;
async function connectDB() {
  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB || undefined,
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      // Helpful for Atlas Stable API clusters; safe defaults
      serverApi: { version: '1', strict: false, deprecationErrors: false },
    });
    console.log('MongoDB database connection established successfully');

    // Ensure collection indexes match current schema (drops stale indexes like old `email`)
    try {
      await User.syncIndexes();
      console.log('User indexes are in sync with schema.');
    } catch (e) {
      console.error('Failed to sync User indexes:', e?.message);
    }

    // Extra safety: explicitly drop a stale unique index on `email` if present
    try {
      const idx = await User.collection.indexes();
      const emailIdx = idx.find(i => i.name === 'email_1' || (i.key && Object.keys(i.key).includes('email')));
      if (emailIdx) {
        await User.collection.dropIndex(emailIdx.name);
        console.log(`Dropped stale index ${emailIdx.name} from users collection.`);
      }
    } catch (e) {
      // Non-fatal; continue server startup
      console.warn('Index cleanup warning:', e?.message);
    }
  } catch (err) {
    console.error('\nMongoDB connection failed.');
    console.error('Reason:', err?.message);
    console.error('\nChecklist:');
    console.error('- Verify MONGO_URI uses mongodb+srv and includes retryWrites=true&w=majority');
    console.error('- Ensure your current IP is allowed in Atlas Network Access (or set 0.0.0.0/0 temporarily)');
    console.error('- Confirm database user & password are correct; URL-encode special characters');
    console.error('- Try another network (hotspot) if SSL inspection/firewall is present');
    process.exit(1);
  }
}
connectDB();
// --- End of DB Connection block ---

app.get('/', (req, res) => {
    res.send('Hello from Fin-Pilot Backend!');
});

// Add this before app.listen() in server.js

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter); // All routes in usersRouter will start with /api/users
const txRouter = require('./routes/transactions');
app.use('/api/transactions', txRouter);
const goalsRouter = require('./routes/goals');
app.use('/api/goals', goalsRouter);

app.listen(port, () => {
    console.log(`Backend server is running on port: ${port}`);
});