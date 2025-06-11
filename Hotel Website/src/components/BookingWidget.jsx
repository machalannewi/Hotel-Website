import React, { useState } from 'react';

export default function BookingWidget() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
      {!showForm ? (
        <div>
          <h3 className="text-xl font-bold mb-2">Stay with Us</h3>
          <p className="text-green-600 text-2xl mb-4">From $199/night</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full"
          >
            Check Availability
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-4">Book Your Room</h3>
          <div className="space-y-4">
            <input 
              type="date" 
              className="w-full p-3 border rounded-lg"
              placeholder="Check-in"
            />
            <input 
              type="date" 
              className="w-full p-3 border rounded-lg"
              placeholder="Check-out"
            />
            <select className="w-full p-3 border rounded-lg">
              <option>1 Guest</option>
              <option>2 Guests</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full">
              Next → 
            </button>
          </div>
        </div>
      )}
    </div>
  );
}