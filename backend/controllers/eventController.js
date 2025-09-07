const Event = require('../models/Event')
const Attendee = require('../models/Attendee') // Make sure to import Attendee
const { generateApiResponse } = require('../utils/helpers')
const { sendEventCreationEmail } = require('../utils/emailService')

const createEvent = async (req, res) => {
  try {
    const { name, description, date, organizer, organizerEmail } = req.body

    // Handle uploaded file if exists
    let templateImage = null
    if (req.file) {
      templateImage = `/uploads/images/${req.file.filename}`
    }

    const event = new Event({
      name,
      description,
      date,
      organizer,
      templateImage,
    })
    const savedEvent = await event.save()

    // Send email notification if organizer email provided
    if (organizerEmail) {
      await sendEventCreationEmail(savedEvent, organizerEmail)
    }

    res
      .status(201)
      .json(generateApiResponse(true, 'Event created successfully', savedEvent))
  } catch (error) {
    console.error('Error creating event:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to create event',
          null,
          error.message
        )
      )
  }
}
// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .sort({ date: 1 })
      .select('-__v')

    res
      .status(200)
      .json(generateApiResponse(true, 'Events retrieved successfully', events))
  } catch (error) {
    console.error('Error retrieving events:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to retrieve events',
          null,
          error.message
        )
      )
  }
}

// Get a specific event by ID - COMPLETELY REWRITTEN
const getEventById = async (req, res) => {
  try {
    const { id } = req.params
    console.log('Fetching event with ID:', id)

    // Validate if ID is provided
    if (!id) {
      console.log('No ID provided')
      return res
        .status(400)
        .json(generateApiResponse(false, 'Event ID is required', null))
    }

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid ID format:', id)
      return res
        .status(400)
        .json(generateApiResponse(false, 'Invalid event ID format', null))
    }

    // Get the event
    const event = await Event.findById(id).select('-__v').lean()

    if (!event) {
      console.log('Event not found with ID:', id)
      return res
        .status(404)
        .json(generateApiResponse(false, 'Event not found', null))
    }

    console.log('Event found:', event.name)

    // Get attendees for this event from the Attendee collection
    try {
      const attendees = await Attendee.find({ eventId: id })
        .select('name email walletAddress hasAttended registeredAt')
        .sort({ registeredAt: -1 })
        .lean()

      console.log('Found', attendees.length, 'attendees for event')

      // Add attendees to the event response
      const eventWithAttendees = {
        ...event,
        attendees,
      }

      res
        .status(200)
        .json(
          generateApiResponse(
            true,
            'Event retrieved successfully',
            eventWithAttendees
          )
        )
    } catch (attendeeError) {
      console.error('Error fetching attendees:', attendeeError)
      // Still return the event even if attendees fail
      const eventWithoutAttendees = {
        ...event,
        attendees: [],
      }
      res
        .status(200)
        .json(
          generateApiResponse(
            true,
            'Event retrieved successfully (attendees unavailable)',
            eventWithoutAttendees
          )
        )
    }
  } catch (error) {
    console.error('Error retrieving event:', error)

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res
        .status(400)
        .json(generateApiResponse(false, 'Invalid event ID format', null))
    }

    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to retrieve event',
          null,
          error.message
        )
      )
  }
}

// Update an event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const event = await Event.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-__v')

    if (!event) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Event not found', null))
    }

    res
      .status(200)
      .json(generateApiResponse(true, 'Event updated successfully', event))
  } catch (error) {
    console.error('Error updating event:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to update event',
          null,
          error.message
        )
      )
  }
}

// Delete an event (soft delete)
// const deleteEvent = async (req, res) => {
//   try {
//     const { id } = req.params

//     const event = await Event.findByIdAndUpdate(
//       id,
//       { isActive: false, updatedAt: Date.now() },
//       { new: true }
//     )

//     if (!event) {
//       return res
//         .status(404)
//         .json(generateApiResponse(false, 'Event not found', null))
//     }

//     res
//       .status(200)
//       .json(generateApiResponse(true, 'Event deleted successfully', null))
//   } catch (error) {
//     console.error('Error deleting event:', error)
//     res
//       .status(500)
//       .json(
//         generateApiResponse(
//           false,
//           'Failed to delete event',
//           null,
//           error.message
//         )
//       )
//   }
// }
// Delete an event (soft delete)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params

    // First, check if the event exists
    const event = await Event.findById(id)

    if (!event) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Event not found', null))
    }

    // Perform hard delete instead of soft delete
    const deletedEvent = await Event.findByIdAndDelete(id)

    res
      .status(200)
      .json(generateApiResponse(true, 'Event deleted successfully', null))
  } catch (error) {
    console.error('Error deleting event:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to delete event',
          null,
          error.message
        )
      )
  }
}

// Upload event image
const uploadEventImage = async (req, res) => {
  try {
    const { id } = req.params

    if (!req.file) {
      return res
        .status(400)
        .json(generateApiResponse(false, 'Image file is required', null))
    }

    const event = await Event.findByIdAndUpdate(
      id,
      {
        templateImage: `/uploads/images/${req.file.filename}`,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    ).select('-__v')

    if (!event) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Event not found', null))
    }

    res
      .status(200)
      .json(
        generateApiResponse(true, 'Event image uploaded successfully', event)
      )
  } catch (error) {
    console.error('Error uploading event image:', error)
    res
      .status(500)
      .json(
        generateApiResponse(
          false,
          'Failed to upload event image',
          null,
          error.message
        )
      )
  }
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  uploadEventImage,
}
