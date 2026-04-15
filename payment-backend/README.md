# Payment Orchestration Management System (POMS)

## Overview

This project is a **Payment Orchestration Management System** similar to **Juspay**.

The platform sits **between customers, merchants, and payment gateways** and provides:
- Unified payment flow
- Gateway routing & retry logic
- Real-time payment status
- Analytics & dashboards
- Role-based access (Customer, Merchant, Admin)

The system supports:
- JWT + OAuth authentication
- Multiple payment gateways (Razorpay, Stripe, Cashfree – sandbox)
- WebSockets for real-time updates
- Chart-based analytics (Chart.js)

---

## Roles in the System

1. **Customer** – end user making a payment  
2. **Merchant** – business receiving payments  
3. **Admin (Platform / Juspay-like team)** – manages orchestration, health, risk  

Each role has **separate flows, permissions, and dashboards**.

---

# 1. CUSTOMER FLOW

## Goal
Allow a customer to make a payment easily, track its status, and see history.

---

## Step-by-Step Flow (Customer)

### Step 1: Customer enters merchant checkout
- Customer lands on merchant’s payment page
- Merchant embeds or redirects to **Customer Checkout UI**

---

### Step 2: Select payment method
Customer chooses:
- UPI
- Card
- Net Banking
- Wallet

This selection is sent to the orchestration backend.

---

### Step 3: Orchestration selects gateway
Backend decides:
- Which gateway to use (Razorpay / Stripe / Cashfree)
- Based on:
  - payment method
  - gateway health
  - routing rules (mock logic initially)

---

### Step 4: Payment initiation
- Backend creates a **transaction record** with status `PROCESSING`
- Customer is shown:
  - “Payment in progress”
  - Loader / animation

---

### Step 5: Gateway sandbox interaction
- Payment is processed using sandbox APIs
- No real money involved
- Gateway responds with `SUCCESS` or `FAILURE`

---

### Step 6: Real-time status update
- Backend updates database
- WebSocket emits payment status update
- Customer UI updates instantly:
  - Success screen
  - Failure / retry screen

---

### Step 7: Payment completion
Customer sees:
- Transaction ID
- Status
- Amount
- Time

---

### Step 8: Order history
- Customer can view past payments
- Data fetched from backend

---

# 2. MERCHANT FLOW

## Goal
Give merchants **visibility, analytics, and confidence** in payments.

---

## Step-by-Step Flow (Merchant)

### Step 1: Merchant login
- Merchant logs in using:
  - JWT (email/password)
  - OAuth (future)
- Role-based access → merchant dashboard only

---

### Step 2: Merchant dashboard landing
Merchant sees **summary KPIs**:
- Total transactions
- Total payment volume
- Success rate
- Failed transactions

---

### Step 3: Gateway health overview
Merchant can view:
- Success rate per gateway
- Gateway-wise transaction count
- Comparison between gateways

Displayed using:
- Bar charts
- Pie charts

---

### Step 4: Time-based analytics
Merchant can filter by:
- Today
- Last 7 days
- Last 30 days

Charts update dynamically:
- Volume over time
- Success rate over time

---

### Step 5: Transaction list
Merchant can:
- View all transactions
- Filter by:
  - status
  - gateway
  - payment method
  - date range

---

### Step 6: Retry visibility
Merchant can see:
- Payments where retry logic was applied
- Final outcome after retry
- Gateway switching information (read-only)

---

### Step 7: Real-time updates
- WebSocket pushes:
  - new transaction updates
  - gateway health changes
- Charts and tables update automatically

---

# 3. ADMIN (PLATFORM) FLOW

## Goal
Operate, monitor, and optimize the payment platform.

---

## Step-by-Step Flow (Admin)

### Step 1: Admin login
- Admin logs in with elevated role
- JWT + role-based middleware grants access

---

### Step 2: Platform overview dashboard
Admin sees:
- All merchants overview
- Total platform volume
- Overall success rate
- Gateway distribution

---

### Step 3: Merchant-wise drill-down
Admin can:
- Select a merchant
- View merchant-specific:
  - transactions
  - gateway usage
  - success rate

---

### Step 4: Gateway monitoring
Admin can view:
- Health of Razorpay / Stripe / Cashfree
- Success/failure trends
- Time-series performance

---

### Step 5: Retry logic monitoring
Admin can see:
- Where retries occurred
- Which gateway failed first
- Which gateway recovered the payment

This helps:
- tuning routing rules
- improving success rate

---

### Step 6: Risk analysis
Admin monitors:
- High-value transactions
- Multiple retry attempts
- Repeated failures

Used for:
- alerts
- future fraud logic (optional)

