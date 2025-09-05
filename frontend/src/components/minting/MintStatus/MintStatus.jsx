import React from 'react'
import Loader from '../../common/Loader/Loader'
import './MintStatus.css'

const MintStatus = ({ status, transaction, error }) => {
  if (!status) return null

  const getStatusIcon = () => {
    switch (status) {
      case 'initializing':
      case 'processing':
        return <Loader size="medium" />
      case 'completed':
        return '✅'
      case 'failed':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'initializing':
        return 'Initializing minting process...'
      case 'processing':
        return 'Minting badges on blockchain...'
      case 'completed':
        return 'Badges minted successfully!'
      case 'failed':
        return error || 'Minting failed. Please try again.'
      default:
        return 'Minting status unknown'
    }
  }

  const getStatusClass = () => {
    switch (status) {
      case 'completed':
        return 'mint-status--success'
      case 'failed':
        return 'mint-status--error'
      case 'processing':
        return 'mint-status--processing'
      default:
        return 'mint-status--info'
    }
  }

  return (
    <div className={`mint-status ${getStatusClass()}`}>
      <div className="mint-status-content">
        <div className="mint-status-icon">{getStatusIcon()}</div>
        <div className="mint-status-info">
          <p className="mint-status-message">{getStatusMessage()}</p>
          {transaction?.transactionHash && (
            <div className="mint-transaction">
              <span className="mint-transaction-label">Transaction:</span>
              <a
                href={`https://etherscan.io/tx/${transaction.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mint-transaction-link"
              >
                {transaction.transactionHash.slice(0, 8)}...
                {transaction.transactionHash.slice(-6)}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MintStatus
