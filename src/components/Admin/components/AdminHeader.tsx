import React from 'react';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header style={{ 
      padding: '16px', 
      borderBottom: '1px solid #1f2937',
      position: 'sticky' as const,
      top: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(6px)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        gap: '12px' 
      }}>
        <h1 style={{ margin: '0', fontSize: '20px' }}>Azaion Admin</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={onLogout}
            style={{
              height: '36px',
              padding: '0 12px',
              borderRadius: '8px',
              border: '1px solid #1f2937',
              background: '#111827',
              color: '#e5e7eb',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

