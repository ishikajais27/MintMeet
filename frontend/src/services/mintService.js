// import api from './api'

// export const mintService = {
//   // Mint badges for an event
//   mintBadgesForEvent: async (eventId) => {
//     try {
//       console.log(`Minting badges for event: ${eventId}`)

//       // Simulate API call delay
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       // Mock response - replace with actual API call later
//       const mockResponse = {
//         data: {
//           success: true,
//           message: 'Minting process started',
//           transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
//           status: 'processing',
//         },
//       }

//       return mockResponse

//       // Actual API call (uncomment when backend is ready)
//       // return await api.post(`/events/${eventId}/mint`);
//     } catch (error) {
//       console.error('Error minting badges:', error)
//       throw error
//     }
//   },

//   // Get minting status for an event
//   getMintStatus: async (eventId) => {
//     try {
//       console.log(`Getting mint status for event: ${eventId}`)
//       // Actual implementation will go here
//     } catch (error) {
//       console.error('Error getting mint status:', error)
//       throw error
//     }
//   },
// }
import api from './api'

export const mintService = {
  // Mint badge for a specific attendee
  mintBadgeForAttendee: async (attendeeId) => {
    try {
      const response = await api.post(`/api/mint/attendee/${attendeeId}`)
      return response.data
    } catch (error) {
      console.error('Error minting badge for attendee:', error)
      throw error
    }
  },

  // Batch mint badges for an event
  batchMintBadges: async (eventId) => {
    try {
      const response = await api.post(`/api/mint/batch/${eventId}`)
      return response.data
    } catch (error) {
      console.error('Error batch minting badges:', error)
      throw error
    }
  },

  // Get minting status for an event
  getMintStatus: async (eventId) => {
    try {
      const response = await api.get(`/api/mint/status/${eventId}`)
      return response.data
    } catch (error) {
      console.error('Error getting mint status:', error)
      throw error
    }
  },
}
