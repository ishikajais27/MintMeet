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

// Real Verbwire API implementation - FIXED FORMAT
const realMintNFT = async (metadata) => {
  try {
    console.log('🔐 REAL: Attempting real Verbwire API call')

    // Log the API key status for debugging
    console.log('API Key configured:', !!verbwireConfig.headers['X-API-Key'])
    console.log(
      'API Key starts with sk_:',
      verbwireConfig.headers['X-API-Key']?.startsWith('sk_')
    )

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
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        attributes: metadata.attributes || [],
      }),
      recipientAddress: metadata.recipientAddress,
    }

    console.log(
      'Sending to Verbwire:',
      JSON.stringify(verbwireRequest, null, 2)
    )

    const response = await api.post(
      verbwireConfig.endpoints.mint,
      verbwireRequest
    )

    console.log('✅ Verbwire response received:', response.data)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('❌ Verbwire error details:')

    // Get the actual error from Verbwire
    let errorMessage = 'Unknown error'
    let statusCode = error.response?.status

    if (error.response?.data) {
      console.error(
        'Error response data:',
        JSON.stringify(error.response.data, null, 2)
      )
      errorMessage =
        error.response.data.message || JSON.stringify(error.response.data)
    } else if (error.request) {
      console.error('No response received:', error.request)
      errorMessage = 'No response from Verbwire API'
    } else {
      console.error('Error message:', error.message)
      errorMessage = error.message
    }

    console.error('Status code:', statusCode)

    return {
      success: false,
      error: errorMessage,
      status: statusCode,
      data: error.response?.data,
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
    console.error(
      'Connection test error:',
      error.response?.data || error.message
    )
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
