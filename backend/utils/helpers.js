// Generate standardized API response
const generateApiResponse = (success, message, data = null, error = null) => {
  return {
    success,
    message,
    data,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
    timestamp: new Date().toISOString(),
  }
}

// Generate a unique identifier
const generateUniqueId = (length = 8) => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

// Validate Ethereum wallet address format
const isValidEthereumAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Format date to readable string
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

module.exports = {
  generateApiResponse,
  generateUniqueId,
  isValidEthereumAddress,
  formatDate,
}
// Generate standardized API response
// const generateApiResponse = (success, message, data = null, error = null) => {
//   return {
//     success,
//     message,
//     data,
//     error: process.env.NODE_ENV === 'development' ? error : undefined,
//     timestamp: new Date().toISOString(),
//   }
// }

// // Generate a unique identifier
// const generateUniqueId = (length = 8) => {
//   return Math.random()
//     .toString(36)
//     .substring(2, 2 + length)
// }

// // Validate Ethereum wallet address format
// const isValidEthereumAddress = (address) => {
//   return /^0x[a-fA-F0-9]{40}$/.test(address)
// }

// // Format date to readable string
// const formatDate = (date) => {
//   return new Date(date).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   })
// }

// module.exports = {
//   generateApiResponse,
//   generateUniqueId,
//   isValidEthereumAddress,
//   formatDate,
// }
