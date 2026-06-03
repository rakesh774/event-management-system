import express from 'express';
import { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  getEventSuggestions,
  getEventRecommendations
} from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, createEvent);

router.route('/suggestions').get(getEventSuggestions);
router.route('/recommendations').get(getEventRecommendations);

router.route('/:id')
  .get(getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

export default router;
