const API_BASE_URL = 'https://hotel-website-72pz.onrender.com';

export const checkAvailability = async (roomId, checkIn, checkOut) => {
  const response = await fetch(
    `${API_BASE_URL}/api/rooms/availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`
  );
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};

export const searchRoomAvailabilty = async (checkIn, checkOut) => {
  const response = await fetch(
    `${API_BASE_URL}/api/search-rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`
  );
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};

export const createBooking = async (roomId, checkIn, checkOut, email, phone, fullName, guests, promoCode, totalPrice, roomName) => {
  const response = await fetch(`${API_BASE_URL}/api/bookings/input?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&email=${email}&phone=${phone}&fullName=${fullName}&guests=${guests}&promoCode=${promoCode}&totalPrice=${totalPrice}&roomName=${roomName}`)
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
