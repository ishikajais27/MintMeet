require('dotenv').config()

const VERBWIRE_BASE_URL = 'https://api.verbwire.com/v1'

// Get API key from environment
const apiKey = process.env.VERBWIRE_API_KEY || ''

// Check if API key is valid
const hasValidApiKey = apiKey && apiKey.startsWith('sk_') && apiKey.length > 30

const verbwireConfig = {
  baseURL: VERBWIRE_BASE_URL,
  headers: {
    Accept: 'application/json',
    'X-API-Key': apiKey,
    'Content-Type': 'application/json',
  },
  endpoints: {
    quickMintFromMetadata: '/nft/mint/quickMintFromMetadata',
    uploadMetadata: '/nft/store/metadata',
    uploadFile: '/nft/store/file',
    ownedNFTs: '/nft/data/owned',
    deployedContracts: '/nft/userOps/deployedContracts',
    mintedNFTs: '/nft/userOps/nftsMinted',
    transactions: '/nft/data/transactions',
    // networks: '/nft/data/networks',
    mint: '/nft/mint/quickMintFromMetadata',
    upload: '/nft/store/metadata',
  },
  defaultChain: process.env.VERBWIRE_CHAIN || 'goerli',
  useMockMode: !hasValidApiKey,
}

if (!hasValidApiKey) {
  console.log('🔧 Verbwire: Using mock mode - Invalid or missing API key')
  console.log('   API Key format should be: sk_live_... or sk_test_...')
  console.log(
    '   Current key:',
    apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'
  )
} else {
  console.log('✅ Verbwire: Using real API mode')
  console.log('   Base URL:', VERBWIRE_BASE_URL)
  console.log('   Chain:', verbwireConfig.defaultChain)
  console.log('   API Key:', `${apiKey.substring(0, 10)}...`)
}

module.exports = verbwireConfig
