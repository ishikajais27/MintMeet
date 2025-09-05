const axios = require('axios')
const verbwireConfig = require('../config/verbwire')
const { generateApiResponse } = require('./helpers')

// Initialize axios instance with Verbwire config
const verbwireAPI = axios.create({
  baseURL: verbwireConfig.baseURL,
  headers: verbwireConfig.headers,
})

// Mint single NFT
const mintNFT = async (metadata) => {
  try {
    const response = await verbwireAPI.post(
      verbwireConfig.endpoints.mint,
      metadata
    )

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Error minting NFT:', error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data || error.message,
    }
  }
}

// Batch mint NFTs
const batchMintNFTs = async (batchData) => {
  try {
    const response = await verbwireAPI.post(
      verbwireConfig.endpoints.batchMint,
      batchData
    )

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error(
      'Error batch minting NFTs:',
      error.response?.data || error.message
    )
    return {
      success: false,
      error: error.response?.data || error.message,
    }
  }
}

// Get transaction status
const getTransactionStatus = async (transactionHash) => {
  try {
    const response = await verbwireAPI.get(
      `${verbwireConfig.endpoints.transactions}/${transactionHash}`
    )

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error(
      'Error getting transaction status:',
      error.response?.data || error.message
    )
    return {
      success: false,
      error: error.response?.data || error.message,
    }
  }
}

// Deploy new contract
const deployContract = async (contractData) => {
  try {
    const response = await verbwireAPI.post(
      verbwireConfig.endpoints.deploy,
      contractData
    )

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error(
      'Error deploying contract:',
      error.response?.data || error.message
    )
    return {
      success: false,
      error: error.response?.data || error.message,
    }
  }
}

module.exports = {
  mintNFT,
  batchMintNFTs,
  getTransactionStatus,
  deployContract,
}
