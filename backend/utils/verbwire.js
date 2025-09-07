const verbwireConfig = require('../config/verbwire')
const axios = require('axios')

// Mock implementation for development
const mockMintNFT = async (metadata) => {
  console.log('🔧 MOCK: Minting NFT (development mode)')
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return {
    success: true,
    data: {
      transaction_id: 'mock_tx_' + Math.random().toString(36).substr(2, 9),
      nft_token_id: 'mock_nft_' + Math.random().toString(36).substr(2, 9),
      transaction_hash: '0x' + Math.random().toString(36).substr(2, 64),
    },
  }
}

// Real Verbwire API implementation
const realMintNFT = async (metadata) => {
  try {
    const axiosConfig = {
      baseURL: verbwireConfig.baseURL,
      headers: verbwireConfig.headers,
      timeout: 30000,
    }

    const api = axios.create(axiosConfig)

    // CORRECT VERBWIRE REQUEST FORMAT
    const verbwireRequest = {
      allowPlatformToOperateToken: true,
      chain: verbwireConfig.defaultChain,
      data: JSON.stringify({
        name: metadata.metadata.name,
        description: metadata.metadata.description,
        image: metadata.metadata.image,
        attributes: metadata.metadata.attributes || [],
      }),
      recipientAddress: metadata.recipientAddress,
    }

    console.log('Minting request:', JSON.stringify(verbwireRequest, null, 2))

    const response = await api.post(
      verbwireConfig.endpoints.mint,
      verbwireRequest
    )

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Verbwire error:', error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    }
  }
}

// Main export function
const mintNFT = async (metadata) => {
  if (verbwireConfig.useMockMode) {
    return await mockMintNFT(metadata)
  } else {
    return await realMintNFT(metadata)
  }
}

// Test connection
const testConnection = async () => {
  if (verbwireConfig.useMockMode) {
    return {
      success: true,
      message: 'Mock Verbwire connection successful (development mode)',
    }
  }

  try {
    const axiosConfig = {
      baseURL: verbwireConfig.baseURL,
      headers: verbwireConfig.headers,
      timeout: 10000,
    }

    const api = axios.create(axiosConfig)

    const response = await api.get(verbwireConfig.endpoints.networks)

    return {
      success: true,
      message: 'Verbwire API connection successful',
      data: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    }
  }
}

module.exports = {
  mintNFT,
  testConnection,
}
