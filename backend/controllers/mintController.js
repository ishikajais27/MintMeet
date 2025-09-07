const Attendee = require('../models/Attendee')
const Event = require('../models/Event')
const Transaction = require('../models/Transaction')
const { generateApiResponse } = require('../utils/helpers')
const { sendBadgeEmail } = require('../utils/emailService')
const { spawn } = require('child_process')
const path = require('path')
const verbwireService = require('../utils/verbwireService')
const verbwireConfig = require('../config/verbwire')

// Test Verbwire connection endpoint
const testVerbwireConnection = async (req, res) => {
  try {
    const result = await verbwireService.testConnection()

    if (result.success) {
      res
        .status(200)
        .json(generateApiResponse(true, result.message, result.data))
    } else {
      res
        .status(500)
        .json(
          generateApiResponse(
            false,
            'Verbwire connection failed',
            null,
            result.error
          )
        )
    }
  } catch (error) {
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Error testing Verbwire connection',
          null,
          error.message
        )
      )
  }
}

// Mint badge for a single attendee
const mintBadgeForAttendee = async (req, res) => {
  try {
    const { attendeeId } = req.params

    const attendee = await Attendee.findById(attendeeId).populate(
      'eventId',
      'name templateImage'
    )

    if (!attendee) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Attendee not found', null))
    }

    if (!attendee.walletAddress) {
      return res
        .status(400)
        .json(
          generateApiResponse(
            false,
            'Attendee does not have a wallet address',
            null
          )
        )
    }

    if (attendee.hasReceivedBadge) {
      return res
        .status(400)
        .json(
          generateApiResponse(
            false,
            'Badge already minted for this attendee',
            null
          )
        )
    }

    // Create transaction record
    const transaction = new Transaction({
      eventId: attendee.eventId._id,
      attendeeId: attendee._id,
      type: 'mint',
      status: 'processing',
    })

    await transaction.save()

    try {
      // Generate personalized badge image using Python script
      const badgeImagePath = await generateBadgeImage(
        attendee.eventId.templateImage,
        attendee.name,
        attendee.eventId.name
      )

      // Prepare metadata for minting - CORRECT VERBWIRE FORMAT
      const metadata = {
        name: `${attendee.eventId.name} - ${attendee.name}'s Badge`,
        description: `Proof of attendance badge for ${attendee.eventId.name}`,
        image: badgeImagePath,
        attributes: [
          {
            trait_type: 'Event',
            value: attendee.eventId.name,
          },
          {
            trait_type: 'Attendee',
            value: attendee.name,
          },
          {
            trait_type: 'Attendance Date',
            value: new Date().toISOString(),
          },
        ],
        recipientAddress: attendee.walletAddress,
      }

      // Mint NFT using Verbwire
      const mintResult = await verbwireService.mintNFT(metadata)

      if (!mintResult.success) {
        throw new Error(mintResult.error || 'Failed to mint NFT')
      }

      // Update transaction record
      transaction.status = 'completed'
      transaction.verbwireTransactionId = mintResult.data.transaction_id
      transaction.nftTokenId = mintResult.data.nft_token_id
      transaction.transactionHash = mintResult.data.transaction_hash
      transaction.completedAt = new Date()
      await transaction.save()

      // Update attendee record
      // attendee.badgeImage = badgeImagePath // Store the image URL
      // await attendee.save()
      // attendee.hasReceivedBadge = true
      // attendee.badgeMintedAt = new Date()
      // attendee.nftTokenId = mintResult.data.nft_token_id
      // attendee.nftTransactionHash = mintResult.data.transaction_hash
      // await attendee.save()
      // In mintBadgeForAttendee function - fix the duplicate save issue
      // Update attendee record - FIXED: Only save once with all changes
      attendee.badgeImage = badgeImagePath // Store the image URL
      attendee.hasReceivedBadge = true
      attendee.badgeMintedAt = new Date()
      attendee.nftTokenId = mintResult.data.nft_token_id
      attendee.nftTransactionHash = mintResult.data.transaction_hash
      await attendee.save() // Save only once with all changes

      // Send notification email
      const nftLink = `https://testnet.verbwire.com/token/${mintResult.data.nft_token_id}`
      await sendBadgeEmail(attendee, attendee.eventId, nftLink)

      res.status(200).json(
        generateApiResponse(true, 'Badge minted successfully', {
          transaction: transaction,
          nftDetails: mintResult.data,
        })
      )
    } catch (mintError) {
      // Update transaction record with error
      transaction.status = 'failed'
      transaction.errorMessage = mintError.message
      transaction.completedAt = new Date()
      await transaction.save()

      console.error('Minting error:', mintError)
      res
        .status(500)
        .json(
          generateApiResponse(
            false,
            'Failed to mint badge',
            null,
            mintError.message
          )
        )
    }
  } catch (error) {
    console.error('Error minting badge:', error)
    res
      .status(500)
      .json(
        generateApiResponse(false, 'Failed to mint badge', null, error.message)
      )
  }
}

