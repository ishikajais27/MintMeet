// const nodemailer = require('nodemailer')
// const { generateApiResponse } = require('./helpers')

// // Email configuration
// const createTransporter = () => {
//   return nodemailer.createTransporter({
//     service: process.env.EMAIL_SERVICE || 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   })
// }

// // Send registration confirmation email
// const sendRegistrationEmail = async (attendee, event) => {
//   try {
//     const transporter = createTransporter()

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: attendee.email,
//       subject: `Registration Confirmation: ${event.name}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2>Event Registration Confirmation</h2>
//           <p>Hello ${attendee.name},</p>
//           <p>You have successfully registered for <strong>${
//             event.name
//           }</strong>.</p>
//           <p><strong>Event Details:</strong></p>
//           <ul>
//             <li>Date: ${new Date(event.date).toLocaleDateString()}</li>
//             <li>Organizer: ${event.organizer}</li>
//           </ul>
//           <p>We look forward to seeing you at the event!</p>
//           <hr>
//           <p style="color: #666; font-size: 12px;">
//             This is an automated message. Please do not reply to this email.
//           </p>
//         </div>
//       `,
//     }

//     await transporter.sendMail(mailOptions)
//     return true
//   } catch (error) {
//     console.error('Error sending registration email:', error)
//     return false
//   }
// }

// // Send badge minting notification email
// const sendBadgeEmail = async (attendee, event, nftLink) => {
//   try {
//     const transporter = createTransporter()

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: attendee.email,
//       subject: `Your Digital Badge: ${event.name}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2>Your Event Badge is Ready!</h2>
//           <p>Hello ${attendee.name},</p>
//           <p>Thank you for attending <strong>${event.name}</strong>.</p>
//           <p>Your digital badge has been minted and is now available.</p>
//           ${
//             nftLink
//               ? `<p><a href="${nftLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Your Badge</a></p>`
//               : ''
//           }
//           <hr>
//           <p style="color: #666; font-size: 12px;">
//             This is an automated message. Please do not reply to this email.
//           </p>
//         </div>
//       `,
//     }

//     await transporter.sendMail(mailOptions)
//     return true
//   } catch (error) {
//     console.error('Error sending badge email:', error)
//     return false
//   }
// }

// // Send event creation confirmation
// const sendEventCreationEmail = async (event, organizerEmail) => {
//   try {
//     const transporter = createTransporter()

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: organizerEmail,
//       subject: `Event Created: ${event.name}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2>Event Created Successfully</h2>
//           <p>Your event <strong>${
//             event.name
//           }</strong> has been created successfully.</p>
//           <p><strong>Event Details:</strong></p>
//           <ul>
//             <li>Date: ${new Date(event.date).toLocaleDateString()}</li>
//             <li>Shareable Link: ${process.env.FRONTEND_URL}/register/${
//         event.shareableLink
//       }</li>
//           </ul>
//           <p>You can now share the registration link with your attendees.</p>
//           <hr>
//           <p style="color: #666; font-size: 12px;">
//             This is an automated message. Please do not reply to this email.
//           </p>
//         </div>
//       `,
//     }

//     await transporter.sendMail(mailOptions)
//     return true
//   } catch (error) {
//     console.error('Error sending event creation email:', error)
//     return false
//   }
// }

// module.exports = {
//   sendRegistrationEmail,
//   sendBadgeEmail,
//   sendEventCreationEmail,
// }
const nodemailer = require('nodemailer')

// Check if email credentials are configured
const hasEmailConfig = () => {
  return process.env.EMAIL_USER && process.env.EMAIL_PASS
}

