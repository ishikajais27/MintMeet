// const express = require('express')
// const router = express.Router()
// const {
//   createEvent,
//   getAllEvents,
//   getEventById,
//   updateEvent,
//   deleteEvent,
//   uploadEventImage,
// } = require('../controllers/eventController')
// const { validateEvent } = require('../middleware/validation')
// const { uploadImage, handleUploadError } = require('../middleware/upload')

// // Create a new event
// router.post('/', validateEvent, createEvent)

// // Get all events
// router.get('/', getAllEvents)

// // Get a specific event by ID
// router.get('/:id', getEventById)

// // Update an event
// router.put('/:id', validateEvent, updateEvent)

// // Delete an event
// router.delete('/:id', deleteEvent)

// // Upload event image
// router.post(
//   '/:id/image',
//   uploadImage.single('image'),
//   handleUploadError,
//   uploadEventImage
// )

// module.exports = router
const express = require('express')
const router = express.Router()
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  uploadEventImage, // Make sure this is imported
} = require('../controllers/eventController')
const { validateEvent } = require('../middleware/validation')
const { uploadImage, handleUploadError } = require('../middleware/upload')

// Create a new event
router.post('/', validateEvent, createEvent)

// Get all events
router.get('/', getAllEvents)

// Get a specific event by ID
router.get('/:id', getEventById)

// Update an event
router.put('/:id', validateEvent, updateEvent)

// Delete an event
router.delete('/:id', deleteEvent)

// Upload event image
router.post(
  '/:id/image',
  uploadImage.single('image'),
  handleUploadError,
  uploadEventImage // This should now work correctly
)

module.exports = router
