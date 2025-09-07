const Attendee = require('../models/Attendee')
const Event = require('../models/Event')
const csv = require('csv-parser')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const {
  generateApiResponse,
  isValidEthereumAddress,
} = require('../utils/helpers')

// controllers/attendeeController.js
const processCSV = async (req, res) => {
  let filePath = null

  try {
    console.log('CSV Upload Request received:')
    const { eventId } = req.body
    console.log('Processing CSV for event:', eventId)

    if (!req.file) {
      console.log('No file uploaded')
      return res
        .status(400)
        .json(generateApiResponse(false, 'CSV file is required', null))
    }
    if (!eventId) {
      console.log('Event ID is required')
      return res
        .status(400)
        .json(generateApiResponse(false, 'Event ID is required', null))
    }
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      console.log('Invalid Event ID format:', eventId)
      return res
        .status(400)
        .json(generateApiResponse(false, 'Invalid Event ID format', null))
    }
    // Check if event exists
    const event = await Event.findById(eventId)
    if (!event || !event.isActive) {
      console.log('Event not found or inactive:', eventId)
      return res
        .status(404)
        .json(generateApiResponse(false, 'Event not found or inactive', null))
    }

    const results = []
    const errors = []
    filePath = req.file.path

    console.log('Processing CSV file:', filePath)

    // Process CSV file with better configuration
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(
          csv({
            mapHeaders: ({ header, index }) => header.trim(),
            mapValues: ({ value, index }) => value.trim(),
            skipLines: 0, // Don't skip any lines
            strict: false, // Be more lenient with parsing
          })
        )
        .on('data', (data) => {
          console.log('CSV row data:', JSON.stringify(data, null, 2))

          // Handle different column name variations
          const name =
            data.name ||
            data.Name ||
            data.NAME ||
            data['Attendee Name'] ||
            data['ATTENDEE NAME'] ||
            data['Full Name'] ||
            data['FULL NAME']

          const email =
            data.email ||
            data.Email ||
            data.EMAIL ||
            data['Email Address'] ||
            data['EMAIL ADDRESS'] ||
            data['E-mail'] ||
            data['E-MAIL']

          const walletAddress =
            data.walletAddress ||
            data.wallet ||
            data.Wallet ||
            data.WALLET_ADDRESS ||
            data['Wallet Address'] ||
            data['WALLET ADDRESS'] ||
            data.address ||
            data.Address

          console.log(
            'Extracted - Name:',
            name,
            'Email:',
            email,
            'Wallet:',
            walletAddress
          )

          if (!name || !email) {
            errors.push({
              row: results.length + 1,
              error: 'Missing required fields (name, email)',
              data,
            })
            return
          }

          // Validate email format
          const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
          if (!emailRegex.test(email)) {
            errors.push({
              row: results.length + 1,
              error: 'Invalid email format',
              data,
            })
            return
          }

          // Validate wallet address if provided
          if (walletAddress && !isValidEthereumAddress(walletAddress)) {
            errors.push({
              row: results.length + 1,
              error: 'Invalid Ethereum wallet address',
              data,
            })
            return
          }

          results.push({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            walletAddress: walletAddress ? walletAddress.trim() : null,
            eventId,
          })
        })
        .on('end', () => {
          console.log('CSV parsing completed. Total rows:', results.length)
          resolve()
        })
        .on('error', (error) => {
          console.error('CSV parsing error:', error)
          reject(error)
        })
    })

    console.log('CSV parsed successfully. Rows:', results.length)

    // Process each attendee
    const processedAttendees = []
    for (const attendeeData of results) {
      try {
        // Check if attendee already exists
        const existingAttendee = await Attendee.findOne({
          eventId,
          email: attendeeData.email,
        })

        if (existingAttendee) {
          errors.push({
            email: attendeeData.email,
            error: 'Already registered for this event',
          })
          continue
        }

        const attendee = new Attendee(attendeeData)
        const savedAttendee = await attendee.save()
        processedAttendees.push(savedAttendee)
      } catch (error) {
        errors.push({
          email: attendeeData.email,
          error: error.message,
        })
      }
    }

    // Clean up the uploaded file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    console.log(
      'CSV processing completed. Processed:',
      processedAttendees.length,
      'Errors:',
      errors.length
    )

    res.status(201).json(
      generateApiResponse(true, 'CSV processing completed', {
        processed: processedAttendees.length,
        errors: errors.length,
        attendees: processedAttendees,
        errorDetails: errors,
      })
    )
  } catch (error) {
    console.error('Error processing CSV:', error)

    // Clean up file on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    res
      .status(500)
      .json(
        generateApiResponse(false, 'Failed to process CSV', null, error.message)
      )
  }
}
const exportAttendees = async (req, res) => {
  try {
    const { eventId } = req.params

    const attendees = await Attendee.find({ eventId })
      .select('name email walletAddress hasAttended registeredAt')
      .sort({ registeredAt: -1 })

    if (attendees.length === 0) {
      return res
        .status(404)
        .json(
          generateApiResponse(false, 'No attendees found for this event', null)
        )
    }

    // Create CSV content
    let csvContent =
      'Name,Email,Wallet Address,Attendance Status,Registration Date\n'

    attendees.forEach((attendee) => {
      csvContent +=
        `"${attendee.name.replace(/"/g, '""')}",` +
        `${attendee.email},` +
        `${attendee.walletAddress || 'N/A'},` +
        `${attendee.hasAttended ? 'Attended' : 'Not Attended'},` +
        `${attendee.registeredAt.toISOString()}\n`
    })

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=attendees-${eventId}.csv`
    )

    res.status(200).send(csvContent)
  } catch (error) {
    console.error('Error exporting attendees:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to export attendees',
          null,
          error.message
        )
      )
  }
}
// Register a new attendee
const registerAttendee = async (req, res) => {
  try {
    const { name, email, eventId, walletAddress } = req.body

    // Check if event exists
    const event = await Event.findById(eventId)
    if (!event || !event.isActive) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Event not found or inactive', null))
    }

    // Check if attendee already registered for this event
    const existingAttendee = await Attendee.findOne({ eventId, email })
    if (existingAttendee) {
      return res
        .status(409)
        .json(
          generateApiResponse(
            false,
            'Attendee already registered for this event',
            null
          )
        )
    }

    const attendee = new Attendee({
      name,
      email,
      eventId,
      walletAddress,
      hasRegistered: true,
    })

    const savedAttendee = await attendee.save()

    res
      .status(201)
      .json(
        generateApiResponse(
          true,
          'Attendee registered successfully',
          savedAttendee
        )
      )
  } catch (error) {
    console.error('Error registering attendee:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to register attendee',
          null,
          error.message
        )
      )
  }
}

// Get all attendees for an event
const getAttendeesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params

    // Check if event exists
    const event = await Event.findById(eventId)
    if (!event) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Event not found', null))
    }

    const attendees = await Attendee.find({ eventId })
      .select('-__v')
      .sort({ registeredAt: -1 })

    res
      .status(200)
      .json(
        generateApiResponse(true, 'Attendees retrieved successfully', attendees)
      )
  } catch (error) {
    console.error('Error retrieving attendees:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to retrieve attendees',
          null,
          error.message
        )
      )
  }
}

// Get a specific attendee by ID
const getAttendeeById = async (req, res) => {
  try {
    const { id } = req.params

    const attendee = await Attendee.findById(id)
      .populate('eventId', 'name date organizer')
      .select('-__v')

    if (!attendee) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Attendee not found', null))
    }

    res
      .status(200)
      .json(
        generateApiResponse(true, 'Attendee retrieved successfully', attendee)
      )
  } catch (error) {
    console.error('Error retrieving attendee:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to retrieve attendee',
          null,
          error.message
        )
      )
  }
}

// Update an attendee
const updateAttendee = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const attendee = await Attendee.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select('-__v')

    if (!attendee) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Attendee not found', null))
    }

    res
      .status(200)
      .json(
        generateApiResponse(true, 'Attendee updated successfully', attendee)
      )
  } catch (error) {
    console.error('Error updating attendee:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to update attendee',
          null,
          error.message
        )
      )
  }
}

// Delete an attendee
const deleteAttendee = async (req, res) => {
  try {
    const { id } = req.params

    const attendee = await Attendee.findByIdAndDelete(id)

    if (!attendee) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Attendee not found', null))
    }

    res
      .status(200)
      .json(generateApiResponse(true, 'Attendee deleted successfully', null))
  } catch (error) {
    console.error('Error deleting attendee:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to delete attendee',
          null,
          error.message
        )
      )
  }
}

// Mark attendance for an attendee
// const markAttendance = async (req, res) => {
//   try {
//     const { id } = req.params

//     const attendee = await Attendee.findByIdAndUpdate(
//       id,
//       {
//         hasAttended: true,
//         attendedAt: Date.now(),
//       },
//       { new: true }
//     ).select('-__v')

//     if (!attendee) {
//       return res
//         .status(404)
//         .json(generateApiResponse(false, 'Attendee not found', null))
//     }

//     res
//       .status(200)
//       .json(
//         generateApiResponse(true, 'Attendance marked successfully', attendee)
//       )
//   } catch (error) {
//     console.error('Error marking attendance:', error)
//     res
//       .status(500)
//       .json(
//         generateApiResponse(
//           false,
//           'Failed to mark attendance',
//           null,
//           error.message
//         )
//       )
//   }
//}
const markAttendance = async (req, res) => {
  try {
    const { id } = req.params

    const attendee = await Attendee.findById(id)
    if (!attendee) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Attendee not found', null))
    }

    // Toggle attendance status
    const updatedAttendee = await Attendee.findByIdAndUpdate(
      id,
      {
        hasAttended: !attendee.hasAttended,
        attendedAt: !attendee.hasAttended ? Date.now() : null,
      },
      { new: true, runValidators: true }
    ).select('-__v')

    res
      .status(200)
      .json(
        generateApiResponse(
          true,
          'Attendance updated successfully',
          updatedAttendee
        )
      )
  } catch (error) {
    console.error('Error updating attendance:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to update attendance',
          null,
          error.message
        )
      )
  }
}

module.exports = {
  registerAttendee,
  getAttendeesByEvent,
  getAttendeeById,
  updateAttendee,
  deleteAttendee,
  markAttendance,
  processCSV,
  exportAttendees,
}
