import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import LoginSuccess from './pages/LoginSuccess';
import Dashboard from './pages/Dashboard';
import PaymentStatus from './pages/PaymentStatus'; 
import PaymentRecords from './pages/PaymentRecords'; 
import Checkout from './pages/Checkout'; // 👈 Checkout import karna mat bhoolna

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          
          {/* Gateway Redirects ke liye common status page */}
          <Route path="/payment-status" element={<PaymentStatus />} />

          {/* --- Protected Dashboard Layout --- */}
          {/* Yahan humne wildcard (*) hata kar nest kiya hai taaki Layout barish na ho */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          >
            {/* 🚀 Dashboard ke Outlet mein ye pages load honge */}
            
            {/* 1. Default (Jab sirf /dashboard khule): Checkout dikhao */}
            <Route index element={<Checkout />} /> 
            
            {/* 2. Payment Records: Jab /dashboard/payment_records khule */}
            <Route path="payment_records" element={<PaymentRecords />} />
          </Route>
          
          {/* Catch-all Route: Seedha Login pe bhej do */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;