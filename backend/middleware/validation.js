const validator = require('validator')

// In middleware/validation.js
const validateEvent = (req, res, next) => {
  const { name, date, organizer } = req.body
  const errors = []

  // Validate name
  if (!name || validator.isEmpty(name)) {
    errors.push('Event name is required')
  } else if (!validator.isLength(name, { min: 1, max: 100 })) {
    errors.push('Event name must be between 1 and 100 characters')
  }

  // Validate date - more flexible date validation
  if (!date) {
    errors.push('Event date is required')
  } else {
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      errors.push('Valid event date is required')
    }
  }

  // Validate organizer
  if (!organizer || validator.isEmpty(organizer)) {
    errors.push('Organizer name is required')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
  }

  next()
}

const validateAttendee = (req, res, next) => {
  const { name, email, eventId } = req.body
  const errors = []

  // Validate name
  if (!name || validator.isEmpty(name)) {
    errors.push('Attendee name is required')
  }

  // Validate email
  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required')
  }

  // Validate eventId
  if (!eventId || !validator.isMongoId(eventId)) {
    errors.push('Valid event ID is required')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
  }

  next()
}

module.exports = {
  validateEvent,
  validateAttendee,
}
