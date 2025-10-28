// backend/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Add this line
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Add this block for DB Connection ---
const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})
// --- End of DB Connection block ---

app.get('/', (req, res) => {
    res.send('Hello from Fin-Pilot Backend!');
});

// Add this before app.listen() in server.js

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter); // All routes in usersRouter will start with /api/users

app.listen(port, () => {
    console.log(`Backend server is running on port: ${port}`);
});