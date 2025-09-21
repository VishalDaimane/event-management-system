const express = require('express');
const { body } = require('express-validator');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getCategories
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules for event creation/update
const eventValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('category')
    .isIn(['conference', 'workshop', 'seminar', 'networking', 'concert', 'sports', 'exhibition', 'webinar', 'party', 'charity', 'other'])
    .withMessage('Please select a valid category'),
  body('dateTime.start')
    .isISO8601()
    .withMessage('Please provide a valid start date and time'),
  body('dateTime.end')
    .isISO8601()
    .withMessage('Please provide a valid end date and time'),
  body('capacity.total')
    .isInt({ min: 1 })
    .withMessage('Total capacity must be at least 1')
];

// Public routes
router.get('/', getEvents);
router.get('/categories', getCategories);
router.get('/:id', getEvent);

// Protected routes
router.use(protect);

router.get('/organizer/me', getMyEvents);
router.post('/', authorize('organizer', 'admin'), eventValidation, createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
