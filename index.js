import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import resumeRoutes from './routes/resume.js';
import contactRoutes from './routes/contact.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_DB_URL = process.env.MONGO_DB_URL || process.env.MONGO_DB_URL;

// ── Middleware ──────────────────────────────────────────────
const parseOrigins = (val) => {
  if (!val) return [];
  return val.split(',').map((url) => url.trim().replace(/\/+$/, ''));
};

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  ...parseOrigins(process.env.CLIENT_URL),
  ...parseOrigins(process.env.ADMIN_URL),
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server) or origin 'null'
    if (!origin || origin === 'null') {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/+$/, '');

    // Check if the origin matches any of the allowed origins or matches localhost/127.0.0.1
    let isAllowed = allowedOrigins.includes(normalizedOrigin) ||
      normalizedOrigin.endsWith('.vercel.app') ||
      normalizedOrigin.endsWith('.netlify.app') ||
      normalizedOrigin.endsWith('.onrender.com');

    if (!isAllowed) {
      try {
        const url = new URL(origin);
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
          isAllowed = true;
        }
      } catch (e) {
        // Ignore invalid URL formatting
      }
    }

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked] Origin not allowed: ${origin}`);
      // Return false to reject CORS cleanly instead of throwing a 500 error
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/api/resume', resumeRoutes);
app.use('/api/contact', contactRoutes);

// ── Health check ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio backend running.' });
});

// ── Database ─────────────────────────────────────────────────
const startServer = async () => {
  if (!MONGO_DB_URL) {
    console.warn('MONGO_DB_URL is not set. Set it in your environment to enable resume persistence.');
  } else {
    try {
      await mongoose.connect(MONGO_DB_URL);
      console.log('MongoDB connected successfully.');
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
      console.warn('Continuing server execution to allow diagnostics and prevent deployment block.');
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

startServer();