import React from 'react';
import BookingWidget from './BookingWidget';

export default function Hero() {
  return (
    <div 
      className="relative h-screen bg-cover bg-center flex items-center"
      style={{ backgroundImage: "url('/images/Hero-banner.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Luxury Redefined
          </h1>
          <p className="text-xl text-white mb-8">
            Experience coastal elegance at Freehand Hotels.
          </p>
        </div>
        <BookingWidget />
      </div>
    </div>
  );
}