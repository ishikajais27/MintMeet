// import { useState, useCallback } from 'react'
// import { mintService } from '../services/mintService'

// export const useMinting = () => {
// const [minting, setMinting] = useState(false)
// const [status, setStatus] = useState(null)
// const [error, setError] = useState(null)
// const [transaction, setTransaction] = useState(null)

// // Mint badges for an event
// const mintBadges = useCallback(async (eventId) => {
//     setMinting(true)
//     setError(null)
//     setStatus('initializing')

//     try {
//     setStatus('processing')
//     const response = await mintService.mintBadgesForEvent(eventId)

//     setTransaction(response.data)
//     setStatus('completed')
//     setMinting(false)

//     return response.data
//     } catch (err) {
//     setError(err.message || 'Failed to mint badges')
//     setStatus('failed')
//     setMinting(false)
//     throw err
//     }
// }, [])

// // Reset minting state
// const resetMinting = useCallback(() => {
//     setMinting(false)
//     setStatus(null)
//     setError(null)
//     setTransaction(null)
// }, [])

// return {
//     minting,
//     status,
//     error,
//     transaction,
//     mintBadges,
//     resetMinting,
// }
// }
import { useState, useCallback } from 'react'
import { mintService } from '../services/mintService'

export const useMinting = () => {
  const [minting, setMinting] = useState(false)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [transaction, setTransaction] = useState(null)

  // Mint badge for a specific attendee
  const mintBadgeForAttendee = useCallback(async (attendeeId) => {
    setMinting(true)
    setError(null)
    setStatus('initializing')

    try {
      setStatus('processing')
      const response = await mintService.mintBadgeForAttendee(attendeeId)

      setTransaction(response.data)
      setStatus('completed')
      setMinting(false)

      return response.data
    } catch (err) {
      setError(err.message || 'Failed to mint badge')
      setStatus('failed')
      setMinting(false)
      throw err
    }
  }, [])

  // Batch mint badges for an event
  const batchMintBadges = useCallback(async (eventId) => {
    setMinting(true)
    setError(null)
    setStatus('initializing')

    try {
      setStatus('processing')
      const response = await mintService.batchMintBadges(eventId)

      setTransaction(response.data)
      setStatus('completed')
      setMinting(false)

      return response.data
    } catch (err) {
      setError(err.message || 'Failed to mint badges')
      setStatus('failed')
      setMinting(false)
      throw err
    }
  }, [])

  // Get minting status
  const getMintStatus = useCallback(async (eventId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await mintService.getMintStatus(eventId)
      setLoading(false)
      return response.data
    } catch (err) {
      setError(err.message || 'Failed to get mint status')
      setLoading(false)
      throw err
    }
  }, [])

  // Reset minting state
  const resetMinting = useCallback(() => {
    setMinting(false)
    setStatus(null)
    setError(null)
    setTransaction(null)
  }, [])

  return {
    minting,
    status,
    error,
    transaction,
    mintBadgeForAttendee,
    batchMintBadges,
    getMintStatus,
    resetMinting,
  }
}
