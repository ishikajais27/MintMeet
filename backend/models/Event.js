const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [100, 'Event name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  organizer: {
    type: String,
    required: [true, 'Organizer name is required'],
    trim: true,
  },
  templateImage: {
    type: String, // URL or path to the uploaded image
    default: null,
  },
  shareableLink: {
    type: String,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
eventSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

// Generate a shareable link before saving if not provided
eventSchema.pre('save', function (next) {
  if (!this.shareableLink) {
    // Generate a unique identifier for the event
    const uniqueId = Math.random().toString(36).substring(2, 10)
    this.shareableLink = `eventproof-${uniqueId}`
  }
  next()
})

module.exports = mongoose.model('Event', eventSchema)
