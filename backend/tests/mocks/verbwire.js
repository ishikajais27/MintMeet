// Mock Verbwire API functions
const mockMintNFT = jest.fn().mockResolvedValue({
  success: true,
  data: {
    transaction_id: 'mock-transaction-123',
    nft_token_id: 'mock-token-456',
    transaction_hash: '0xmockhash123',
  },
})

const mockBatchMintNFTs = jest.fn().mockResolvedValue({
  success: true,
  data: {
    batch_id: 'mock-batch-789',
  },
})

module.exports = {
  mintNFT: mockMintNFT,
  batchMintNFTs: mockBatchMintNFTs,
  getTransactionStatus: jest.fn().mockResolvedValue({
    success: true,
    data: { status: 'completed' },
  }),
  deployContract: jest.fn().mockResolvedValue({
    success: true,
    data: { contract_address: '0xmockcontract' },
  }),
}
