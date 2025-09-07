// utils/verbwireSmartService.js
const VerbwireDiscovery = require('./verbwireDiscovery')
const verbwireConfig = require('../config/verbwire')

class VerbwireSmartService {
  constructor() {
    this.discovery = new VerbwireDiscovery()
    this.useMockMode = verbwireConfig.useMockMode
    this.validApiKey = false
    this.availableEndpoints = {}
  }

  async initialize() {
    if (this.useMockMode) {
      console.log('🔧 Using mock mode (no API key configured)')
      return
    }

    console.log('🔧 Initializing Verbwire service...')

    // Test API key first
    const keyTest = await this.discovery.testApiKey()
    this.validApiKey = keyTest.valid

    if (!this.validApiKey) {
      console.warn('⚠️ API key test failed:', keyTest.message)
      console.warn('🔧 Falling back to mock mode')
      this.useMockMode = true
      return
    }

    console.log('✅ API key is valid')

    // Discover endpoints
    this.availableEndpoints = await this.discovery.discoverEndpoints()

    if (Object.keys(this.availableEndpoints).length === 0) {
      console.warn('⚠️ No API endpoints discovered')
      console.warn('🔧 Falling back to mock mode')
      this.useMockMode = true
    } else {
      console.log(
        '✅ Discovered endpoints:',
        Object.keys(this.availableEndpoints)
      )
    }
  }

  async mintNFT(metadata) {
    // Always use mock mode if configured or if API discovery failed
    if (this.useMockMode) {
      return this.mockMintNFT(metadata)
    }

    try {
      return await this.realMintNFT(metadata)
    } catch (error) {
      console.warn('Real API failed, falling back to mock:', error.message)
      return this.mockMintNFT(metadata)
    }
  }

  async mockMintNFT(metadata) {
    console.log('🔧 MOCK: Minting NFT')
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      success: true,
      data: {
        transaction_id: 'mock_tx_' + Math.random().toString(36).substr(2, 9),
        nft_token_id: 'mock_nft_' + Math.random().toString(36).substr(2, 9),
        transaction_hash: '0x' + Math.random().toString(36).substr(2, 64),
      },
      isMock: true,
    }
  }

  async realMintNFT(metadata) {
    const axios = require('axios')

    // Try discovered endpoints in order
    const endpointsToTry = [
      '/nft/mint/mintFromMetadata',
      '/nft/mint/quickMint',
      '/nft/mint',
      '/mint/nft',
    ]

    for (const endpoint of endpointsToTry) {
      if (this.availableEndpoints[endpoint]) {
        try {
          console.log(`Trying endpoint: ${endpoint}`)
          const response = await axios.post(
            `${verbwireConfig.baseURL}${endpoint}`,
            metadata,
            {
              headers: verbwireConfig.headers,
              timeout: 30000,
            }
          )

          console.log(`✅ Success with endpoint: ${endpoint}`)
          return {
            success: true,
            data: response.data,
            isMock: false,
            endpointUsed: endpoint,
          }
        } catch (error) {
          console.warn(`Endpoint ${endpoint} failed:`, error.message)
          continue
        }
      }
    }

    throw new Error('All discovered endpoints failed')
  }
}

// Create singleton instance
const verbwireService = new VerbwireSmartService()

// Initialize on import
verbwireService.initialize().catch(console.error)

module.exports = verbwireService
