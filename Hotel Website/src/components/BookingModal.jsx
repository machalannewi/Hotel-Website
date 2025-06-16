// src/components/BookingModal.js
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { checkAvailability } from '../services/api';

const BookingModal = ({ isOpen, onClose, room }) => {
  const [step, setStep] = useState(1);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [availabilityMessage, setAvailabilityMessage] = useState("")
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    promoCode: ''
  });

  const handleChange = (e) => {

  const { name, value } = e.target;
  if (name === "checkOut" && formData.checkIn && value < formData.checkIn) {
    return;
  }
    
  setFormData({ ...formData, [name]: value });
  };



  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFormData({
        checkIn: '',
        checkOut: '',
        guests: 1,
        promoCode: ''
      });
    }
  }, [isOpen]);


// Replace your mock function with:
const handleAvailabilityCheck = async () => {
  setIsCheckingAvailability(true);
  try {
    const result = await checkAvailability(
      room.id,
      formData.checkIn,
      formData.checkOut
    );
    setAvailabilityMessage(result.message);
    if (result.available) setStep(2);
  } catch (error) {
    setAvailabilityMessage("Error checking availability", error);
  } finally {
    setIsCheckingAvailability(false);
  }
};



  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">
                {room ? `Book ${room.name}` : 'Book Your Stay'}
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>


            <div className="p-6">
              {step === 1 && (
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="font-medium mb-4">Select Dates</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Check-in</label>
                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Check-out</label>
                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                        min={formData.checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Guests</label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="font-medium mb-4">Payment Details</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Promo Code (Optional)</label>
                      <input
                        type="text"
                        name="promoCode"
                        value={formData.promoCode}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Enter code"
                      />
                    </div>
                    {/* Add payment fields here */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span>Total:</span>
                        <span className="font-bold">${room ? room.price * 2 : '0'}</span>
                      </div>
                      <small className="text-gray-500">*2 nights estimate</small>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Booking Confirmed!</h4>
                  <p className="text-gray-600 mb-6">We've sent the details to your email.</p>
                  <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </div>

            {/* Footer Navigation */}
            {step < 3 && (
              <div className="p-4 border-t flex justify-between">
                {step > 1 ? (
                  <button
                    onClick={prevStep}
                    className="text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                <button
                  onClick={
                    step === 2 ? (handleAvailabilityCheck ? () => nextStep() : nextStep) : null
                  }
                  disabled={step === 1 && (!formData.checkIn || !formData.checkOut)}
                  className={`px-6 py-2 rounded-lg ${step === 1 && (!formData.checkIn || !formData.checkOut) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {step === 2 ? 'Confirm Booking' : 'Continue'}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;