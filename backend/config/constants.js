const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/eventproof',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  VERBWIRE_API_KEY: process.env.VERBWIRE_API_KEY,
  VERBWIRE_BASE_URL:
    process.env.VERBWIRE_BASE_URL || 'https://api.verbwire.com/v1',
}