// Create email transporter
const createTransporter = () => {
  if (!hasEmailConfig()) {
    throw new Error(
      'Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.'
    )
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// Email templates
const emailTemplates = {
  badgeMinted: (attendeeName, eventName, nftLink) => ({
    subject: `🎉 Your ${eventName} Attendance Badge is Ready!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your NFT Badge</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                   color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; 
                   color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
            <p>Your attendance badge for ${eventName} has been minted as an NFT</p>
          </div>
          <div class="content">
            <h2>Hello ${attendeeName},</h2>
            <p>Your proof of attendance badge for <strong>${eventName}</strong> has been successfully minted on the blockchain!</p>
            
            <p>This unique NFT badge serves as a permanent record of your participation.</p>
            
            <div style="text-align: center;">
              <a href="${nftLink}" class="button">View Your NFT Badge</a>
            </div>
            
            <p><strong>What's next?</strong></p>
            <ul>
              <li>View your NFT on the blockchain</li>
              <li>Add it to your digital wallet</li>
              <li>Showcase it as proof of your participation</li>
            </ul>
            
            <p>If you have any questions, please reply to this email.</p>
            
            <p>Best regards,<br>The ${eventName} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} MintMeet. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // New template for CSV registration confirmation
  csvRegistration: (attendeeName, eventName, eventDetails = {}) => ({
    subject: `✅ Successfully Registered for ${eventName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Registration Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
                   color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .event-details { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Registration Confirmed!</h1>
            <p>You've been successfully registered for ${eventName}</p>
          </div>
          <div class="content">
            <h2>Hello ${attendeeName},</h2>
            <p>Your registration for <strong>${eventName}</strong> has been successfully processed!</p>
            
            ${
              eventDetails.date || eventDetails.location
                ? `
            <div class="event-details">
              <h3>Event Details:</h3>
              ${
                eventDetails.date
                  ? `<p><strong>Date:</strong> ${new Date(
                      eventDetails.date
                    ).toLocaleDateString()}</p>`
                  : ''
              }
              ${
                eventDetails.time
                  ? `<p><strong>Time:</strong> ${eventDetails.time}</p>`
                  : ''
              }
              ${
                eventDetails.location
                  ? `<p><strong>Location:</strong> ${eventDetails.location}</p>`
                  : ''
              }
            </div>
            `
                : ''
            }
            
            <p><strong>What to expect next:</strong></p>
            <ul>
              <li>You'll receive event reminders as the date approaches</li>
              <li>Check your email for any updates or changes</li>
              <li>Bring your confirmation (this email) to the event</li>
            </ul>
            
            <p>If you have any questions or need to make changes to your registration, 
            please contact the event organizers.</p>
            
            <p>We look forward to seeing you at the event!</p>
            
            <p>Best regards,<br>The ${eventName} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} MintMeet. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
}

// Send badge email
const sendBadgeEmail = async (attendee, event, nftLink) => {
  try {
    // Check if email is configured
    if (!hasEmailConfig()) {
      console.log('📧 Email not configured. Skipping email send.')
      return {
        success: true,
        skipped: true,
        message:
          'Email not configured. NFT was minted successfully but email was not sent.',
      }
    }

    const transporter = createTransporter()

    const template = emailTemplates.badgeMinted(
      attendee.name,
      event.name,
      nftLink
    )

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: attendee.email,
      subject: template.subject,
      html: template.html,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error sending badge email:', error.message)
    return {
      success: false,
      error: error.message,
      details:
        'Email configuration error. Check your EMAIL_USER and EMAIL_PASS environment variables.',
    }
  }
}

// Send welcome email for event registration
const sendWelcomeEmail = async (attendee, event) => {
  try {
    // Check if email is configured
    if (!hasEmailConfig()) {
      console.log('📧 Email not configured. Skipping welcome email.')
      return {
        success: true,
        skipped: true,
        message:
          'Email not configured. Registration was successful but welcome email was not sent.',
      }
    }

    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: attendee.email,
      subject: `✅ Registered for ${event.name}`,
      html: `
        <h2>Welcome to ${event.name}!</h2>
        <p>Hello ${attendee.name},</p>
        <p>You have successfully registered for <strong>${
          event.name
        }</strong>.</p>
        <p><strong>Event Details:</strong></p>
        <ul>
          <li>Date: ${new Date(event.date).toLocaleDateString()}</li>
          <li>Time: ${event.time}</li>
          <li>Location: ${event.location}</li>
        </ul>
        <p>We look forward to seeing you there!</p>
        <p>Best regards,<br>The ${event.name} Team</p>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Welcome email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending welcome email:', error.message)
    return {
      success: false,
      error: error.message,
      details: 'Email configuration error',
    }
  }
}

// NEW: Send registration confirmation for CSV-imported attendees
const sendCSVRegistrationEmail = async (attendeeData, event) => {
  try {
    // Check if email is configured
    if (!hasEmailConfig()) {
      console.log('📧 Email not configured. Skipping CSV registration email.')
      return {
        success: true,
        skipped: true,
        message:
          'Email not configured. Registration was successful but confirmation email was not sent.',
      }
    }

    const transporter = createTransporter()

    const template = emailTemplates.csvRegistration(
      attendeeData.name,
      event.name,
      {
        date: event.date,
        time: event.time,
        location: event.location,
      }
    )

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: attendeeData.email,
      subject: template.subject,
      html: template.html,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log(
      '✅ CSV registration email sent to:',
      attendeeData.email,
      'Message ID:',
      result.messageId
    )
    return {
      success: true,
      messageId: result.messageId,
      email: attendeeData.email,
    }
  } catch (error) {
    console.error(
      '❌ Error sending CSV registration email to',
      attendeeData.email,
      ':',
      error.message
    )
    return {
      success: false,
      error: error.message,
      email: attendeeData.email,
      details: 'Failed to send registration confirmation email',
    }
  }
}

// Test email configuration
const testEmailConfig = async () => {
  try {
    if (!hasEmailConfig()) {
      return {
        success: false,
        error: 'Email credentials not configured',
        details: 'Please set EMAIL_USER and EMAIL_PASS environment variables',
      }
    }

    const transporter = createTransporter()

    // Verify connection configuration
    await transporter.verify()

    return {
      success: true,
      message: 'Email configuration is valid',
      user: process.env.EMAIL_USER,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: 'Email configuration test failed. Check your credentials.',
    }
  }
}

module.exports = {
  sendBadgeEmail,
  sendWelcomeEmail,
  sendCSVRegistrationEmail, // NEW: Export the new function
  testEmailConfig,
  hasEmailConfig,
}
