import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchRoomAvailabilty } from "../services/api"

export default function BookingWidget() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "checkOut" && formData.checkIn && value <= formData.checkIn) {
      return;
    }
   
    setFormData({ ...formData, [name]: value });
  };

  const handleAvailabilityCheck = async () => {
    // Form validation
    if (!formData.checkIn || !formData.checkOut) {
      setAvailabilityMessage("Please select both check-in and check-out dates.");
      return;
    }

    if (formData.checkOut <= formData.checkIn) {
      setAvailabilityMessage("Check-out date must be after check-in date.");
      return;
    }

    setIsLoading(true);
    setIsCheckingAvailability(true);
    setAvailabilityMessage("");
     
    try {
      const result = await searchRoomAvailabilty(
        formData.checkIn,
        formData.checkOut
      );
       
      setAvailabilityMessage(result.message);
       
      if (result.available && result.rooms && result.rooms.length > 0) {
        // Store available rooms
        setAvailableRooms(result.rooms);
        
        // Navigate to results page with search parameters
        const searchParams = new URLSearchParams({
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          availableRoomsCount: result.rooms.length.toString()
        });
        
        // Navigate to rooms page with filters applied
        navigate(`/rooms?${searchParams.toString()}`);
        
      } else {
        // Show message for no available rooms
        setAvailabilityMessage(result.message || "No rooms available for selected dates.");
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      setAvailabilityMessage("Error checking availability. Please try again.");
    } finally {
      setIsCheckingAvailability(false);
      setIsLoading(false);
    }
  };

  // Reset form function
  const handleReset = () => {
    setShowForm(false);
    setFormData({
      checkIn: '',
      checkOut: ''
    });
    setAvailabilityMessage("");
    setAvailableRooms([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
      {!showForm ? (
        <div>
          <h3 className="text-xl font-bold mb-2">Stay with Us</h3>
          <p className="text-green-600 text-2xl mb-4">From $199/night</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full transition-colors"
          >
            Check Availability
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Check for available rooms</h3>
            <button
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date
              </label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={formData.checkIn || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            
            {/* Display availability message */}
            {availabilityMessage && (
              <div className={`p-3 rounded-lg text-sm ${
                availabilityMessage.includes('Error') || availabilityMessage.includes('No rooms')
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-green-100 text-green-700 border border-green-300'
              }`}>
                {availabilityMessage}
              </div>
            )}
            
            <button
              onClick={handleAvailabilityCheck}
              disabled={isCheckingAvailability || !formData.checkIn || !formData.checkOut}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                isCheckingAvailability || !formData.checkIn || !formData.checkOut
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isCheckingAvailability ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Checking...
                </div>
              ) : (
                'Search Available Rooms'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}