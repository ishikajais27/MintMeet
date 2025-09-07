const express = require('express')
const router = express.Router()
const {
  testVerbwireConnection,
  mintBadgeForAttendee,
  batchMintBadges,
  getMintingStatus,
} = require('../controllers/mintController')
const { generateApiResponse } = require('../utils/helpers')
const verbwireConfig = require('../config/verbwire')

// Test Verbwire connection
router.get('/test-connection', testVerbwireConnection)

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
      testConnection: 'GET /test-connection',
      mintSingle: 'POST /attendee/:attendeeId',
      mintBatch: 'POST /batch/:eventId',
      getStatus: 'GET /status/:eventId',
      diagnostics: 'GET /diagnostics',
      testMint: 'POST /debug/test-mint',
    },
  })
})

// Diagnostics endpoint
router.get('/diagnostics', async (req, res) => {
  try {
    const diagnostics = {
      apiKeyConfigured: !!process.env.VERBWIRE_API_KEY,
      apiKeyLength: process.env.VERBWIRE_API_KEY
        ? process.env.VERBWIRE_API_KEY.length
        : 0,
      apiKeyStartsWithSk: process.env.VERBWIRE_API_KEY
        ? process.env.VERBWIRE_API_KEY.startsWith('sk_')
        : false,
      apiKeyPreview: process.env.VERBWIRE_API_KEY
        ? process.env.VERBWIRE_API_KEY.substring(0, 10) + '...'
        : 'Not set',
      baseURL: verbwireConfig.baseURL,
      defaultChain: verbwireConfig.defaultChain,
      useMockMode: verbwireConfig.useMockMode,
      environment: process.env.NODE_ENV || 'development',
    }

    res
      .status(200)
      .json(generateApiResponse(true, 'Diagnostics completed', diagnostics))
  } catch (error) {
    res
      .status(500)
      .json(
        generateApiResponse(false, 'Diagnostics failed', null, error.message)
      )
  }
})

// Test API key endpoint
router.get('/test-api-key', async (req, res) => {
  try {
    const axios = require('axios')

    // Test the API key by making a simple request
    const response = await axios.get(
      `${verbwireConfig.baseURL}/nft/data/networks`,
      {
        headers: verbwireConfig.headers,
        timeout: 10000,
      }
    )

    res.status(200).json({
      success: true,
      message: 'API key is valid',
      data: response.data,
    })
  } catch (error) {
    console.error('API key test failed:', error.response?.data || error.message)

    res.status(400).json({
      success: false,
      message: 'API key test failed',
      error: error.response?.data || error.message,
      hint: 'Check your VERBWIRE_API_KEY in .env file',
    })
  }
})
// Add to your mintRoutes.js or create a new route
router.get('/test-email', async (req, res) => {
  try {
    const { testEmailConfig } = require('../utils/emailService')
    const result = await testEmailConfig()

    res
      .status(result.success ? 200 : 400)
      .json(
        generateApiResponse(
          result.success,
          result.message || result.error,
          result
        )
      )
  } catch (error) {
    res
      .status(500)
      .json(
        generateApiResponse(false, 'Email test failed', null, error.message)
      )
  }
})
module.exports = router
