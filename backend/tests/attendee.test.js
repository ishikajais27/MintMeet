// const request = require('supertest')
// const mongoose = require('mongoose')
// const app = require('../app')
// const Event = require('../models/Event')
// const Attendee = require('../models/Attendee')

// describe('Attendee API Tests', () => {
//   let testEvent

//   beforeAll(async () => {
//     await mongoose.connect(
//       process.env.MONGODB_URI_TEST ||
//         'mongodb://localhost:27017/eventproof-test'
//     )
//   })

//   beforeEach(async () => {
//     // Create a test event for attendee registration
//     testEvent = await Event.create({
//       name: 'Test Event for Attendees',
//       date: new Date('2025-01-01'),
//       organizer: 'Test Organizer',
//     })
//   })

//   afterEach(async () => {
//     await Attendee.deleteMany()
//     await Event.deleteMany()
//   })

//   afterAll(async () => {
//     await mongoose.connection.close()
//   })

//   describe('POST /api/attendees', () => {
//     it('should register a new attendee', async () => {
//       const attendeeData = {
//         name: 'John Doe',
//         email: 'john@example.com',
//         eventId: testEvent._id,
//       }

//       const response = await request(app)
//         .post('/api/attendees')
//         .send(attendeeData)
//         .expect(201)

//       expect(response.body.success).toBe(true)
//       expect(response.body.data.name).toBe(attendeeData.name)
//       expect(response.body.data.email).toBe(attendeeData.email)
//     })

//     it('should prevent duplicate email registration for same event', async () => {
//       const attendeeData = {
//         name: 'John Doe',
//         email: 'john@example.com',
//         eventId: testEvent._id,
//       }

//       // First registration
//       await request(app).post('/api/attendees').send(attendeeData).expect(201)

//       // Second registration with same email
//       const response = await request(app)
//         .post('/api/attendees')
//         .send(attendeeData)
//         .expect(409)

//       expect(response.body.success).toBe(false)
//     })
//   })

//   describe('GET /api/attendees/event/:eventId', () => {
//     it('should get attendees for an event', async () => {
//       // Create test attendees
//       await Attendee.create([
//         {
//           name: 'Attendee 1',
//           email: 'attendee1@example.com',
//           eventId: testEvent._id,
//         },
//         {
//           name: 'Attendee 2',
//           email: 'attendee2@example.com',
//           eventId: testEvent._id,
//         },
//       ])

//       const response = await request(app)
//         .get(`/api/attendees/event/${testEvent._id}`)
//         .expect(200)

//       expect(response.body.success).toBe(true)
//       expect(response.body.data.length).toBe(2)
//     })
//   })
// })
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Event = require('../models/Event')
const Attendee = require('../models/Attendee')

describe('Attendee API Tests', () => {
  let testEvent

  // REMOVE the beforeAll connection - setup.js handles it

  beforeEach(async () => {
    // Create a test event for attendee registration
    testEvent = await Event.create({
      name: 'Test Event for Attendees',
      date: new Date('2025-01-01'),
      organizer: 'Test Organizer',
    })
  })

  // REMOVE afterAll connection close - setup.js handles it

  afterEach(async () => {
    await Attendee.deleteMany()
    await Event.deleteMany()
  })

  describe('POST /api/attendees', () => {
    it('should register a new attendee', async () => {
      const attendeeData = {
        name: 'John Doe',
        email: 'john@example.com',
        eventId: testEvent._id,
      }

      const response = await request(app)
        .post('/api/attendees')
        .send(attendeeData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe(attendeeData.name)
      expect(response.body.data.email).toBe(attendeeData.email)
    })

    it('should prevent duplicate email registration for same event', async () => {
      const attendeeData = {
        name: 'John Doe',
        email: 'john@example.com',
        eventId: testEvent._id,
      }

      // First registration
      await request(app).post('/api/attendees').send(attendeeData).expect(201)

      // Second registration with same email
      const response = await request(app)
        .post('/api/attendees')
        .send(attendeeData)
        .expect(409)

      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/attendees/event/:eventId', () => {
    it('should get attendees for an event', async () => {
      // Create test attendees
      await Attendee.create([
        {
          name: 'Attendee 1',
          email: 'attendee1@example.com',
          eventId: testEvent._id,
        },
        {
          name: 'Attendee 2',
          email: 'attendee2@example.com',
          eventId: testEvent._id,
        },
      ])

      const response = await request(app)
        .get(`/api/attendees/event/${testEvent._id}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.length).toBe(2)
    })
  })
})
