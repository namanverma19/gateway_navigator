// src/services/api.js

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// 🚀 Centralized API instance
const API = axios.create({
  baseURL: API_BASE_URL, 
});

// Interceptor: Har request ke saath token jayega automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ==========================================
// 💳 PAYMENT ENDPOINTS
// ==========================================
export const createOrder = (amount) => API.post('/payments/create-order', { amount });
export const verifyPayment = (paymentData) => API.post('/payments/verify', paymentData);

// 🟢 NAYA FUNCTION: Transaction History fetch karne ke liye
// Interceptor apne aap token bhej dega, aur .then(res => res.data) frontend ko direct payload de dega
export const getPaymentHistory = () => API.get('/payments/history').then(res => res.data);

export default API;