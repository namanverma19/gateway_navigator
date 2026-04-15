import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <nav style={{
      height: '70px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    }}>
      <div style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>
        <span style={{ color: '#00B5FF' }}>Dashboard </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
            <User size={20} color="#64748b" />
          </div>
          <span style={{ fontWeight: '500', color: '#334155' }}>Profile</span>
        </div>
        
        <button 
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'transparent', border: '1px solid #ef4444',
            color: '#ef4444', padding: '6px 15px', borderRadius: '6px',
            cursor: 'pointer', transition: '0.3s', fontWeight: '500'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;