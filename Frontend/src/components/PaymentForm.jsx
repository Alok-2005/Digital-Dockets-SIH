import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentForm = ({ submissionId }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const BASE_URL = 'https://digital-dockets-sih-2.onrender.com' || 'http://localhost:3000';
  const handlePayment = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/admin/service/${submissionId}/payment`, {
        paymentStatus: 'success'
      });

      if (response.data.success) {
        toast.success('Payment successful');
        setPaymentStatus('success');
      } else {
        toast.error('Payment failed');
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Error processing payment');
    }
  };

  return (
    <div>
      <h2>Payment Required</h2>
      <button onClick={handlePayment} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Pay Now
      </button>
      {paymentStatus === 'success' && <p>Payment successful!</p>}
      {paymentStatus === 'failed' && <p>Payment failed. Please try again.</p>}
    </div>
  );
};

export default PaymentForm;