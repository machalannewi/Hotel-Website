// PaymentCallback.jsx - Create this new component
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { checkAvailability, createBooking, verifyPayment } from '../services/api'; // Your API functions file


const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('verifying');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [availabilityMessage, setAvailabilityMessage] = useState("");


  useEffect(() => {
    const handlePaymentCallback = async () => {

      try {
        const reference = searchParams.get('reference') || searchParams.get('trxref');
        const status = searchParams.get('status');

        if (!reference) {
          setError('No payment reference found');
          setPaymentStatus('error');
          return;
        }

        if (status === 'cancelled') {
          setPaymentStatus('cancelled');
          return;
        }


        const verificationResponse = await verifyPayment(reference);

        const meta = verificationResponse.data.metadata
        setMetadata(meta);

        if (verificationResponse.status === 'success') {
          setPaymentStatus('success');
          setPaymentData(verificationResponse.data);


          const result = await checkAvailability(
            meta.roomId,
            meta.checkIn,
            meta.checkOut
          )
          
        setAvailabilityMessage(result.message);

        if (result.available) {      

            const bookingData = await createBooking (
            meta.roomId,
            meta.checkIn,
            meta.checkOut,
            meta.email,
            meta.phone,
            meta.fullName,
            meta.guests,
            meta.promoCode,
            meta.totalPrice,
            meta.roomName
            );

            console.log(`Booking Data ${bookingData}`);
          }

           setTimeout(() => {
                navigate("/")
            }, 3000)

        } else {
          setPaymentStatus('failed');
          setError(verificationResponse.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        setError(error.message || 'An error occurred while verifying payment');
        setPaymentStatus('error');
      }
    };

    handlePaymentCallback();
  }, [searchParams, navigate]);

  const renderContent = () => {
    switch (paymentStatus) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
            <p className="text-gray-600 mb-4">An email has been sent to you with booking details.</p>
            {paymentData && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Reference:</strong> {paymentData.reference}</p>
                <p><strong>Amount:</strong> ₦{(paymentData.amount / 100).toLocaleString()}</p>
              </div>
            )}
          </div>
        );

      case 'failed':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">{error || 'Your payment could not be processed.'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        );

      case 'cancelled':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-yellow-600 mb-2">Payment Cancelled</h2>
            <p className="text-gray-600 mb-4">You cancelled the payment process.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">An Error Occurred</h2>
            <p className="text-gray-600 mb-4">{error || 'Something went wrong while processing your payment.'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Booking
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentCallback;