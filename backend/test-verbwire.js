// test-verbwire-direct.js
require('dotenv').config()
const axios = require('axios')

const API_KEY = process.env.VERBWIRE_API_KEY
const BASE_URL = 'https://api.verbwire.com/v1'

async function testVerbwireDirect() {
  console.log('🔍 Testing Verbwire API key directly...')
  console.log(
    'API Key:',
    API_KEY ? API_KEY.substring(0, 10) + '...' : 'Not set'
  )

  if (!API_KEY) {
    console.log('❌ No API key found')
    return
  }

  try {
    // Test 1: Check if API key can access networks endpoint
    console.log('\n1. Testing networks endpoint...')
    const networksResponse = await axios.get(`${BASE_URL}/nft/data/networks`, {
      headers: {
        'X-API-Key': API_KEY,
        Accept: 'application/json',
      },
      timeout: 10000,
    })
    console.log('✅ Networks test successful')
    console.log('Available networks:', networksResponse.data.networks)

    // Test 2: Test the exact mint endpoint with a simple request
    console.log('\n2. Testing mint endpoint with simple request...')
    const testMintData = {
      chain: 'goerli',
      data: JSON.stringify({
        name: 'Test NFT',
        description: 'Test NFT description',
        image: 'https://via.placeholder.com/300.png',
      }),
      recipientAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f450',
    }

    const mintResponse = await axios.post(
      `${BASE_URL}/nft/mint/quickMintFromMetadata`,
      testMintData,
      {
        headers: {
          'X-API-Key': API_KEY,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    )

    console.log('✅ Mint test successful!')
    console.log('Response:', mintResponse.data)
  } catch (error) {
    console.log('❌ Test failed:')
    if (error.response) {
      console.log('Status:', error.response.status)
      console.log('Error data:', JSON.stringify(error.response.data, null, 2))
      console.log('Headers:', error.response.headers)
    } else if (error.request) {
      console.log('No response received:', error.request)
    } else {
      console.log('Error:', error.message)
    }
  }
}

testVerbwireDirect()
