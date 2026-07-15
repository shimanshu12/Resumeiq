import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  listReports,
  getReport,
  deleteReport,
  downloadReportPdf,
  getDashboardSummary,
} from '../controllers/reportController.js';

const router = Router();

router.get('/summary', requireAuth, getDashboardSummary);
router.get('/:id/pdf', requireAuth, downloadReportPdf);
router.get('/:id', requireAuth, getReport);
router.delete('/:id', requireAuth, deleteReport);
router.get('/', requireAuth, listReports);

export default router;
