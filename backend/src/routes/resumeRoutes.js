import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';
import { analyzeResume } from '../controllers/resumeController.js';

const router = Router();

router.post(
  '/analyze',
  requireAuth,
  uploadResume.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'jobDescriptionFile', maxCount: 1 },
  ]),
  analyzeResume
);

export default router;
