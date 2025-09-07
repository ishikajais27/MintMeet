// // utils/verbwireDiscovery.js
// const axios = require('axios')
// const verbwireConfig = require('../config/verbwire')

// class VerbwireDiscovery {
//   constructor() {
//     this.baseURL = verbwireConfig.baseURL
//     this.headers = verbwireConfig.headers
//     this.discoveredEndpoints = {}
//   }

//   async discoverEndpoints() {
//     console.log('🔍 Discovering Verbwire API endpoints...')

//     const testEndpoints = [
//       // Common Verbwire endpoints
//       '/nft/mint',
//       '/nft/mint/quickMint',
//       '/nft/mint/mintFromMetadata',
//       '/mint/nft',
//       '/mint/quick',
//       '/api/nft/mint',
//       '/v1/nft/mint',

//       // Test endpoints that should always work
//       '/nft/data/networks',
//       '/nft/data/chains',
//       '/user/wallet',
//       '/',
//     ]

//     for (const endpoint of testEndpoints) {
//       try {
//         console.log(`Testing: ${endpoint}`)
//         const response = await axios.options(`${this.baseURL}${endpoint}`, {
//           headers: this.headers,
//           timeout: 5000,
//         })

//         if (response.status === 200) {
//           console.log(`✅ Found: ${endpoint}`)
//           this.discoveredEndpoints[endpoint] = true
//         }
//       } catch (error) {
//         // Silently continue - endpoint doesn't exist or not allowed
//       }
//     }

//     return this.discoveredEndpoints
//   }

//   async testApiKey() {
//     try {
//       // Test with a simple endpoint that should work if API key is valid
//       const response = await axios.get(`${this.baseURL}/nft/data/networks`, {
//         headers: this.headers,
//         timeout: 10000,
//       })

//       return {
//         valid: true,
//         message: 'API key is valid',
//         data: response.data,
//       }
//     } catch (error) {
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         return {
//           valid: false,
//           message: 'Invalid API key or insufficient permissions',
//         }
//       }

//       return {
//         valid: false,
//         message: 'Cannot verify API key - endpoint may not exist',
//       }
//     }
//   }

//   async getApiInfo() {
//     try {
//       const response = await axios.get(this.baseURL, {
//         headers: this.headers,
//         timeout: 5000,
//       })

//       return {
//         success: true,
//         data: response.data,
//         headers: response.headers,
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message,
//       }
//     }
//   }
// }

// module.exports = VerbwireDiscovery
// utils/verbwireDiscovery.js
const axios = require('axios')
const verbwireConfig = require('../config/verbwire')

class VerbwireDiscovery {
  constructor() {
    this.api = axios.create({
      baseURL: verbwireConfig.baseURL,
      headers: verbwireConfig.headers,
      timeout: 10000,
    })
  }

  async testApiKey() {
    try {
      const response = await this.api.get('/nft/data/networks')
      return {
        valid: true,
        message: 'API key is valid',
        data: response.data,
      }
    } catch (error) {
      return {
        valid: false,
        message: error.response?.data?.message || error.message,
        error: error,
      }
    }
  }

  async discoverEndpoints() {
    const endpointsToTest = [
      '/nft/mint/quickMintFromMetadata',
      '/nft/store/metadata',
      '/nft/data/networks',
      '/nft/data/owned',
      '/nft/userOps/deployedContracts',
    ]

    const results = {}

    for (const endpoint of endpointsToTest) {
      try {
        const response = await this.api.options(endpoint)
        results[endpoint] = {
          available: true,
          methods: response.headers['allow'] || 'Unknown',
        }
      } catch (error) {
        results[endpoint] = {
          available: false,
          error: error.response?.statusText || error.message,
        }
      }
    }

    return results
  }

  async getApiInfo() {
    try {
      const response = await this.api.get('/')
      return {
        success: true,
        data: {
          status: response.status,
          headers: response.headers,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}

module.exports = VerbwireDiscovery
