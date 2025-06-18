import React, { useState, useEffect } from 'react';

export default function MonarchLoader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          
          setTimeout(() => {
            setIsVisible(false);
          }, 1200);
          
          return 100;
        }
        const increment = Math.random() * 12 + 3;
        return Math.min(prev + increment, 100);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-opacity duration-700 ${
      isComplete ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className="text-center">
        <div className="mb-4">
          <div className="relative inline-block">
            <img
              src="images/logo-icon.png"
              className="w-12 h-12 md:w-16 md:h-16 animate-spin"
              alt="Monarch Logo"
            />
          </div>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8 tracking-wide">
          <span className="text-gray-900">MON</span>
          <span className="text-blue-600">ARCH</span>
        </h1>
      </div>
    </div>
  );
}