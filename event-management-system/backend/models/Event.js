const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify event category'],
    enum: [
      'conference',
      'workshop',
      'seminar',
      'networking',
      'concert',
      'sports',
      'exhibition',
      'webinar',
      'party',
      'charity',
      'other'
    ]
  },
  type: {
    type: String,
    enum: ['physical', 'virtual', 'hybrid'],
    default: 'physical'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  images: [{
    url: { type: String, required: true },
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  venue: {
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    capacity: Number,
    amenities: [String]
  },
  virtualDetails: {
    platform: String,
    meetingLink: String,
    meetingId: String,
    password: String,
    instructions: String
  },
  dateTime: {
    start: {
      type: Date,
      required: [true, 'Please provide event start date and time']
    },
    end: {
      type: Date,
      required: [true, 'Please provide event end date and time']
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free'
    },
    amount: {
      type: Number,
      min: 0,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    earlyBird: {
      enabled: { type: Boolean, default: false },
      discount: Number,
      deadline: Date
    }
  },
  capacity: {
    total: {
      type: Number,
      required: [true, 'Please specify total capacity']
    },
    registered: {
      type: Number,
      default: 0
    },
    waitlist: {
      type: Number,
      default: 0
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coOrganizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  speakers: [{
    name: { type: String, required: true },
    bio: String,
    avatar: String,
    title: String,
    company: String,
    socialLinks: {
      linkedin: String,
      twitter: String
    }
  }],
  agenda: [{
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    speaker: String,
    duration: Number
  }],
  tags: [String],
  requirements: [String],
  benefits: [String],
  sponsors: [{
    name: String,
    logo: String,
    website: String,
    tier: {
      type: String,
      enum: ['platinum', 'gold', 'silver', 'bronze']
    }
  }],
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  settings: {
    allowWaitlist: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    sendReminders: { type: Boolean, default: true },
    collectAdditionalInfo: { type: Boolean, default: false },
    additionalFields: [{
      field: String,
      required: Boolean,
      type: { type: String, enum: ['text', 'email', 'number', 'select'] }
    }]
  },
  analytics: {
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  },
  feedback: {
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
eventSchema.index({ category: 1, 'dateTime.start': 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ 'venue.city': 1 });
eventSchema.index({ tags: 1 });

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  return this.capacity.total - this.capacity.registered;
});

// Pre-save middleware to set primary image
eventSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
    this.images[0].isPrimary = true;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
