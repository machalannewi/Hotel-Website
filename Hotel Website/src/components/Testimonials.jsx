import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Best hotel experience ever! The ocean view was unforgettable.",
    author: "Jane D.",
    rating: 5
  },
  {
    quote: "Impeccable service and stunning rooms. Will definitely return.",
    author: "Michael T.",
    rating: 5
  },
  {
    quote: "The staff went above and beyond to make our stay perfect.",
    author: "Sarah L.",
    rating: 5
  },
  {
    quote: "Luxury at its finest. Every detail was thoughtfully planned.",
    author: "David R.",
    rating: 5
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000); // Resume auto-play after 8 seconds
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Guest Reviews
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover what our guests are saying about their unforgettable experiences
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main carousel container */}
          <div 
            className="relative h-80 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Testimonial slides */}
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="min-w-full flex items-center justify-center p-12"
                >
                  <div className="text-center max-w-2xl">
                    <div className="mb-6">
                      <svg
                        className="w-12 h-12 text-blue-200 mx-auto mb-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    
                    <blockquote className="text-xl md:text-2xl text-gray-700 font-medium italic mb-8 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex flex-col items-center space-y-3">
                      <div className="flex space-x-1">
                        {renderStars(testimonial.rating)}
                      </div>
                      <cite className="text-lg font-semibold text-gray-800 not-italic">
                        {testimonial.author}
                      </cite>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 hover:text-blue-600 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 hover:text-blue-600 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}