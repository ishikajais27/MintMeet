const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Event = require('../models/Event')
const Attendee = require('../models/Attendee')
const Transaction = require('../models/Transaction')

// Mock the external dependencies
// jest.mock('../utils/verbwire')
// jest.mock('../utils/emailService')
// jest.mock('child_process', () => require('./__mocks__/child_process'))
jest.mock('../utils/verbwire', () => ({
  mintNFT: jest.fn().mockResolvedValue({
    success: true,
    data: {
      transaction_id: 'mock-transaction-123',
      nft_token_id: 'mock-token-456',
      transaction_hash: '0xmockhash123',
    },
  }),
  batchMintNFTs: jest.fn().mockResolvedValue({
    success: true,
    data: { batch_id: 'mock-batch-789' },
  }),
}))

jest.mock('../utils/emailService', () => ({
  sendBadgeEmail: jest.fn().mockResolvedValue(true),
}))

jest.mock('child_process', () => ({
  spawn: jest.fn().mockImplementation(() => ({
    stdout: {
      on: jest.fn(
        (event, callback) => event === 'data' && callback('mock-badge-path.png')
      ),
    },
    stderr: { on: jest.fn() },
    on: jest.fn((event, callback) => event === 'close' && callback(0)),
  })),
}))

describe('Minting API Tests', () => {
  let testEvent
  let testAttendee

  beforeEach(async () => {
    // Create a test event
    testEvent = await Event.create({
      name: 'Test Event for Minting',
      date: new Date('2025-01-01'),
      organizer: 'Test Organizer',
      templateImage: '/uploads/images/test-image.png',
    })

    // Create a test attendee with wallet address
    testAttendee = await Attendee.create({
      name: 'Minting Test Attendee',
      email: 'minting@example.com',
      eventId: testEvent._id,
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Test wallet
      hasAttended: true,
    })
  })

  afterEach(async () => {
    await Transaction.deleteMany()
    await Attendee.deleteMany()
    await Event.deleteMany()
    jest.clearAllMocks()
  })

  describe('POST /api/mint/attendee/:attendeeId', () => {
    it('should initiate minting process for attendee', async () => {
      const response = await request(app)
        .post(`/api/mint/attendee/${testAttendee._id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('Badge minted successfully')

      // Verify the attendee was updated
      const updatedAttendee = await Attendee.findById(testAttendee._id)
      expect(updatedAttendee.hasReceivedBadge).toBe(true)
      expect(updatedAttendee.nftTokenId).toBe('mock-token-456')
    })

    it('should return error for attendee without wallet address', async () => {
      // Create attendee without wallet
      const noWalletAttendee = await Attendee.create({
        name: 'No Wallet Attendee',
        email: 'nowallet@example.com',
        eventId: testEvent._id,
        hasAttended: true,
        // No walletAddress field
      })

      const response = await request(app)
        .post(`/api/mint/attendee/${noWalletAttendee._id}`)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('does not have a wallet address')
    })

    it('should return error for attendee who already received badge', async () => {
      // Create attendee who already has a badge
      const alreadyHasBadgeAttendee = await Attendee.create({
        name: 'Has Badge Attendee',
        email: 'hasbadge@example.com',
        eventId: testEvent._id,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        hasAttended: true,
        hasReceivedBadge: true,
        badgeMintedAt: new Date(),
      })

      const response = await request(app)
        .post(`/api/mint/attendee/${alreadyHasBadgeAttendee._id}`)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Badge already minted')
    })
  })

  describe('GET /api/mint/status/:eventId', () => {
    it('should get minting status for event', async () => {
      // Create test transaction
      await Transaction.create({
        eventId: testEvent._id,
        attendeeId: testAttendee._id,
        type: 'mint',
        status: 'completed',
        verbwireTransactionId: 'mock-transaction-123',
        nftTokenId: 'mock-token-456',
        transactionHash: '0xmockhash123',
      })

      const response = await request(app)
        .get(`/api/mint/status/${testEvent._id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.summary.total).toBe(1)
      expect(response.body.data.summary.completed).toBe(1)
      expect(response.body.data.transactions.length).toBe(1)
    })

    it('should return empty status for event with no transactions', async () => {
      const response = await request(app)
        .get(`/api/mint/status/${testEvent._id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.summary.total).toBe(0)
      expect(response.body.data.transactions.length).toBe(0)
    })
  })
})
