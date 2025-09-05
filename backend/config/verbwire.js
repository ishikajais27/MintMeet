const { VERBWIRE_API_KEY, VERBWIRE_BASE_URL } = require('./constants')

const verbwireConfig = {
  apiKey: VERBWIRE_API_KEY,
  baseURL: VERBWIRE_BASE_URL,
  endpoints: {
    mint: '/nft/mint/mintFromMetadata',
    batchMint: '/nft/mint/batchMintFromMetadata',
    deploy: '/nft/deploy/quickDeploy',
    transactions: '/nft/data/transactions',
  },
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': VERBWIRE_API_KEY,
  },
}

module.exports = verbwireConfig
