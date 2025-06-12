// components/RoomShowcase.js
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import rooms from "@/lib/rooms.json";


export default function RoomCard() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Rooms & Suites</h2>

         <motion.div
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
        <div className="grid md:grid-cols-2 gap-8">
          {rooms.map((room) => (
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
        </motion.div>

        <div className="text-center mt-8">
          <Link 
            to="/rooms" 
            className="text-blue-600 hover:underline font-medium"
          >
            View All Rooms →
          </Link>
        </div>
      </div>
    </section>
  );
}