// src/components/BookingModal.js
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { checkAvailability, initializePayment, verifyPayment, createBooking } from '../services/api';

const BookingModal = ({ isOpen, onClose, room }) => {
  const [step, setStep] = useState(1);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    promoCode: '',
    email: '',
    phone: '',
    fullName: ''
  });

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    
    return daysDifference > 0 ? daysDifference : 0;
  };

  const calculateTotalPrice = () => {
    const nights = calculateNights();
    if (!room || !room.price || nights === 0) return 0;
    return room.price * nights;
  };

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
      setAvailabilityMessage("");
      setPaymentReference("");
      setFormData({
        checkIn: '',
        checkOut: '',
        guests: 1,
        promoCode: '',
        email: '',
        phone: '',
        fullName: ''
      });
    }
  }, [isOpen]);

  const handleAvailabilityCheck = async () => {
    if (!room || !room.id) {
      setAvailabilityMessage("Room information is missing. Please try again.");
      return;
    }

    setIsCheckingAvailability(true);
    setAvailabilityMessage("");
    
    try {
      const result = await checkAvailability(
        room.id,
        formData.checkIn,
        formData.checkOut
      );
      
      setAvailabilityMessage(result.message);
      
      if (result.available) {
        // Move to payment step instead of creating booking immediately
        setStep(3);
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      setAvailabilityMessage("Error checking availability. Please try again.");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const USD_TO_NGN_RATE = 1650;

  const convertUsdToNgn = (usdAmount, exchangeRate = USD_TO_NGN_RATE) => {
  return Math.round(usdAmount * exchangeRate);
};


  const fetchExchangeRate = async () => {
  try {
    // Using a free API for exchange rates
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    return data.rates.NGN;
  } catch (error) {
    console.error('Failed to fetch exchange rate, using fallback:', error);
    return USD_TO_NGN_RATE; // Fallback to fixed rate
  }
};

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    const totalPrice = calculateTotalPrice();

    const currentRate = await fetchExchangeRate();
    const totalPriceInNaira = convertUsdToNgn(totalPrice, currentRate);
    
    console.log(`Converting $${totalPrice} to $${totalPriceInNaira.toLocaleString()} at rate ${currentRate}`);

    try {
      // Initialize payment with backend
      const paymentData = await initializePayment({
        email: formData.email,
        amount: totalPriceInNaira, // Paystack expects amount in kobo (cents)
        currency: 'NGN',
        reference: `booking_${Date.now()}`,
        callback_url: `${window.location.origin}/payment-callback`,
        metadata: {
          roomId: room.id,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests,
          fullName: formData.fullName,
          phone: formData.phone,
          promoCode: formData.promoCode
        }
      });

      if (paymentData.status && paymentData.data) {
        setPaymentReference(paymentData.data.reference);
        
        // Redirect to Paystack payment page
        window.location.href = paymentData.data.authorization_url;
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      setAvailabilityMessage('Payment initialization failed. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  // Handle payment callback when user returns from Paystack
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    const status = urlParams.get('status');

    if (reference && status === 'success' && isOpen) {
      handlePaymentVerification(reference);
    } else if (reference && status === 'cancelled' && isOpen) {
      setAvailabilityMessage('Payment was cancelled. Please try again.');
      setStep(2);
    }
  }, [isOpen]);

  const handlePaymentVerification = async (reference) => {
    try {
      setIsProcessingPayment(true);
      
      // Verify payment with backend
      const verificationResult = await verifyPayment(reference);
      
      if (verificationResult.status === 'success') {
        // Create booking after successful payment verification
        const totalPrice = calculateTotalPrice();
        
        const bookingData = await createBooking(
          room.id,
          formData.checkIn,
          formData.checkOut,
          formData.email,
          formData.phone,
          formData.fullName,
          formData.guests,
          formData.promoCode,
          totalPrice,
          reference // Include payment reference
        );
        
        console.log('Booking created:', bookingData);
        setStep(4); // Success step
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      setAvailabilityMessage('Payment verification failed. Please contact support.');
      setStep(2);
    } finally {
      setIsProcessingPayment(false);
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const handleContinueClick = () => {
    if (step === 1) {
      nextStep();
    } else if (step === 2) {
      handleAvailabilityCheck();
    } else if (step === 3) {
      handlePayment();
    }
  };

  const nights = calculateNights();
  const totalPrice = calculateTotalPrice();

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

                    {nights > 0 && room && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 font-medium">
                            {nights} {nights === 1 ? 'night' : 'nights'} × ${room.price}
                          </span>
                          <span className="text-blue-800 font-bold text-lg">
                            ${totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="font-medium mb-4">Enter your details</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg mb-4"
                        placeholder="Full Name"
                        required
                      />
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg mb-4"
                        placeholder="Email"
                        required
                      />
                      <label className="block text-sm text-gray-600 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg mb-4"
                        placeholder="Phone"
                        required
                      />
                      <label className="block text-sm text-gray-600 mb-1">Promo Code (Optional)</label>
                      <input
                        type="text"
                        name="promoCode"
                        value={formData.promoCode}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg mb-4"
                        placeholder="Enter code"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {nights} {nights === 1 ? 'night' : 'nights'} × ${room ? room.price.toLocaleString() : '0'}
                          </span>
                          <span>${totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>${totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {availabilityMessage && (
                      <div className={`p-3 rounded-lg ${availabilityMessage.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                        {availabilityMessage}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="font-medium mb-4">Payment</h4>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center mb-3">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-700 font-medium">Room Available!</span>
                      </div>
                      <p className="text-green-600 text-sm">
                        Great! Your selected dates are available. Proceed with payment to confirm your booking.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Booking Summary</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Room:</span>
                          <span>{room?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-in:</span>
                          <span>{new Date(formData.checkIn).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-out:</span>
                          <span>{new Date(formData.checkOut).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Guests:</span>
                          <span>{formData.guests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nights:</span>
                          <span>{nights}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                          <span>Total Amount:</span>
                          <span>${totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-blue-700 text-sm">
                          Secure payment powered by Paystack
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
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
                  <p className="text-gray-600 mb-2">Payment successful! We've sent the details to your email.</p>
                  <p className="text-sm text-gray-500 mb-6">
                    {nights} {nights === 1 ? 'night' : 'nights'} • Total: ${totalPrice.toLocaleString()}
                  </p>
                  {paymentReference && (
                    <p className="text-xs text-gray-400 mb-4">
                      Reference: {paymentReference}
                    </p>
                  )}
                  <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </div>

            {step < 4 && (
              <div className="p-4 border-t flex justify-between">
                {step > 1 ? (
                  <button
                    onClick={prevStep}
                    className="text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                    disabled={isProcessingPayment}
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                <button
                  onClick={handleContinueClick}
                  disabled={
                    (step === 1 && (!formData.checkIn || !formData.checkOut)) ||
                    (step === 2 && (isCheckingAvailability || !formData.fullName || !formData.email || !formData.phone)) ||
                    (step === 3 && isProcessingPayment)
                  }
                  className={`px-6 py-2 rounded-lg ${
                    (step === 1 && (!formData.checkIn || !formData.checkOut)) ||
                    (step === 2 && (isCheckingAvailability || !formData.fullName || !formData.email || !formData.phone)) ||
                    (step === 3 && isProcessingPayment)
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {step === 2 && isCheckingAvailability 
                    ? 'Checking...' 
                    : step === 2 
                    ? 'Check Availability' 
                    : step === 3 && isProcessingPayment
                    ? 'Processing...'
                    : step === 3
                    ? 'Pay Now'
                    : 'Continue'
                  }
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