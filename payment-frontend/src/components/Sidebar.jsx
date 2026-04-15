import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  History, 
  Settings, 
  Waypoints, 
  ShieldCheck 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <CreditCard size={20} />, label: 'Payment Record', path: '/payment_records' }, // Path update for nesting
    { icon: <History size={20} />, label: 'Gateway Payments', path: '/dashboard/gateway_payments' },
    { icon: <Settings size={20} />, label: 'Info', path: '/dashboard/info' },
  ];

  return (
    <div style={sidebarContainer}>
      {/* Logo Section */}
      <div style={logoSection}>
        <Waypoints size={30} color="#00bceb" strokeWidth={1.75} />
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}> Gateway Navigator</span>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, marginTop: '20px' }}> {/* Top margin added for space after logo */}
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            // Logic for isActive combined with spacing
            style={({ isActive }) => ({
              ...navLinkStyle,
              backgroundColor: isActive ? 'rgba(0, 181, 255, 0.12)' : 'transparent',
              color: isActive ? '#00B5FF' : '#94a3b8',
              marginBottom: '15px', // 🚀 GAP INCREASED HERE (8px -> 15px)
            })}
          >
            {item.icon}
            <span style={{ fontWeight: '500', fontSize: '14px' }}>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Status Card */}
      <div style={statusCard}>
        <div style={secureTag}>
          <ShieldCheck size={14} /> Secure Mode On
        </div>
        <p style={{ margin: 0, fontSize: '11px', color: '#64748b', marginTop: '5px' }}>
          Gateway: <span style={{ color: '#94a3b8' }}>Razorpay Active</span>
        </p>
      </div>
    </div>
  );
};

// --- Styles Update ---

const sidebarContainer = {
  width: '260px',
  backgroundColor: '#0F172A',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  padding: '24px', // Slightly increased padding
  minHeight: '100vh',
  position: 'sticky',
  top: 0,
  borderRight: '1px solid rgba(255, 255, 255, 0.05)' // Subtle border for definition
};

const logoSection = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '50px', // 🚀 MORE SPACE AFTER LOGO (40px -> 50px)
  padding: '5px'
};

const navLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 18px', // Slightly wider padding
  borderRadius: '10px',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'all 0.25s ease-in-out'
};

const statusCard = {
  padding: '20px',
  backgroundColor: 'rgba(255,255,255,0.02)',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.05)',
  marginTop: '20px'
};

const secureTag = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#10b981',
  fontSize: '12.5px',
  fontWeight: '600'
};

export default Sidebar;