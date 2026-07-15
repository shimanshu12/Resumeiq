import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import resumeRoutes from './routes/resumeRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { multerErrorMessage } from './middleware/uploadMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));

// ======================
// Root Route
// ======================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ResumeIQ Backend is Live 🚀',
    health: '/api/health',
    api: {
      resumes: '/api/resumes',
      reports: '/api/reports',
    },
  });
});

// ======================
// Health Check
// ======================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'resumeiq-backend',
  });
});

// ======================
// API Routes
// ======================
app.use('/api/resumes', resumeRoutes);
app.use('/api/reports', reportRoutes);

// ======================
// Error Handler
// ======================
app.use((err, req, res, next) => {
  if (err?.name === 'MulterError' || err?.message === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      success: false,
      error: multerErrorMessage(err),
    });
  }

  console.error(err);

  res.status(500).json({
    success: false,
    error: 'Internal server error.',
  });
});

// ======================
// 404 Handler
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found.',
  });
});

// ======================
// Start Server
// ======================
app.listen(PORT, () => {
  console.log(`🚀 ResumeIQ backend running on port ${PORT}`);
});