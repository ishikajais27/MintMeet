const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
require('dotenv').config()

const app = express()

// Import configurations
const { MONGODB_URI, FRONTEND_URL } = require('./config/constants')

// Import middleware
const { validateEvent, validateAttendee } = require('./middleware/validation')

// Import routes
const eventRoutes = require('./routes/eventRoutes')
const attendeeRoutes = require('./routes/attendeeRoutes')
const mintRoutes = require('./routes/mintRoutes') // Add mint routes

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err))
}
// Middleware
app.use(helmet())
app.use(morgan('combined'))
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Basic route for health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EventProof API is running successfully',
    timestamp: new Date().toISOString(),
  })
})

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to EventProof API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      events: '/api/events',
      attendees: '/api/attendees',
      mint: '/api/mint',
    },
  })
})

// API routes
app.use('/api/events', eventRoutes)
app.use('/api/attendees', attendeeRoutes)
app.use('/api/mint', mintRoutes) // Add mint routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack)

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: 'Duplicate Entry',
      error: `${field} already exists`,
    })
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: 'The provided ID is not valid',
    })
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

module.exports = app
