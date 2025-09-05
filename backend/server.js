const app = require('./app')
const { PORT } = require('./config/constants')

app.listen(PORT, () => {
  console.log(`EventProof server is running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})
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
