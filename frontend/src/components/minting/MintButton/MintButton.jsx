import React from 'react'
import Button from '../../common/Button/Button'
import Loader from '../../common/Loader/Loader'
import './MintButton.css'

const MintButton = ({
  onClick,
  loading = false,
  disabled = false,
  status = 'idle',
  className = '',
}) => {
  const getButtonText = () => {
    switch (status) {
      case 'initializing':
        return 'Initializing...'
      case 'processing':
        return 'Minting...'
      case 'completed':
        return 'Minting Complete'
      case 'failed':
        return 'Try Again'
      default:
        return 'Mint Badges'
    }
  }

  const getButtonVariant = () => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'failed':
        return 'error'
      default:
        return 'primary'
    }
  }

  return (
    <Button
      variant={getButtonVariant()}
      size="large"
      onClick={onClick}
      disabled={disabled || loading || status === 'completed'}
      className={`mint-button ${className} ${
        status === 'completed' ? 'mint-button--success' : ''
      }`}
    >
      {loading ? <Loader size="small" /> : getButtonText()}
    </Button>
  )
}

export default MintButton
