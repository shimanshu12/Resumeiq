import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import resumeRoutes from './routes/resumeRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { multerErrorMessage } from './middleware/uploadMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'resumeiq-backend' }));

app.use('/api/resumes', resumeRoutes);
app.use('/api/reports', reportRoutes);

// Central error handler — catches multer errors and anything unhandled below
app.use((err, req, res, next) => {
  if (err?.name === 'MulterError' || err?.message === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ error: multerErrorMessage(err) });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));

app.listen(PORT, () => {
  console.log(`ResumeIQ backend running on http://localhost:${PORT}`);
});
