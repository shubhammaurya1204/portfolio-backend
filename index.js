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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
]
  .filter(Boolean)
  .map((url) => url.replace(/\/+$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/+$/, '');
    if (
      allowedOrigins.includes(normalizedOrigin) ||
      normalizedOrigin.endsWith('.vercel.app') ||
      normalizedOrigin.endsWith('.netlify.app') ||
      normalizedOrigin.endsWith('.onrender.com')
    ) {
      return callback(null, true);
    }
    console.warn(`[CORS Blocked] Origin not allowed: ${origin}`);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
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
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

startServer();