// Batch mint badges for event attendees
const batchMintBadges = async (req, res) => {
  try {
    const { eventId } = req.params

    const event = await Event.findById(eventId)
    if (!event) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Event not found', null))
    }

    // Get attendees who haven't received badges yet
    const attendees = await Attendee.find({
      eventId,
      hasAttended: true,
      hasReceivedBadge: false,
      walletAddress: { $ne: null },
    })

    if (attendees.length === 0) {
      return res
        .status(400)
        .json(
          generateApiResponse(
            false,
            'No eligible attendees found for minting',
            null
          )
        )
    }

    const batchResults = {
      total: attendees.length,
      successful: 0,
      failed: 0,
      details: [],
    }

    // Process each attendee
    for (const attendee of attendees) {
      try {
        // Create transaction record
        const transaction = new Transaction({
          eventId,
          attendeeId: attendee._id,
          type: 'batch_mint',
          status: 'processing',
        })

        await transaction.save()

        // Generate personalized badge image
        // const badgeImagePath = await generateBadgeImage(
        //   event.templateImage,
        //   attendee.name,
        //   event.name
        // )
        const badgeImagePath = await generateBadgeImage(
          event.templateImage,
          attendee.name,
          event.name
        )

        // Update attendee with badge image URL
        attendee.badgeImage = badgeImagePath
        await attendee.save()

        // CORRECT VERBWIRE FORMAT:
        const metadata = {
          name: `${event.name} - ${attendee.name}'s Badge`,
          description: `Proof of attendance badge for ${event.name}`,
          image: badgeImagePath,
          attributes: [
            {
              trait_type: 'Event',
              value: event.name,
            },
            {
              trait_type: 'Attendee',
              value: attendee.name,
            },
          ],
          recipientAddress: attendee.walletAddress,
        }

        // Mint NFT
        const mintResult = await verbwireService.mintNFT(metadata)

        if (mintResult.success) {
          // Update records
          transaction.status = 'completed'
          transaction.verbwireTransactionId = mintResult.data.transaction_id
          transaction.nftTokenId = mintResult.data.nft_token_id
          transaction.transactionHash = mintResult.data.transaction_hash
          transaction.completedAt = new Date()
          await transaction.save()

          attendee.hasReceivedBadge = true
          attendee.badgeMintedAt = new Date()
          attendee.nftTokenId = mintResult.data.nft_token_id
          attendee.nftTransactionHash = mintResult.data.transaction_hash
          await attendee.save()

          // Send email
          const nftLink = `https://testnet.verbwire.com/token/${mintResult.data.nft_token_id}`
          await sendBadgeEmail(attendee, event, nftLink)

          batchResults.successful++
          batchResults.details.push({
            attendee: attendee.email,
            status: 'success',
            transactionId: mintResult.data.transaction_id,
          })
        } else {
          throw new Error(mintResult.error || 'Minting failed')
        }
      } catch (error) {
        batchResults.failed++
        batchResults.details.push({
          attendee: attendee.email,
          status: 'failed',
          error: error.message,
        })
      }
    }

    res
      .status(200)
      .json(generateApiResponse(true, 'Batch minting completed', batchResults))
  } catch (error) {
    console.error('Error in batch minting:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to process batch minting',
          null,
          error.message
        )
      )
  }
}

// Generate badge image using Python script
const generateBadgeImage = (templateImage, attendeeName, eventName) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../scripts/generate_badge.py')
    const args = [templateImage, attendeeName, eventName]

    const pythonProcess = spawn('python', [pythonScript, ...args])

    let result = ''
    let error = ''

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(result.trim())
      } else {
        reject(new Error(`Python script failed: ${error}`))
      }
    })
  })
}

// Get minting status for an event
const getMintingStatus = async (req, res) => {
  try {
    const { eventId } = req.params

    const transactions = await Transaction.find({ eventId })
      .populate('attendeeId', 'name email')
      .sort({ initiatedAt: -1 })

    const statusSummary = {
      total: transactions.length,
      completed: transactions.filter((t) => t.status === 'completed').length,
      processing: transactions.filter((t) => t.status === 'processing').length,
      failed: transactions.filter((t) => t.status === 'failed').length,
    }

    res.status(200).json(
      generateApiResponse(true, 'Minting status retrieved successfully', {
        summary: statusSummary,
        transactions: transactions,
      })
    )
  } catch (error) {
    console.error('Error getting minting status:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to retrieve minting status',
          null,
          error.message
        )
      )
  }
}

module.exports = {
  testVerbwireConnection,
  mintBadgeForAttendee,
  batchMintBadges,
  getMintingStatus,
}
