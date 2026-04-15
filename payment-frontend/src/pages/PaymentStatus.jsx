import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../services/api'; // Tumhari api.js se import kiya

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleVerification = async () => {
      const navId = searchParams.get('navId');
      const cf_order_id = searchParams.get('cf_order_id');

      if (navId && cf_order_id) {
        try {
          // 🚀 Tumhari api.js ka verifyPayment call ho raha hai
          const response = await verifyPayment({ navId, cf_order_id });

          if (response.data.success) {
            // ✅ Verification SUCCESS -> seedha Dashboard
            navigate('/dashboard', { state: { message: "Payment Successful!" } });
          } else {
            // ❌ Fail -> wapas Checkout
            navigate('/checkout', { state: { error: "Payment verification failed" } });
          }
        } catch (err) {
          console.error("Verification Error", err);
          navigate('/checkout');
        }
      }
    };

    handleVerification();
  }, [searchParams, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0F172A', color: 'white' }}>
      <h2>Payment Verify ho rahi hai... tension mat lo!</h2>
    </div>
  );
};

export default PaymentStatus;