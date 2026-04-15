import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; 
import { AuthContext } from '../context/AuthContext';
import { AUTH_ENDPOINTS } from '../utils/constants';
import { User, Lock, EyeOff, Mail, BadgeCheck } from 'lucide-react'; 
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = AUTH_ENDPOINTS.GOOGLE_LOGIN;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        setLoading(true);
        // 🔵 LOGIN FLOW
        const { data } = await axios.post(AUTH_ENDPOINTS.MANUAL_LOGIN, { email, password });
        if (data.token) {
          login(data.token);
          navigate('/dashboard');
        }
      } else {
        setLoading(true);
        // 🟢 REGISTER FLOW (WITH EXACT OLD API HIT)
        // Yahan dummy password bhej rahe hain taaki backend khush rahe, 
        // asli password VerifyEmail page par set hoga.
        const { data } = await axios.post(AUTH_ENDPOINTS.REGISTER, { 
          name, 
          email, 
          password: "temp_password_123" 
        });
        
        if (data.success) {
          alert("Verification link sent! Please check your email inbox.");
          setIsLogin(true); // Wapas login page par bhej do
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Action failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="juspay-wrapper">
      <div className="auth-main-container">
        
        <div className="juspay-video-section">
          <h1 className="animation-top-brand">GATEWAY NAVIGATOR</h1>
          <DotLottieReact
            src="https://lottie.host/f9e0aa12-e584-40fe-85c7-1175c85d1b5f/DHiGqop8xv.lottie"
            loop autoplay className="juspay-lottie-animation"
          />
        </div>

        <div className="juspay-form-section">
          <div className="juspay-card">
            <div className="juspay-welcome-text">
              <h2>{isLogin ? "Log In" : "Create Account"}</h2>
              <p>{isLogin ? "Welcome back!" : "Verify your email to join the navigator"}</p>
            </div>

            <form onSubmit={handleSubmit}>
              
              {/* 🟢 Name field sirf Register mein dikhega */}
              {!isLogin && (
                <div className="juspay-input-group">
                  <label>Full Name</label>
                  <div className="input-with-icon">
                    <BadgeCheck size={18} className="icon-left" />
                    <input type="text" placeholder="Enter name" required value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                </div>
              )}

              <div className="juspay-input-group">
                <label>Email</label>
                <div className="input-with-icon">
                  <Mail size={18} className="icon-left" />
                  <input type="email" placeholder="Enter email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              {/* 🟢 Password field sirf Login mein dikhega */}
              {isLogin && (
                <div className="juspay-input-group animate-fade-in">
                  <label>Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="icon-left" />
                    <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    {/* <EyeOff size={18} className="icon-right pointer" /> */}
                  </div>
                </div>
              )}

              {/* 🟢 Main Action Button */}
              <button type="submit" className="juspay-btn-primary" disabled={loading}>
                 {loading ? "Processing..." : (isLogin ? "Login" : "Verify Email")}
              </button>
            </form>

            {/* 🟢 Toggle Text */}
            <p className="toggle-text">
              {isLogin ? "New here?" : "Already Registered?"} 
              <span onClick={() => { setIsLogin(!isLogin); }}>
                {isLogin ? " Create account" : " Back to login"}
              </span>
            </p>

            <div className="divider">Or</div>

            <button type="button" className="juspay-btn-google" onClick={handleGoogleLogin}>
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="G" />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;