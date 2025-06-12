// src/pages/Rooms.js
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from "../components/Navbar";
import allRooms from "@/lib/allRooms.json"


export default function Rooms() {
  const [priceFilter, setPriceFilter] = useState(400);

  return (
    <>
    <Header />
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div 
        className="bg-cover bg-center h-64 flex items-center justify-center"
        style={{ backgroundImage: "url('/images/rooms-hero.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 w-full h-full flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Our Rooms</h1>
        </div>
      </div>

      {/* Filter & Room Listings */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Filter by Price</h2>
          <input 
            type="range" 
            min="100" 
            max="700"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="w-full md:w-1/2"
          />
          <p className="mt-2 text-blue-600">
            Max Price: <span className="font-bold">${priceFilter}</span>
          </p>
        </div>

        {/* Room Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {allRooms
            .filter(room => room.price <= priceFilter)
            .map(room => ( 
              <div key={room.id} className="bg-white rounded-xl overflow-hidden shadow-lg">
                <img 
                src={room.image} 
                alt={room.name}
                className="w-full h-64 object-cover"
              />
                <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                <p className="text-gray-600 mb-4">{room.description}</p>
                <p className="text-blue-600 text-lg font-semibold mb-4">${room.price}/night</p>
                <Link
                  to={`/rooms/${room.id}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Book Now
                </Link>
              </div>
              </div>
            ))}
        </div>
      </section>
    </div>
    </>
  );
}