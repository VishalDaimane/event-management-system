const Event = require('../models/Event');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = { status: 'published' };
    
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    
    if (req.query.type && req.query.type !== 'all') {
      filter.type = req.query.type;
    }
    
    if (req.query.city) {
      filter['venue.city'] = new RegExp(req.query.city, 'i');
    }
    
    if (req.query.search) {
      filter.$or = [
        { title: new RegExp(req.query.search, 'i') },
        { description: new RegExp(req.query.search, 'i') },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }
    
    if (req.query.date) {
      const date = new Date(req.query.date);
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      filter['dateTime.start'] = { $gte: date, $lt: nextDate };
    }
    
    if (req.query.upcoming === 'true') {
      filter['dateTime.start'] = { $gte: new Date() };
    }

    // Build sort object
    let sort = {};
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'date':
          sort = { 'dateTime.start': 1 };
          break;
        case 'popular':
          sort = { 'capacity.registered': -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        default:
          sort = { 'dateTime.start': 1 };
      }
    } else {
      sort = { 'dateTime.start': 1 };
    }

    const events = await Event.find(filter)
      .populate('organizer', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Event.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        events,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalEvents: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching events'
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatar bio')
      .populate('coOrganizers', 'name avatar');

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Increment views
    event.analytics.views += 1;
    await event.save();

    res.json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching event'
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer/Admin)
const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const eventData = {
      ...req.body,
      organizer: req.user.id
    };

    const event = await Event.create(eventData);
    await event.populate('organizer', 'name email avatar');

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error creating event'
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Owner/Admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Check if user owns the event or is admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this event'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email avatar');

    res.json({
      status: 'success',
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error updating event'
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Owner/Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Check if user owns the event or is admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this event'
      });
    }

    // Check if there are confirmed bookings
    const confirmedBookings = await Booking.countDocuments({
      event: req.params.id,
      status: 'confirmed'
    });

    if (confirmedBookings > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete event with confirmed bookings'
      });
    }

    await Event.findByIdAndDelete(req.params.id);
    
    // Delete all bookings for this event
    await Booking.deleteMany({ event: req.params.id });

    res.json({
      status: 'success',
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting event'
    });
  }
};

// @desc    Get events by organizer
// @route   GET /api/events/organizer/me
// @access  Private
const getMyEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = { organizer: req.user.id };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const events = await Event.find(filter)
      .populate('organizer', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        events,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalEvents: total
        }
      }
    });
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching your events'
    });
  }
};

// @desc    Get event categories
// @route   GET /api/events/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = [
      { value: 'conference', label: 'Conference', icon: '🎤' },
      { value: 'workshop', label: 'Workshop', icon: '🛠️' },
      { value: 'seminar', label: 'Seminar', icon: '📚' },
      { value: 'networking', label: 'Networking', icon: '🤝' },
      { value: 'concert', label: 'Concert', icon: '🎵' },
      { value: 'sports', label: 'Sports', icon: '⚽' },
      { value: 'exhibition', label: 'Exhibition', icon: '🖼️' },
      { value: 'webinar', label: 'Webinar', icon: '💻' },
      { value: 'party', label: 'Party', icon: '🎉' },
      { value: 'charity', label: 'Charity', icon: '❤️' },
      { value: 'other', label: 'Other', icon: '📅' }
    ];

    res.json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error fetching categories'
    });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getCategories
};
