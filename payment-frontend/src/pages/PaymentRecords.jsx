import React, { useEffect, useState } from 'react';
import API from '../services/api'; // Tumhari centralized api.js
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  CreditCard
} from 'lucide-react';

const PaymentRecords = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Backend endpoint: /payments/history
        const response = await API.get('/payments/history');
        if (response.data.success) {
          setTransactions(response.data.data);
        }
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Status Badge Logic
  const getStatusBadge = (status) => {
    const styles = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
    };

    switch (status.toLowerCase()) {
      case 'captured':
      case 'success':
        return <span style={{ ...styles, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><CheckCircle2 size={14} /> Success</span>;
      case 'failed':
        return <span style={{ ...styles, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><XCircle size={14} /> Failed</span>;
      default:
        return <span style={{ ...styles, backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><Clock size={14} /> Pending</span>;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>
        Loading transactions...
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'rgba(0, 188, 235, 0.1)', padding: '10px', borderRadius: '12px' }}>
          <History size={24} color="#00bceb" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Transaction History</h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Track all your payments and their gateway status</p>
        </div>
      </div>

      {/* Table Section */}
      <div style={{ 
        backgroundColor: '#1E293B', 
        borderRadius: '16px', 
        border: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <th style={{ padding: '16px', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>DATE & TIME</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>NAVIGATOR ID</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>GATEWAY</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>AMOUNT</th>
              <th style={{ padding: '16px', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? transactions.map((tx) => (
              <tr key={tx._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: '0.2s' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: '14px' }}>{new Date(tx.createdAt).toLocaleDateString()}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{new Date(tx.createdAt).toLocaleTimeString()}</div>
                </td>
                <td style={{ padding: '16px', fontSize: '14px', fontFamily: 'monospace', color: '#38bdf8' }}>
                  {tx.orderId}
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', textTransform: 'capitalize' }}>
                    <CreditCard size={14} color="#64748b" /> {tx.gatewayUsed || 'N/A'}
                  </div>
                </td>
                <td style={{ padding: '16px', fontWeight: '700', fontSize: '15px' }}>
                  ₹{tx.amount.toLocaleString()}
                </td>
                <td style={{ padding: '16px' }}>
                  {getStatusBadge(tx.status)}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                  No transactions found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentRecords;