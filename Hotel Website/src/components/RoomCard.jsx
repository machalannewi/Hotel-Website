import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function RoomCard({ room }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="border rounded-xl overflow-hidden shadow-lg"
    >
      <img 
        src={room.image} 
        alt={room.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{room.name}</h3>
        <p className="text-green-600 text-lg mb-4">${room.price}/night</p>
        <Link
          to={`/rooms/${room.id}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}