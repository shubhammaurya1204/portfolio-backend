import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import resumeRoutes from './routes/resume.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_DB_URL = process.env.MONGO_DB_URL || process.env.MONGO_DB_URL;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5174',
  ],
  methods: ['GET', 'POST'],
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();