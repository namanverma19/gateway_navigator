import React, { useState } from 'react';
import { createOrder, verifyPayment } from '../services/api'; 
import { PUBLIC_KEYS } from '../utils/constants';
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; 

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Cloth'); 

  const handlePayment = async (e) => {
    e.preventDefault();

    // ✅ FIX: Proper number validation
    if (!amount || Number(amount) <= 0) {
      return alert("Please enter a valid amount");
    }

    try {
      setLoading(true);

      const { data } = await createOrder(Number(amount)); 
      
      if (!data || data.success === false) {
        alert("Payment fail ho gayi ya sabhi gateways down hain! Please check backend console.");
        setLoading(false);
        return; 
      }

      const { order, gateway, navId, url } = data;

      console.log("🚀 BACKEND GAVE GATEWAY:", gateway);

      // --- 🟢 RAZORPAY ---
      if (gateway === 'razorpay') {
        const options = {
          key: PUBLIC_KEYS.RAZORPAY,
          amount: order.amount,
          currency: "INR", 
          name: "Gateway Navigator",
          description: `Buying ${category}`,
          order_id: order.id,

          // ✅ FIXED HANDLER
          handler: async (response) => {
            try {
              await verifyPayment({
                navId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              alert("Payment Success & Verified!");

              // ✅ FIX: define query params
              const queryParams = new URLSearchParams({
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                navId
              }).toString();

              window.location.href = `/payment-status?${queryParams}`;

            } catch (err) {
              console.error("Verification failed:", err);
              alert("Verification failed on backend!");
            } finally {
              setLoading(false); // ✅ ensure loader stops
            }
          },

          prefill: {
            email: "user@example.com", 
          },

          theme: { color: "#6366f1" },

          modal: {
            ondismiss: () => {
              console.log("Checkout closed");
              setLoading(false); // ✅ FIX loader
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }

      // --- 🔵 CASHFREE ---
      else if (gateway === 'cashfree') {
        console.log("💸 Opening Cashfree with Session:", order.payment_session_id);
        
        if (!window.Cashfree) {
          console.error("🚨 CASHFREE CRASH: window.Cashfree is undefined.");
          alert("Cashfree SDK load nahi hua! F12 Console check karo.");
          setLoading(false);
          return;
        }

        try {
          const cashfree = window.Cashfree({ mode: "sandbox" });
          
          cashfree.checkout({
            paymentSessionId: order.payment_session_id,
            redirectTarget: "_self", 
          }).then((result) => {
            if (result.error) {
              console.error("🚨 CASHFREE SDK ERROR:", result.error);
              alert(`Cashfree Error: ${result.error.message}`);
              setLoading(false); // ✅ FIX loader
            }
          });
        } catch (sdkError) {
          console.error("🚨 CASHFREE INITIALIZATION ERROR:", sdkError);
          alert("Cashfree chalu hone mein fail ho gaya.");
          setLoading(false); // ✅ FIX loader
        }
      }

      // --- 🟠 STRIPE ---
      else if (gateway === 'stripe') {
        window.location.href = url;
      }

      // ✅ FIX: fallback case
      else {
        alert("Unsupported payment gateway");
        setLoading(false);
      }

    } catch (error) {
      console.error("Navigator Error:", error);
      alert("Something went wrong with the Gateway switching.");
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>

      {loading && (
        <div style={loaderOverlay}>
          <div style={{ width: '350px', height: '350px' }}>
            <DotLottieReact
              src="https://lottie.host/e49808d0-7f38-4d6b-9ae7-13fe7317cd9b/hwq3D9bkvj.lottie"
              loop
              autoplay
            />
          </div>
          <h3 style={{ color: '#6366f1', fontFamily: 'sans-serif', marginTop: '10px' }}>
            Navigator is selecting the best gateway...
          </h3>
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ color: '#1e293b', marginBottom: '8px' }}>Secure Checkout</h2>

        <form onSubmit={handlePayment}>
          <div style={inputGroup}>
            <label style={labelStyle}>Enter Amount (INR)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="0.00"
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Select Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              style={inputStyle}
            >
              <option value="Cloth">Cloth</option>
              <option value="Books">Books</option>
              <option value="Grocery">Grocery</option>
              <option value="Utilities">Utilities</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={loading ? disabledButtonStyle : buttonStyle}
          >
            {loading ? "Processing..." : `Pay for ${category} (₹${amount || '0'})`}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES (UNCHANGED) ---
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' };
const cardStyle = { padding: '40px', background: '#fff', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', width: '420px', textAlign: 'center', border: '1px solid #e2e8f0' };
const inputGroup = { marginBottom: '20px', textAlign: 'left' };
const labelStyle = { fontWeight: '600', fontSize: '13px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' };
const inputStyle = { width: '100%', padding: '14px', marginTop: '8px', borderRadius: '12px', border: '2px solid #f1f5f9', fontSize: '16px', boxSizing: 'border-box', outline: 'none' };
const buttonStyle = { width: '100%', padding: '16px', backgroundColor: '#00B5FF', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' };
const disabledButtonStyle = { ...buttonStyle, backgroundColor: '#cbd5e1', boxShadow: 'none', cursor: 'not-allowed' };

const loaderOverlay = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.98)', display: 'flex', flexDirection: 'column',
  justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

export default Checkout;