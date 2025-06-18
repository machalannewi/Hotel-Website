import React from 'react';
import { motion } from 'framer-motion';
import BookingWidget from './BookingWidget';

export default function Hero() {
  return (


  <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
  >
  <div 
      className="relative h-screen bg-cover bg-center flex items-center"
      style={{ backgroundImage: "url('/images/Hero-banner.webp')" }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-2xl">
          <motion.div
          initial={{opacity: 0, x: 100}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.8}}
          >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Luxury Redefined
          </h1>
          </motion.div>
          <motion.div
          initial={{opacity: 0, x: -100}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.8}}
          >
          <p className="text-xl text-white mb-8">
            Experience coastal elegance at Monarch Hotels.
          </p>
          </motion.div>

        </div>
      <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      >
        <BookingWidget />
     </motion.div>

      </div>
    </div>
  </motion.div>


  );
}