import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Checkout from './Checkout'; 
import { BarChart3, MoveDown } from 'lucide-react';

function Dashboard() {
  const gatewayStats = [
    { feature: 'Domestic PSR', stripe: '~85–92%', razorpay: '~90–98%', cashfree: '~90–97%' },
    { feature: 'International PSR', stripe: '~92–98% (Global Leader)', razorpay: '~70–85%', cashfree: '~70–80%' },
    { feature: 'UPI Success Rate', stripe: '88–92%', razorpay: '95%+ (via Turbo UPI)', cashfree: '94%+' },
    { feature: 'Primary Strength', stripe: 'International reach & API', razorpay: 'Ecosystem & Developer Docs', cashfree: 'High-volume Payout Speed' },
  ];

  const tableHeaderStyle = { 
    padding: '15px 12px', 
    color: '#64748b', 
    fontSize: '13px', 
    fontWeight: '600', 
    textAlign: 'left', 
    borderBottom: '2px solid #e2e8f0' 
  };
  
  const tableCellStyle = { 
    padding: '15px 12px', 
    color: '#334155', 
    fontSize: '14px', 
    borderBottom: '1px solid #f1f5f9' 
  };

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        
        <main style={{ padding: '40px', backgroundColor: '#f8fafc', flex: 1 }}>
          {/* --- HEADER --- */}
          <div style={{ marginBottom: '30px' }}>
             <h1 style={{ color: '#1e293b', fontSize: '2rem', fontWeight: '700' }}>Welcome to Dashboard</h1>
             <p style={{ color: '#64748b' }}>Navigate between various payments and subscriptions here.</p>
          </div>

          {/* --- 📊 GATEWAY COMPARISON TABLE SECTION --- */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <BarChart3 size={20} color="#00B5FF" />
              <h3 style={{ margin: 0, color: '#0f172a' }}>Indian Payment Gateways: 2026 Success Benchmark</h3>
            </div>
            
            <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '15px' }}>
              While <strong>Stripe</strong> leads in global reach, <strong>Razorpay</strong> dominates the Indian ecosystem with superior UPI flows, and <strong>Cashfree</strong> excels in rapid enterprise payouts.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>FEATURE</th>
                  <th style={tableHeaderStyle}>STRIPE (INDIA)</th>
                  <th style={tableHeaderStyle}>RAZORPAY</th>
                  <th style={tableHeaderStyle}>CASHFREE</th>
                </tr>
              </thead>
              <tbody>
                {gatewayStats.map((row, index) => (
                  <tr key={index}>
                    <td style={{ ...tableCellStyle, fontWeight: '600' }}>{row.feature}</td>
                    <td style={tableCellStyle}>{row.stripe}</td>
                    <td style={tableCellStyle}>{row.razorpay}</td>
                    <td style={tableCellStyle}>{row.cashfree}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>Use our platform for automated routing</span>
              <MoveDown color="#00B5FF" className="animate-bounce" />
            </div>
          </div>

          {/* --- 🛒 CHECKOUT SECTION (Placed at the bottom as requested) --- */}
          <div style={{ marginTop: '50px' }}>
            <Checkout />
          </div>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;