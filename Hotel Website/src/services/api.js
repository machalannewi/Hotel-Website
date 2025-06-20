const API_BASE_URL = 'https://hotel-website-72pz.onrender.com';

export const checkAvailability = async (roomId, checkIn, checkOut) => {
  const response = await fetch(
    `${API_BASE_URL}/api/rooms/availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`
  );
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};

export const createBooking = async (roomId, checkIn, checkOut, email, phone, fullName, guests, promoCode, totalPrice) => {
  const response = await fetch(`${API_BASE_URL}/api/bookings/input?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&email=${email}&phone=${phone}&fullName=${fullName}&guests=${guests}&promoCode=${promoCode}&totalPrice=${totalPrice}`)
  if (!response.ok) throw new Error('Booking failed');
  return await response.json();
}

// Fixed Paystack payment functions
export const initializePayment = async (paymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Payment initialization failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Payment initialization error:', error);
    throw error;
  }
};

export const verifyPayment = async (reference) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Payment verification failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

// Example usage function for payment initialization
export const processPayment = async (bookingData) => {
  try {
    // Prepare payment data
    const paymentData = {
      email: bookingData.email,
      amount: bookingData.totalPrice, // Amount in Naira
      currency: 'NGN',
      metadata: {
        booking_id: bookingData.bookingId,
        customer_name: bookingData.fullName,
        phone: bookingData.phone,
        room_id: bookingData.roomId,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        guests: bookingData.guests
      }
    };
    
    // Initialize payment
    const paymentResponse = await initializePayment(paymentData);
    
    if (paymentResponse.status) {
      // Redirect to Paystack payment page
      window.location.href = paymentResponse.data.authorization_url;
    } else {
      throw new Error('Payment initialization failed');
    }
  } catch (error) {
    console.error('Process payment error:', error);
    throw error;
  }
};

// Function to handle payment callback (call this on your callback page)
export const handlePaymentCallback = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    const status = urlParams.get('status');
    
    if (!reference) {
      throw new Error('No payment reference found');
    }
    
    if (status === 'cancelled') {
      return {
        status: 'cancelled',
        message: 'Payment was cancelled'
      };
    }
    
    // Verify payment
    const verificationResponse = await verifyPayment(reference);
    
    return verificationResponse;
  } catch (error) {
    console.error('Payment callback error:', error);
    throw error;
  }
};