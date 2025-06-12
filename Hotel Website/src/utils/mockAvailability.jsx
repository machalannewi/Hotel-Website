export const checkRoomAvailability = (roomId, checkIn, checkOut) => {
  // Mock unavailable dates (in real app, this would be an API call)
  const unavailableDates = {
    1: ["2023-12-25", "2023-12-31"], // Room ID 1
    2: ["2023-12-20", "2023-12-22"]  // Room ID 2
  };
  

  // Convert to timestamps for comparison
  const checkInTime = new Date(checkIn).getTime();
  const checkOutTime = new Date(checkOut).getTime();

  // Check if any dates fall in unavailable range
  const isUnavailable = unavailableDates[roomId]?.some(date => {
    const unavailableTime = new Date(date).getTime();
    return unavailableTime >= checkInTime && unavailableTime <= checkOutTime;
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        available: !isUnavailable,
        message: isUnavailable 
          ? "Selected dates are unavailable" 
          : "Room is available!"
      });
    }, 500); // Simulate network delay
  });
};