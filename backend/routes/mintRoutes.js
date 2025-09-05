// const express = require('express')
// const router = express.Router()
// const {
//   mintBadgeForAttendee,
//   batchMintBadges,
//   getMintingStatus,
// } = require('../controllers/mintController')

// // Mint badge for a specific attendee
// router.post('/attendee/:attendeeId', mintBadgeForAttendee)

// // Batch mint badges for an event
// router.post('/batch/:eventId', batchMintBadges)

// // Get minting status for an event
// router.get('/status/:eventId', getMintingStatus)

// module.exports = router
const express = require('express')
const router = express.Router()
const {
  mintBadgeForAttendee,
  batchMintBadges,
  getMintingStatus,
} = require('../controllers/mintController')

// Mint badge for a specific attendee
router.post('/attendee/:attendeeId', mintBadgeForAttendee)

// Batch mint badges for an event
router.post('/batch/:eventId', batchMintBadges)

// Get minting status for an event
router.get('/status/:eventId', getMintingStatus)

// Add a GET handler for the root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Minting API endpoint',
    endpoints: {
      mintSingle: 'POST /attendee/:attendeeId',
      mintBatch: 'POST /batch/:eventId',
      getStatus: 'GET /status/:eventId',
    },
  })
})

module.exports = router
