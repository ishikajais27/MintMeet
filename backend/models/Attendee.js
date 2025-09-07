const mongoose = require('mongoose')

const attendeeSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event reference is required'],
  },
  name: {
    type: String,
    required: [true, 'Attendee name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
  },
  walletAddress: {
    type: String,
    trim: true,
    default: null,
  },
  hasRegistered: {
    type: Boolean,
    default: false,
  },
  hasAttended: {
    type: Boolean,
    default: false,
  },
  hasReceivedBadge: {
    type: Boolean,
    default: false,
  },
  nftTokenId: {
    type: String,
    default: null,
  },
  nftTransactionHash: {
    type: String,
    default: null,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  attendedAt: {
    type: Date,
    default: null,
  },
  badgeMintedAt: {
    type: Date,
    default: null,
  },
  badgeImage: {
    type: String, // URL to the generated badge image
    default: null,
  },
})

// Index for better query performance
attendeeSchema.index({ eventId: 1, email: 1 }, { unique: true })
attendeeSchema.index({ walletAddress: 1 })

module.exports = mongoose.model('Attendee', attendeeSchema)
