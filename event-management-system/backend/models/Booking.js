const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'waitlisted', 'checked-in'],
    default: 'pending'
  },
  ticketType: {
    type: String,
    enum: ['regular', 'early-bird', 'vip', 'student', 'group'],
    default: 'regular'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    paymentId: String,
    paymentMethod: String,
    transactionId: String,
    paidAt: Date,
    refundId: String,
    refundedAt: Date
  },
  attendeeInfo: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    dietary: String,
    specialRequests: String,
    checkedIn: { type: Boolean, default: false },
    checkInTime: Date
  }],
  additionalInfo: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  qrCode: String,
  confirmationCode: {
    type: String,
    unique: true
  },
  notes: String,
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin', 'api'],
    default: 'web'
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    submittedAt: Date
  },
  remindersSent: [{
    type: { type: String, enum: ['email', 'sms'] },
    sentAt: Date,
    status: String
  }]
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ event: 1, user: 1 }, { unique: true });
bookingSchema.index({ status: 1 });
bookingSchema.index({ confirmationCode: 1 });
bookingSchema.index({ 'paymentDetails.paymentId': 1 });

// Generate confirmation code before saving
bookingSchema.pre('save', async function(next) {
  if (!this.confirmationCode) {
    this.confirmationCode = Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
