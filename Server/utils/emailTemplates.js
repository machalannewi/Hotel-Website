export const createBookingConfirmationEmail = (bookingDetails) => {
  const { fullName, email, roomName, checkIn, checkOut, guests, totalPrice, nights, paymentReference } = bookingDetails;
  
  const checkInDate = new Date(checkIn).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const checkOutDate = new Date(checkOut).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    subject: 'Booking Confirmation - Your Stay is Confirmed!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .total-row { background: #e3f2fd; padding: 15px; border-radius: 5px; margin-top: 10px; }
          .total-price { font-size: 24px; font-weight: bold; color: #1976d2; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f0f0f0; border-radius: 5px; }
          .contact-info { margin-top: 20px; font-size: 14px; color: #666; }
          .success-icon { font-size: 48px; margin-bottom: 10px; }
          @media (max-width: 600px) {
            .container { padding: 10px; }
            .header, .content { padding: 20px; }
            .detail-row { flex-direction: column; }
            .label { margin-bottom: 5px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
            <p style="color: white;">Thank you for choosing our hotel, ${fullName}!</p>
          </div>
          
          <div class="content">
            <h2>Your Reservation Details</h2>
            
            <div class="booking-details">
              <div class="detail-row">
                <span class="label">Confirmation Number:</span>
                <span class="value">${paymentReference || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Guest Name:</span>
                <span class="value">${fullName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
              </div>
              <div class="detail-row">
                <span class="label">Room Type:</span>
                <span class="value">${roomName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Check-in:</span>
                <span class="value">${checkInDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">Check-out:</span>
                <span class="value">${checkOutDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">Number of Guests:</span>
                <span class="value">${guests}</span>
              </div>
              <div class="detail-row">
                <span class="label">Number of Nights:</span>
                <span class="value">${nights}</span>
              </div>
              
              <div class="total-row">
                <div class="detail-row">
                  <span class="label">Total Amount Paid:</span>
                  <span class="value total-price">$${totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2e7d32; margin-top: 0;">Important Information</h3>
              <ul style="color: #2e7d32; margin: 0;">
                <li>Check-in time: 3:00 PM</li>
                <li>Check-out time: 11:00 AM</li>
                <li>Please bring a valid ID for check-in</li>
                <li>Free Wi-Fi is available throughout the hotel</li>
                <li>Complimentary breakfast is served from 7:00 AM to 10:00 AM</li>
              </ul>
            </div>
            
            <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #f57c00; margin-top: 0;">Need to Make Changes?</h3>
              <p style="color: #f57c00; margin: 0;">
                If you need to modify or cancel your reservation, please contact us at least 24 hours before your check-in date.
              </p>
            </div>
          </div>
          
          <div class="footer">
            <h3>We look forward to welcoming you!</h3>
            <div class="contact-info">
              <p><strong>Hotel Contact Information:</strong></p>
              <p>📞 Phone: +1 (555) 123-4567</p>
              <p>📧 Email: reservations@hotel.com</p>
              <p>🏨 Address: 123 Hotel Street, City, State 12345</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
              This is an automated confirmation email. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Booking Confirmation
      
      Dear ${fullName},
      
      Your booking has been confirmed! Here are your reservation details:
      
      Confirmation Number: ${paymentReference || 'N/A'}
      Guest Name: ${fullName}
      Email: ${email}
      Room Type: ${roomName}
      Check-in: ${checkInDate}
      Check-out: ${checkOutDate}
      Guests: ${guests}
      Nights: ${nights}
      Total Amount Paid: $${totalPrice.toLocaleString()}
      
      Important Information:
      - Check-in time: 3:00 PM
      - Check-out time: 11:00 AM
      - Please bring a valid ID for check-in
      - Free Wi-Fi available throughout the hotel
      - Complimentary breakfast: 7:00 AM to 10:00 AM
      
      Contact Information:
      Phone: +1 (555) 123-4567
      Email: reservations@hotel.com
      Address: 123 Hotel Street, City, State 12345
      
      We look forward to welcoming you!
    `
  };
};