const API_BASE_URL = 'http://localhost:5000'; // Your backend URL

export const checkAvailability = async (roomId, checkIn, checkOut) => {
  const response = await fetch(
    `${API_BASE_URL}/api/rooms/availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`
  );
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};


export const createBooking = async (roomId, checkIn, checkOut, email, phone, fullName, guests, promoCode) => {
const response = await fetch(`${API_BASE_URL}/api/bookings/input?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&email=${email}&phone=${phone}&fullName=${fullName}&guests=${guests}&promoCode=${promoCode}`)
  if (!response.ok) throw new Error('Booking failed');
  return await response.json();
}

// Add other API calls here (booking creation, etc.)