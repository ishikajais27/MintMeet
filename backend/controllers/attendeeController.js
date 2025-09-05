const Attendee = require('../models/Attendee')
const Event = require('../models/Event')
const csv = require('csv-parser')
const fs = require('fs')
const path = require('path')
const {
  generateApiResponse,
  isValidEthereumAddress,
} = require('../utils/helpers')

const processCSV = async (req, res) => {
  try {
    const { eventId } = req.body

    if (!req.file) {
      return res
        .status(400)
        .json(generateApiResponse(false, 'CSV file is required', null))
    }

    // Check if event exists
    const event = await Event.findById(eventId)
    if (!event || !event.isActive) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Event not found or inactive', null))
    }

    const results = []
    const errors = []
    const filePath = req.file.path

    // Process CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Validate required fields
          if (!data.name || !data.email) {
            errors.push({
              row: results.length + 1,
              error: 'Missing required fields (name, email)',
              data,
            })
            return
          }

          // Validate email format
          const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
          if (!emailRegex.test(data.email)) {
            errors.push({
              row: results.length + 1,
              error: 'Invalid email format',
              data,
            })
            return
          }

          // Validate wallet address if provided
          if (
            data.walletAddress &&
            !isValidEthereumAddress(data.walletAddress)
          ) {
            errors.push({
              row: results.length + 1,
              error: 'Invalid Ethereum wallet address',
              data,
            })
            return
          }

          results.push({
            name: data.name.trim(),
            email: data.email.toLowerCase().trim(),
            walletAddress: data.walletAddress
              ? data.walletAddress.trim()
              : null,
            eventId,
          })
        })
        .on('end', resolve)
        .on('error', reject)
    })

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
    fs.unlinkSync(filePath)

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
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    res
      .status(500)
      .json(
        generateApiResponse(false, 'Failed to process CSV', null, error.message)
      )
  }
}

// Export attendees to CSV
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
const markAttendance = async (req, res) => {
  try {
    const { id } = req.params

    const attendee = await Attendee.findByIdAndUpdate(
      id,
      {
        hasAttended: true,
        attendedAt: Date.now(),
      },
      { new: true }
    ).select('-__v')

    if (!attendee) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Attendee not found', null))
    }

    res
      .status(200)
      .json(
        generateApiResponse(true, 'Attendance marked successfully', attendee)
      )
  } catch (error) {
    console.error('Error marking attendance:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to mark attendance',
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
