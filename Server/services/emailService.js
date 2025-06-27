import createTransporter from '../config/emailConfig.js';
import { createBookingConfirmationEmail } from '../utils/emailTemplates.js';

export const sendBookingConfirmationEmail = async (bookingDetails) => {
  try {
    const transporter = createTransporter();
    const emailContent = createBookingConfirmationEmail(bookingDetails);
    
    const mailOptions = {
      from: `"Monarch" <${process.env.EMAIL_USER}>`,
      to: bookingDetails.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return { success: false, error: error.message };
  }
};