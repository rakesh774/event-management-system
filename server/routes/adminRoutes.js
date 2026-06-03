import express from 'express';
import { getAdminStats, getEventCreationRequests, updateEventCreationRequest } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/stats').get(protect, admin, getAdminStats);
router.route('/requests').get(protect, admin, getEventCreationRequests);
router.route('/requests/:id').put(protect, admin, updateEventCreationRequest);

export default router;