---

### Step 7: Real-time observability
- WebSockets broadcast live metrics
- Dashboards update without refresh

---

# Core System Characteristics

## Authentication
- JWT for session management
- OAuth for social login
- Role-based authorization at route level

## Payments
- Sandbox APIs only
- Mock routing logic
- Extensible for real gateways later

## Realtime
- WebSockets for:
  - payment status
  - gateway health
  - dashboard updates

## Analytics
- Metrics calculated in backend
- Stored in database
- Visualized using Chart.js

---
FOLDER STRUCTURE FOR FRONTEND 
frontend/
├── index.html                 # Vite / React entry HTML
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS config for Tailwind
├── package.json
│
└── src/
    ├── main.jsx               # ReactDOM entry (ONLY ONCE)
    ├── App.jsx                # App shell + route mounting
    ├── index.css              # Tailwind base styles + globals

    ├── routes/                # Role-based routing
    │   ├── PublicRoutes.jsx
    │   ├── CustomerRoutes.jsx
    │   ├── MerchantRoutes.jsx
    │   └── AdminRoutes.jsx

    ├── pages/                 # ROUTE-LEVEL SCREENS
    │   ├── auth/
    │   │   ├── RoleSelection.jsx
    │   │   ├── Login.jsx      # React Hook Form + Tailwind
    │   │   ├── Signup.jsx     # React Hook Form + Tailwind
    │   │   └── OAuthCallback.jsx
    │   │
    │   ├── customer/
    │   │   ├── Checkout.jsx   # React Hook Form + Tailwind
    │   │   ├── PaymentStatus.jsx
    │   │   └── OrderHistory.jsx
    │   │
    │   ├── merchant/
    │   │   ├── Dashboard.jsx
    │   │   ├── GatewayHealth.jsx
    │   │   ├── Transactions.jsx
    │   │   └── Analytics.jsx
    │   │
    │   └── admin/
    │       ├── Dashboard.jsx
    │       ├── MerchantManagement.jsx
    │       ├── GatewayMonitoring.jsx
    │       ├── RetryMonitoring.jsx
    │       └── RiskAnalysis.jsx

    ├── components/            # REUSABLE UI (Tailwind-based)
    │   ├── charts/
    │   │   ├── LineChart.jsx
    │   │   ├── BarChart.jsx
    │   │   └── PieChart.jsx
    │   │
    │   ├── ui/
    │   │   ├── Button.jsx     # Tailwind button variants
    │   │   ├── Loader.jsx
    │   │   ├── Modal.jsx
    │   │   └── Table.jsx
    │   │
    │   └── layout/
    │       ├── Navbar.jsx
    │       └── Sidebar.jsx

    ├── services/              # BACKEND COMMUNICATION
    │   ├── api.js
    │   ├── auth.service.js
    │   ├── payment.service.js
    │   ├── metrics.service.js
    │   └── gateway.service.js

    ├── hooks/                 # REUSABLE REACT LOGIC
    │   ├── useAuth.js
    │   ├── useWebSocket.js
    │   └── useRole.js

    ├── context/               # GLOBAL STATE
    │   └── AuthContext.jsx

    └── utils/                 # PURE JS HELPERS
        ├── constants.js
        └── formatters.js

  FOLDER STRUCTURE FOR THE  BACKEND 
  backend/
├── src/
│   ├── server.js                 # HTTP + WebSocket server bootstrap
│   ├── app.js                    # Express app (middlewares, routes)
│
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   ├── env.js                # env loader
│   │   └── passport.js           # OAuth (Google) strategy
│
│   ├── routes/
│   │   ├── auth.routes.js        # login, oauth, me
│   │   ├── payment.routes.js     # initiate, status, retry
│   │   ├── metrics.routes.js     # charts data
│   │   └── gateway.routes.js     # gateway health
│
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── payment.controller.js
│   │   ├── metrics.controller.js
│   │   └── gateway.controller.js
│
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── payment.service.js
│   │   ├── retry.service.js
│   │   ├── metrics.service.js
│   │   └── gateway/
│   │       ├── razorpay.service.js
│   │       ├── stripe.service.js
│   │       └── cashfree.service.js
│
│   ├── models/
│   │   ├── User.js
│   │   ├── Merchant.js
│   │   ├── Transaction.js
│   │   ├── GatewayLog.js
│   │   └── MetricsSnapshot.js
│
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   └── rateLimit.middleware.js
│
│   ├── sockets/
│   │   └── socket.js
│
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── logger.js
│   │   └── response.js
│
│   └── jobs/
│       └── metrics.job.js
│
├── .env
├── package.json
└── README.md

# gateway-navigator
