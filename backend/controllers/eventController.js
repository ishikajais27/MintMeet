// const Event = require('../models/Event')
// const { generateApiResponse } = require('../utils/helpers')

// // Create a new event
// const createEvent = async (req, res) => {
//   try {
//     const { name, description, date, organizer, templateImage } = req.body

//     const event = new Event({
//       name,
//       description,
//       date,
//       organizer,
//       templateImage,
//     })

//     const savedEvent = await event.save()

//     res
//       .status(201)
//       .json(generateApiResponse(true, 'Event created successfully', savedEvent))
//   } catch (error) {
//     console.error('Error creating event:', error)
//     res
//       .status(500)
//       .json(
//         generateApiResponse(
//           false,
//           'Failed to create event',
//           null,
//           error.message
//         )
//       )
//   }
// }

// // Get all events
// const getAllEvents = async (req, res) => {
//   try {
//     const events = await Event.find({ isActive: true })
//       .sort({ date: 1 })
//       .select('-__v')

//     res
//       .status(200)
//       .json(generateApiResponse(true, 'Events retrieved successfully', events))
//   } catch (error) {
//     console.error('Error retrieving events:', error)
//     res
//       .status(500)
//       .json(
//         generateApiResponse(
//           false,
//           'Failed to retrieve events',
//           null,
//           error.message
//         )
//       )
//   }
// }

// // Get a specific event by ID
// const getEventById = async (req, res) => {
//   try {
//     const { id } = req.params

//     const event = await Event.findById(id)
//       .populate('attendees', 'name email hasAttended')
//       .select('-__v')

//     if (!event) {
//       return res
//         .status(404)
//         .json(generateApiResponse(false, 'Event not found', null))
//     }

//     res
//       .status(200)
//       .json(generateApiResponse(true, 'Event retrieved successfully', event))
//   } catch (error) {
//     console.error('Error retrieving event:', error)
//     res
//       .status(500)
//       .json(
//         generateApiResponse(
//           false,
//           'Failed to retrieve event',
//           null,
//           error.message
//         )
//       )
//   }
// }

// // Update an event
// const updateEvent = async (req, res) => {
//   try {
//     const { id } = req.params
//     const updates = req.body

//     const event = await Event.findByIdAndUpdate(
//       id,
//       { ...updates, updatedAt: Date.now() },
//       { new: true, runValidators: true }
//     ).select('-__v')

//     if (!event) {
//       return res
//         .status(404)
//         .json(generateApiResponse(false, 'Event not found', null))
//     }

//     res
//       .status(200)
//       .json(generateApiResponse(true, 'Event updated successfully', event))
//   } catch (error) {
//     console.error('Error updating event:', error)
//     res
//       .status(500)
//       .json(
//         generateApiResponse(
//           false,
//           'Failed to update event',
//           null,
//           error.message
//         )
//       )
//   }
// }

// // Delete an event (soft delete)
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

// module.exports = {
//   createEvent,
//   getAllEvents,
//   getEventById,
//   updateEvent,
//   deleteEvent,
// }
const Event = require('../models/Event')
const { generateApiResponse } = require('../utils/helpers')
const { sendEventCreationEmail } = require('../utils/emailService')

// Create a new event
const createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      date,
      organizer,
      templateImage,
      organizerEmail,
    } = req.body

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

// Get a specific event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params

    const event = await Event.findById(id)
      .populate('attendees', 'name email hasAttended')
      .select('-__v')

    if (!event) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Event not found', null))
    }

    res
      .status(200)
      .json(generateApiResponse(true, 'Event retrieved successfully', event))
  } catch (error) {
    console.error('Error retrieving event:', error)
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
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params

    const event = await Event.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    )

    if (!event) {
      return res
        .status(404)
        .json(generateApiResponse(false, 'Event not found', null))
    }

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
  uploadEventImage, // Make sure this is exported
}
