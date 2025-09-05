// import api from './api'

// export const attendeeService = {
//   // Get attendees for an event
//   getAttendees: async (eventId) => {
//     try {
//       console.log(`Fetching attendees for event: ${eventId}`)

//       // Simulate API call delay
//       await new Promise((resolve) => setTimeout(resolve, 800))

//       // Mock data - replace with actual API call later
//       const mockAttendees = [
//         {
//           _id: '1',
//           eventId,
//           name: 'John Doe',
//           email: 'john@example.com',
//           walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
//           status: 'registered',
//           registeredAt: '2023-11-10T10:00:00Z',
//         },
//         {
//           _id: '2',
//           eventId,
//           name: 'Jane Smith',
//           email: 'jane@example.com',
//           walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44f',
//           status: 'registered',
//           registeredAt: '2023-11-10T11:30:00Z',
//         },
//       ]

//       return { data: mockAttendees }

//       // Actual API call (uncomment when backend is ready)
//       // return await api.get(`/events/${eventId}/attendees`);
//     } catch (error) {
//       console.error('Error fetching attendees:', error)
//       throw error
//     }
//   },

//   // Add attendees via CSV
//   addAttendees: async (eventId, attendeesData) => {
//     try {
//       console.log(`Adding attendees to event: ${eventId}`, attendeesData)

//       // Simulate API call delay
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       // Mock response - replace with actual API call later
//       const mockResponse = {
//         data: {
//           success: true,
//           message: 'Attendees added successfully',
//           count: attendeesData.length,
//         },
//       }

//       return mockResponse

//       // Actual API call (uncomment when backend is ready)
//       // return await api.post(`/events/${eventId}/attendees/batch`, attendeesData);
//     } catch (error) {
//       console.error('Error adding attendees:', error)
//       throw error
//     }
//   },

//   // Register single attendee
//   registerAttendee: async (eventId, attendeeData) => {
//     try {
//       console.log(`Registering attendee for event: ${eventId}`, attendeeData)
//       // Actual implementation will go here
//     } catch (error) {
//       console.error('Error registering attendee:', error)
//       throw error
//     }
//   },
// }
import api from './api'

export const attendeeService = {
  // Get attendees for an event
  getAttendees: async (eventId) => {
    try {
      const response = await api.get(`/api/attendees/event/${eventId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching attendees:', error)
      throw error
    }
  },

  // Register single attendee
  registerAttendee: async (attendeeData) => {
    try {
      const response = await api.post('/api/attendees', attendeeData)
      return response.data
    } catch (error) {
      console.error('Error registering attendee:', error)
      throw error
    }
  },

  // Add attendees via CSV
  addAttendees: async (csvFile) => {
    try {
      const formData = new FormData()
      formData.append('csvFile', csvFile)

      const response = await api.post('/api/attendees/csv-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error adding attendees via CSV:', error)
      throw error
    }
  },

  // Export attendees to CSV
  exportAttendees: async (eventId) => {
    try {
      const response = await api.get(`/api/attendees/export/${eventId}`, {
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      console.error('Error exporting attendees:', error)
      throw error
    }
  },

  // Get attendee by ID
  getAttendee: async (attendeeId) => {
    try {
      const response = await api.get(`/api/attendees/${attendeeId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching attendee:', error)
      throw error
    }
  },

  // Update attendee
  updateAttendee: async (attendeeId, attendeeData) => {
    try {
      const response = await api.put(
        `/api/attendees/${attendeeId}`,
        attendeeData
      )
      return response.data
    } catch (error) {
      console.error('Error updating attendee:', error)
      throw error
    }
  },

  // Delete attendee
  deleteAttendee: async (attendeeId) => {
    try {
      const response = await api.delete(`/api/attendees/${attendeeId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting attendee:', error)
      throw error
    }
  },

  // Mark attendance
  markAttendance: async (attendeeId) => {
    try {
      const response = await api.patch(
        `/api/attendees/${attendeeId}/attendance`
      )
      return response.data
    } catch (error) {
      console.error('Error marking attendance:', error)
      throw error
    }
  },
}
