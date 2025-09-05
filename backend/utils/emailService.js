const nodemailer = require('nodemailer')
const { generateApiResponse } = require('./helpers')

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// Send registration confirmation email
const sendRegistrationEmail = async (attendee, event) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: attendee.email,
      subject: `Registration Confirmation: ${event.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Event Registration Confirmation</h2>
          <p>Hello ${attendee.name},</p>
          <p>You have successfully registered for <strong>${
            event.name
          }</strong>.</p>
          <p><strong>Event Details:</strong></p>
          <ul>
            <li>Date: ${new Date(event.date).toLocaleDateString()}</li>
            <li>Organizer: ${event.organizer}</li>
          </ul>
          <p>We look forward to seeing you at the event!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending registration email:', error)
    return false
  }
}

// Send badge minting notification email
const sendBadgeEmail = async (attendee, event, nftLink) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: attendee.email,
      subject: `Your Digital Badge: ${event.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Event Badge is Ready!</h2>
          <p>Hello ${attendee.name},</p>
          <p>Thank you for attending <strong>${event.name}</strong>.</p>
          <p>Your digital badge has been minted and is now available.</p>
          ${
            nftLink
              ? `<p><a href="${nftLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Your Badge</a></p>`
              : ''
          }
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending badge email:', error)
    return false
  }
}

// Send event creation confirmation
const sendEventCreationEmail = async (event, organizerEmail) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: organizerEmail,
      subject: `Event Created: ${event.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Event Created Successfully</h2>
          <p>Your event <strong>${
            event.name
          }</strong> has been created successfully.</p>
          <p><strong>Event Details:</strong></p>
          <ul>
            <li>Date: ${new Date(event.date).toLocaleDateString()}</li>
            <li>Shareable Link: ${process.env.FRONTEND_URL}/register/${
        event.shareableLink
      }</li>
          </ul>
          <p>You can now share the registration link with your attendees.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending event creation email:', error)
    return false
  }
}

module.exports = {
  sendRegistrationEmail,
  sendBadgeEmail,
  sendEventCreationEmail,
}
