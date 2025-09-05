// Mock email service functions
const mockSendRegistrationEmail = jest.fn().mockResolvedValue(true)
const mockSendBadgeEmail = jest.fn().mockResolvedValue(true)
const mockSendEventCreationEmail = jest.fn().mockResolvedValue(true)

module.exports = {
  sendRegistrationEmail: mockSendRegistrationEmail,
  sendBadgeEmail: mockSendBadgeEmail,
  sendEventCreationEmail: mockSendEventCreationEmail,
}
