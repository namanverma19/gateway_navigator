import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { API_BASE_URL } from '../utils/constants';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  // Nayi States
  const [status, setStatus] = useState(token ? 'idle' : 'error'); // 'idle', 'submitting', 'success', 'error'
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('The link is invalid or has expired.');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setStatus('submitting');
    try {
      // 🚨 DHYAN DEIN: Ab hum POST request use kar rahe hain taaki password safe rahe
      const { data } = await axios.post(`${API_BASE_URL}/users/verify-email`, {
        token: token,
        newPassword: password
      });

      if (data.success) {
        setStatus('success');
        // 3 second baad login par bhej do
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.response?.data?.message || "Verification failed.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.animationBox}>
          <DotLottieReact
            src="https://lottie.host/f9e0aa12-e584-40fe-85c7-1175c85d1b5f/DHiGqop8xv.lottie"
            loop
            autoplay
          />
        </div>

        {/* 🟢 STEP 1: Enter Password State */}
        {status === 'idle' && (
          <form onSubmit={handleSubmit}>
            <h2 style={styles.text}>Set Your Password</h2>
            <p style={styles.subText}>Create a secure password to complete your registration.</p>
            
            <input 
              type="password" 
              placeholder="Enter new password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            
            <button type="submit" style={styles.button}>
              Confirm Registration
            </button>
          </form>
        )}

        {/* 🟢 STEP 2: Loading State */}
        {status === 'submitting' && (
          <h2 style={styles.text}>Setting up your account...</h2>
        )}

        {/* 🟢 STEP 3: Success State */}
        {status === 'success' && (
          <div>
            <h2 style={{ ...styles.text, color: '#10b981' }}>Registration Complete!</h2>
            <p style={styles.subText}>You can now login. Redirecting you...</p>
          </div>
        )}

        {/* 🔴 STEP 4: Error State */}
        {status === 'error' && (
          <div>
            <h2 style={{ ...styles.text, color: '#ef4444' }}>Verification Failed!</h2>
            <p style={styles.subText}>{errorMessage}</p>
            <button onClick={() => navigate('/login')} style={styles.button}>Back to Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Inline Styles
const styles = {
  container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '400px', width: '90%' },
  animationBox: { width: '200px', height: '200px', margin: '0 auto 20px' },
  text: { fontSize: '1.5rem', color: '#0F172A', marginBottom: '10px' },
  subText: { color: '#64748b', fontSize: '0.9rem', marginBottom: '15px' },
  input: { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' },
  button: { width: '100%', padding: '12px', backgroundColor: '#00B5FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }
};

export default VerifyEmail;