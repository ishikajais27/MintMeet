// const mongoose = require('mongoose')

// const transactionSchema = new mongoose.Schema({
//   eventId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Event',
//     required: [true, 'Event reference is required'],
//   },
//   attendeeId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Attendee',
//     required: [true, 'Attendee reference is required'],
//   },
//   type: {
//     type: String,
//     enum: ['mint', 'transfer', 'batch_mint'],
//     required: [true, 'Transaction type is required'],
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'processing', 'completed', 'failed'],
//     default: 'pending',
//   },
//   verbwireTransactionId: {
//     type: String,
//     default: null,
//   },
//   nftTokenId: {
//     type: String,
//     default: null,
//   },
//   nftContractAddress: {
//     type: String,
//     default: null,
//   },
//   transactionHash: {
//     type: String,
//     default: null,
//   },
//   errorMessage: {
//     type: String,
//     default: null,
//   },
//   metadata: {
//     type: mongoose.Schema.Types.Mixed,
//     default: {},
//   },
//   initiatedAt: {
//     type: Date,
//     default: Date.now,
//   },
//   completedAt: {
//     type: Date,
//     default: null,
//   },
// })

// // Index for better query performance
// transactionSchema.index({ eventId: 1, attendeeId: 1 })
// transactionSchema.index({ status: 1 })
// transactionSchema.index({ initiatedAt: 1 })

// module.exports = mongoose.model('Transaction', transactionSchema)
const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event reference is required'],
  },
  attendeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendee',
    required: [true, 'Attendee reference is required'],
  },
  type: {
    type: String,
    enum: ['mint', 'transfer', 'batch_mint'],
    required: [true, 'Transaction type is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  verbwireTransactionId: {
    type: String,
    default: null,
  },
  nftTokenId: {
    type: String,
    default: null,
  },
  nftContractAddress: {
    type: String,
    default: null,
  },
  transactionHash: {
    type: String,
    default: null,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  initiatedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
})

// Index for better query performance
transactionSchema.index({ eventId: 1, attendeeId: 1 })
transactionSchema.index({ status: 1 })
transactionSchema.index({ initiatedAt: 1 })

// Virtual for transaction duration
transactionSchema.virtual('duration').get(function () {
  if (this.initiatedAt && this.completedAt) {
    return this.completedAt - this.initiatedAt
  }
  return null
})

// Method to mark transaction as completed
transactionSchema.methods.markCompleted = function (transactionData = {}) {
  this.status = 'completed'
  this.completedAt = new Date()

  if (transactionData.verbwireTransactionId) {
    this.verbwireTransactionId = transactionData.verbwireTransactionId
  }
  if (transactionData.nftTokenId) {
    this.nftTokenId = transactionData.nftTokenId
  }
  if (transactionData.nftContractAddress) {
    this.nftContractAddress = transactionData.nftContractAddress
  }
  if (transactionData.transactionHash) {
    this.transactionHash = transactionData.transactionHash
  }
  if (transactionData.metadata) {
    this.metadata = transactionData.metadata
  }

  return this.save()
}

// Method to mark transaction as failed
transactionSchema.methods.markFailed = function (errorMessage) {
  this.status = 'failed'
  this.errorMessage = errorMessage
  this.completedAt = new Date()
  return this.save()
}

// Static method to get transactions by status
transactionSchema.statics.findByStatus = function (status) {
  return this.find({ status })
}

// Static method to get failed transactions for retry
transactionSchema.statics.getFailedTransactions = function (hours = 24) {
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000)
  return this.find({
    status: 'failed',
    initiatedAt: { $gte: cutoffTime },
  })
}

// Transform output to remove version and convert to JSON friendly format
transactionSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('Transaction', transactionSchema)
