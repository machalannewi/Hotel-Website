const API_BASE_URL = 'http://localhost:5000'; // Your backend URL

export const checkAvailability = async (roomId, checkIn, checkOut) => {
  const response = await fetch(
    `${API_BASE_URL}/api/rooms/availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`
  );
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};

// Add other API calls here (booking creation, etc.)