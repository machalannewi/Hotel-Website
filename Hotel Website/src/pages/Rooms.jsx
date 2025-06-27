import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from "../components/Navbar";
import Footer from "../components/Footer";
import allRooms from "@/lib/allRooms.json"
import BookingModal from '@/components/BookingModal';
import { searchRoomAvailabilty } from "../services/api";

export default function Rooms() {
  const location = useLocation();
  const [priceFilter, setPriceFilter] = useState(400);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchParams, setSearchParams] = useState({
    checkIn: null,
    checkOut: null,
  });

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const checkIn = urlParams.get('checkIn');
    const checkOut = urlParams.get('checkOut');

    if (checkIn && checkOut) {
      setSearchParams({ checkIn, checkOut });
      setSearchActive(true);
      fetchAvailableRooms(checkIn, checkOut);
    }
  }, [location.search]);

  // Fetch available rooms based on search criteria
  const fetchAvailableRooms = async (checkIn, checkOut) => {
    setIsLoadingAvailability(true);
    try {
      const result = await searchRoomAvailabilty(checkIn, checkOut);
      if (result.available && result.rooms) {
        setAvailableRooms(result.rooms);
      } else {
        setAvailableRooms([]);
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      setAvailableRooms([]);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  // Clear search and show all rooms
  const clearSearch = () => {
    setSearchActive(false);
    setAvailableRooms([]);
    setSearchParams({ checkIn: null, checkOut: null});
    // Clear URL parameters
    window.history.replaceState({}, '', '/rooms');
  };

  // Get rooms to display based on search status
  const getRoomsToDisplay = () => {
    if (searchActive) {
      // If search is active, filter available rooms by price
      return availableRooms.filter(room => room.price <= priceFilter);
    } else {
      // If no search, show all rooms filtered by price
      return allRooms.filter(room => room.price <= priceFilter);
    }
  };

  const handleBookNow = (room) => {
    setSelectedRoom({
      ...room,
      // Pass search dates to the booking modal if available
      prefilledCheckIn: searchParams.checkIn,
      prefilledCheckOut: searchParams.checkOut,
      prefilledGuests: searchParams.guests
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const roomsToDisplay = getRoomsToDisplay();

  return (
    <>
      <Header />
      <div className="min-h-screen">
        {/* Hero Banner */}
        <div className="relative bg-cover bg-center h-64 flex items-center justify-center bg-[url('/images/woman-talking-phone-front-view.jpg')]">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative bg-opacity-50 w-full h-full flex items-center justify-center">
            <h1 className="relative text-4xl font-bold text-white">Our Rooms</h1>
          </div>
        </div>

        {/* Search Results Banner */}
        {searchActive && (
          <div className="bg-blue-50 border-b border-blue-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-2 md:mb-0">
                  <h3 className="text-lg font-semibold text-blue-800">
                    Search Results
                  </h3>
                  <p className="text-blue-600 text-sm">
                    {searchParams.checkIn} to {searchParams.checkOut}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-blue-600 text-sm">
                    {isLoadingAvailability ? 'Loading...' : `${availableRooms.length} available room${availableRooms.length !== 1 ? 's' : ''}`}
                  </span>
                  <button
                    onClick={clearSearch}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Room Listings */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Filter by Price
            </h2>
            <input
              type="range"
              min="50"
              max="1500"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full md:w-1/2"
            />
            <p className="mt-2 text-blue-600">
              Max Price: <span className="font-bold">${priceFilter}</span>
            </p>
          </div>

          {/* Loading State */}
          {isLoadingAvailability && (
            <div className="text-center py-8">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">Checking room availability...</span>
              </div>
            </div>
          )}

          {/* No Results Message */}
          {searchActive && !isLoadingAvailability && roomsToDisplay.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Available Rooms
                </h3>
                <p className="text-gray-600 mb-4">
                  No rooms are available for your selected dates and price range.
                </p>
                <button
                  onClick={clearSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  View All Rooms
                </button>
              </div>
            </div>
          )}

          {/* Room Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {roomsToDisplay.map(room => (
              <div key={room.id} className="bg-white rounded-xl overflow-hidden shadow-lg">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{room.name}</h3>
                    {searchActive && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Available
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{room.description}</p>
                  <p className="text-blue-600 text-lg font-semibold mb-4">
                    ${room.price}/night
                  </p>
                  <button
                    onClick={() => handleBookNow(room)}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {searchActive ? 'Book This Room' : 'Book Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          room={selectedRoom}
        />
      </div>
      <Footer />
    </>
  );
}