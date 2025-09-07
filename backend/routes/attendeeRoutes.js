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

// IMPORTANT: CSV upload route should be defined BEFORE body parsers
// Process CSV for bulk registration - this should be the first route
router.post(
  '/csv-upload',
  uploadCSV.single('csvFile'),
  handleUploadError,
  processCSV
)

// Add this route for testing uploads
router.post(
  '/test-upload',
  uploadCSV.single('csvFile'),
  handleUploadError,
  (req, res) => {
    try {
      console.log('Test upload received')
      console.log('File:', req.file)
      console.log('Body:', req.body)

      res.status(200).json({
        success: true,
        message: 'Upload test successful',
        file: req.file,
        body: req.body,
      })
    } catch (error) {
      console.error('Test upload error:', error)
      res.status(500).json({
        success: false,
        message: 'Test upload failed',
        error: error.message,
      })
    }
  }
)
// Other routes that use body parsers
router.post('/', validateAttendee, registerAttendee)
router.get('/event/:eventId', getAttendeesByEvent)
router.get('/export/:eventId', exportAttendees)
router.get('/:id', getAttendeeById)
router.put('/:id', updateAttendee)
router.delete('/:id', deleteAttendee)
router.patch('/:id/attendance/toggle', markAttendance)
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
