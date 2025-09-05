// const request = require('supertest')
// const mongoose = require('mongoose')
// const app = require('../app')
// const Event = require('../models/Event')

// // Mock the app's MongoDB connection since we're using in-memory DB
// jest.mock('../app', () => {
//   const express = require('express')
//   const app = express()

//   // Add middleware and routes but skip MongoDB connection
//   app.use(require('helmet')())
//   app.use(require('morgan')('combined'))
//   app.use(
//     require('cors')({
//       origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//       credentials: true,
//     })
//   )
//   app.use(require('express').json({ limit: '10mb' }))
//   app.use(require('express').urlencoded({ extended: true, limit: '10mb' }))

//   // Serve static files
//   app.use(
//     '/uploads',
//     require('express').static(require('path').join(__dirname, '../uploads'))
//   )

//   // Routes
//   app.use('/api/events', require('../routes/eventRoutes'))
//   app.use('/api/attendees', require('../routes/attendeeRoutes'))

//   // Health check
//   app.get('/api/health', (req, res) => {
//     res.status(200).json({
//       success: true,
//       message: 'EventProof API is running successfully',
//       timestamp: new Date().toISOString(),
//     })
//   })

//   return app
// })

// describe('Event API Tests', () => {
//   describe('POST /api/events', () => {
//     it('should create a new event', async () => {
//       const eventData = {
//         name: 'Test Event',
//         description: 'A test event',
//         date: '2025-12-31T23:59:59.999Z',
//         organizer: 'Test Organizer',
//       }

//       const response = await request(app)
//         .post('/api/events')
//         .send(eventData)
//         .expect(201)

//       expect(response.body.success).toBe(true)
//       expect(response.body.data.name).toBe(eventData.name)
//       expect(response.body.data.organizer).toBe(eventData.organizer)
//     })

//     it('should return error for invalid event data', async () => {
//       const invalidEventData = {
//         name: '', // Empty name
//         date: 'invalid-date', // Invalid date
//       }

//       const response = await request(app)
//         .post('/api/events')
//         .send(invalidEventData)
//         .expect(400)

//       expect(response.body.success).toBe(false)
//       expect(response.body.errors).toBeDefined()
//     })
//   })

//   describe('GET /api/events', () => {
//     it('should get all events', async () => {
//       // Create test events
//       await Event.create([
//         {
//           name: 'Event 1',
//           date: new Date('2025-01-01'),
//           organizer: 'Organizer 1',
//         },
//         {
//           name: 'Event 2',
//           date: new Date('2025-02-01'),
//           organizer: 'Organizer 2',
//         },
//       ])

//       const response = await request(app).get('/api/events').expect(200)

//       expect(response.body.success).toBe(true)
//       expect(response.body.data.length).toBe(2)
//     })
//   })
// })
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Event = require('../models/Event')

// Remove the manual MongoDB connection - the setup.js will handle it
// Remove the jest.mock section entirely

describe('Event API Tests', () => {
  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const eventData = {
        name: 'Test Event',
        description: 'A test event',
        date: '2025-12-31T23:59:59.999Z',
        organizer: 'Test Organizer',
      }

      const response = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe(eventData.name)
      expect(response.body.data.organizer).toBe(eventData.organizer)
    })

    it('should return error for invalid event data', async () => {
      const invalidEventData = {
        name: '', // Empty name
        date: 'invalid-date', // Invalid date
      }

      const response = await request(app)
        .post('/api/events')
        .send(invalidEventData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })
  })

  describe('GET /api/events', () => {
    it('should get all events', async () => {
      // Create test events
      await Event.create([
        {
          name: 'Event 1',
          date: new Date('2025-01-01'),
          organizer: 'Organizer 1',
        },
        {
          name: 'Event 2',
          date: new Date('2025-02-01'),
          organizer: 'Organizer 2',
        },
      ])

      const response = await request(app).get('/api/events').expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.length).toBe(2)
    })
  })
})
