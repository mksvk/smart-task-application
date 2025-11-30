// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const taskRoutes = require('./routes/tasks');
const { startReminderWorker } = require('./reminder/worker');

const app = express();

// ---------------- CORS CONFIG ----------------

const allowedOrigins = [
  'https://smart-task-ui.mksvk.com',
  'http://localhost:8080',   // dev (docker / local)
  'http://localhost:5173',   // dev (vite default)
];

// single CORS options object
const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server or curl (no Origin header)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS not allowed from this origin: ${origin}`), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
};

// Apply CORS for all routes + methods
app.use(cors(corsOptions));
// Handle preflight explicitly for all routes
app.options('*', cors(corsOptions));

// --------------- OTHER MIDDLEWARE ------------

app.use(express.json());

// --------------- ROUTES ----------------------

// Healthcheck
app.get('/', (req, res) => {
  res.json({ message: 'Smart Tasks + Reminders API is running' });
});

// Task routes
app.use('/api/tasks', taskRoutes);

// --------------- START SERVER ----------------

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });

  // Start reminder worker after DB is connected
  startReminderWorker();
};

start();
