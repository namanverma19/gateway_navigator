export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL|| 'https://gateway-navigator.onrender.com/api';

export const AUTH_ENDPOINTS = {
    GOOGLE_LOGIN: `${API_BASE_URL}/auth/google`,
    MANUAL_LOGIN: `${API_BASE_URL}/users/login`,
    REGISTER: `${API_BASE_URL}/users/register`
};

export const PAYMENT_ENDPOINTS = {
    CREATE_ORDER: `${API_BASE_URL}/payments/create-order`,
    VERIFY_PAYMENT: `${API_BASE_URL}/payments/verify-payment`, // 👈 Backend se match kiya
    HISTORY: `${API_BASE_URL}/payments/history`,               // 👈 History endpoint add kiya
};

export const PUBLIC_KEYS = {
    RAZORPAY: import.meta.env.VITE_RAZORPAY_KEY_ID,
    STRIPE: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    CASHFREE: import.meta.env.VITE_CASHFREE_APP_ID
};
