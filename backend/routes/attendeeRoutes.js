// const express = require('express')
// const router = express.Router()
// const {
//   registerAttendee,
//   getAttendeesByEvent,
//   getAttendeeById,
//   updateAttendee,
//   deleteAttendee,
//   markAttendance,
//   processCSV,
//   exportAttendees,
// } = require('../controllers/attendeeController')
// const { validateAttendee } = require('../middleware/validation')
// const { uploadCSV, handleUploadError } = require('../middleware/upload')

// // Register a new attendee
// router.post('/', validateAttendee, registerAttendee)

// // Process CSV for bulk registration
// router.post(
//   '/csv-upload',
//   uploadCSV.single('csvFile'),
//   handleUploadError,
//   processCSV
// )

// // Get all attendees for an event
// router.get('/event/:eventId', getAttendeesByEvent)

// // Export attendees to CSV
// router.get('/export/:eventId', exportAttendees)

// // Get a specific attendee by ID
// router.get('/:id', getAttendeeById)

// // Update an attendee
// router.put('/:id', updateAttendee)

// // Delete an attendee
// router.delete('/:id', deleteAttendee)

// // Mark attendance for an attendee
// router.patch('/:id/attendance', markAttendance)

// module.exports = router
const express = require('express')
const router = express.Router()
const {
  registerAttendee,
  getAttendeesByEvent,
  getAttendeeById,
  updateAttendee,
  deleteAttendee,
  markAttendance,
  processCSV,
  exportAttendees,
} = require('../controllers/attendeeController')
const { validateAttendee } = require('../middleware/validation')
const { uploadCSV, handleUploadError } = require('../middleware/upload')

// Register a new attendee
router.post('/', validateAttendee, registerAttendee)

// Process CSV for bulk registration
router.post(
  '/csv-upload',
  uploadCSV.single('csvFile'),
  handleUploadError,
  processCSV
)

// Get all attendees for an event
router.get('/event/:eventId', getAttendeesByEvent)

// Export attendees to CSV
router.get('/export/:eventId', exportAttendees)

// Get a specific attendee by ID
router.get('/:id', getAttendeeById)

// Update an attendee
router.put('/:id', updateAttendee)

// Delete an attendee
router.delete('/:id', deleteAttendee)

// Mark attendance for an attendee
router.patch('/:id/attendance', markAttendance)

// Add a GET handler for the root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Attendees API endpoint',
    endpoints: {
      register: 'POST /',
      bulkUpload: 'POST /csv-upload',
      getByEvent: 'GET /event/:eventId',
      export: 'GET /export/:eventId',
      getById: 'GET /:id',
      update: 'PUT /:id',
      delete: 'DELETE /:id',
      markAttendance: 'PATCH /:id/attendance',
    },
  })
})

module.exports = router
