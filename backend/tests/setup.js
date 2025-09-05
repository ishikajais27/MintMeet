const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer

beforeAll(async () => {
  // Create in-memory MongoDB server for testing
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()

  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

afterAll(async () => {
  // Disconnect and stop the server
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany()
  }
})
