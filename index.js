import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import resumeRoutes from './routes/resume.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_DB_URL = process.env.MONGO_DB_URL || process.env.MONGO_DB_URL;

// ── Middleware ──────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/api/resume', resumeRoutes);

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