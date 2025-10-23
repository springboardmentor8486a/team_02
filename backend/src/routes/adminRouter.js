import express from 'express';
import { getAdminReports, exportReportsData } from '../controllers/admin.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.middleware.js';

const router = express.Router();

// Admin reports routes
router.get('/reports', verifyJWT, verifyAdmin, getAdminReports);
router.get('/reports/export', verifyJWT, verifyAdmin, exportReportsData);

export default router;