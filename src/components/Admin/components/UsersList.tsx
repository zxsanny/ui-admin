import React from 'react';
import { parseHardware, roleCode, roleLabel, getLastLoginValue } from '../utils/parsers';
import { formatMemoryGB, formatUTCDate } from '../utils/formatters';
import { User, ApiFunction } from '../types';

interface UsersListProps {
  users: User[] | null;
  onSearch: (searchEmail: string) => void;
  searchValue: string;
  api: ApiFunction;
  setStatusMessage: (message: string) => void;
  onUserUpdate?: () => void;
}

const UsersList: React.FC<UsersListProps> = ({ 
  users, 
  onSearch, 
  searchValue, 
  api, 
  setStatusMessage, 
  onUserUpdate 
}) => {

  const handleToggleUser = async (email: string, isEnabled: boolean) => {
    const action = isEnabled ? 'disable' : 'enable';
    setStatusMessage(`${action === 'enable' ? 'Enabling' : 'Disabling'} user...`);
    
    try {
      await api(`/users/${encodeURIComponent(email)}/${action}`, { method: 'PUT' });
      setStatusMessage(`User ${action}d successfully`);
      if (onUserUpdate) onUserUpdate();
    } catch (e: any) {
      setStatusMessage(`Failed to ${action} user: ${e.message}`);
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${email}"? This action cannot be undone.`)) {
      return;
    }
    
    setStatusMessage('Deleting user...');
    
    try {
      await api(`/users/${encodeURIComponent(email)}`, { method: 'DELETE' });
      setStatusMessage('User deleted successfully');
      if (onUserUpdate) onUserUpdate();
    } catch (e: any) {
      setStatusMessage(`Failed to delete user: ${e.message}`);
    }
  };

  const handleResetHardware = async (email: string) => {
    if (!window.confirm(`Are you sure you want to reset hardware for user "${email}"? This will clear all hardware information.`)) {
      return;
    }
    
    setStatusMessage('Resetting hardware...');
    
    try {
      await api(`/users/${encodeURIComponent(email)}/hardware`, { method: 'DELETE' });
      setStatusMessage('Hardware reset successfully');
      if (onUserUpdate) onUserUpdate();
    } catch (e: any) {
      setStatusMessage(`Failed to reset hardware: ${e.message}`);
    }
  };

  const arr = Array.isArray(users) ? users : (users ? [users] : []);
  if (!arr.length) {
    return <div style={{ color: '#94a3b8', fontSize: '12px' }}>No users found.</div>;
  }

  // Sort so role 10 users go first
  if (arr.length > 1) {
    arr.sort((a, b) => {
      const a10 = roleCode(a && a.role) === 10;
      const b10 = roleCode(b && b.role) === 10;
      if (a10 && !b10) return -1;
      if (b10 && !a10) return 1;
      return 0;
    });
  }

  return (
    <>
      {arr.map(u => {
        const { text: rText, cls: rCls } = roleLabel(u.role);
        const hw = parseHardware(u.hardware);
        
        
        const lastLoginRaw = u.lastLogin || u.last_login || u.lastLoginAt || u.last_login_at || u.lastSeen || u.last_seen || u.lastSeenAt || u.last_seen_at || u.last_activity || u.lastActivity;
        const lastLoginDisplay = getLastLoginValue(lastLoginRaw);
        
        // Get queue offset (only the first one)
        const qo = (u.userConfig && u.userConfig.queueOffsets) || {};
        const queueOffset = qo.annotationsOffset ?? '';
        const isEnabled = u.isEnabled !== false; // Default to enabled if property is missing
        
        return (
          <div key={u.id} className="card" style={{
            padding: '16px',
            minHeight: '200px',
            opacity: isEnabled ? 1 : 0.6,
            filter: isEnabled ? 'none' : 'grayscale(0.3)',
            border: isEnabled ? '1px solid #2a3b5f' : '1px solid #374151'
          }}>
            {/* Header with email and badges */}
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#93c5fd' }}>
                {u.email || 'User'}
              </h4>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap' as const
              }}>
                <div>
                  {rText && (
                    <span className={`badge ${rCls}`} style={{
                      display: 'inline-block',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '14px',
                      border: '1px solid #2b3650',
                      background: 'rgba(99, 102, 241, 0.18)',
                      color: '#c7d2fe',
                      fontWeight: '500'
                    }}>
                      {rText}
                    </span>
                  )}
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  border: '1px solid #4b5563',
                  background: '#374151',
                  color: '#e5e7eb',
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap' as const,
                  fontWeight: '500'
                }}>
                  Last Login: {lastLoginDisplay}
                </span>
              </div>
            </div>
            
            {/* Queue Panel */}
            {queueOffset && (
              <div style={{ 
                background: '#0b1223',
                border: '1px solid #1b2536',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '8px',
                minHeight: '60px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>Queue Offset</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#e5e7eb' }}>{queueOffset}</div>
                </div>
                <button 
                  className="btn-small" 
                  style={{
                    height: '48px',
                    fontSize: '14px',
                    padding: '10px 18px',
                    background: '#6366f1',
                    border: '1px solid #5154e6',
                    color: '#e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    lineHeight: '1.3',
                    whiteSpace: 'normal' as const,
                    textAlign: 'center' as const,
                    width: '80px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Set Offset
                </button>
              </div>
            )}
            
            
            {/* Hardware Panel */}
            <div style={{ 
              background: '#0b1223',
              border: '1px solid #1b2536',
              borderRadius: '6px',
              padding: '12px',
              minHeight: '80px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}>
              <div style={{ flex: '1' }}>
                <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Hardware</div>
                <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                  {hw && hw.cpu ? (
                    <div style={{ marginBottom: '3px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '11px' }}>CPU: </span>
                      {hw.cpu}
                    </div>
                  ) : (
                    <div style={{ marginBottom: '3px', color: '#6b7280' }}>
                      <span style={{ color: '#94a3b8', fontSize: '11px' }}>CPU: </span>Unknown
                    </div>
                  )}
                  {hw && hw.gpu ? (
                    <div style={{ 
                      color: hw.gpu.toLowerCase().includes('nvidia') ? '#86efac' : 
                             hw.gpu.toLowerCase().includes('amd') || hw.gpu.toLowerCase().includes('radeon') ? '#fca5a5' : '#c7d2fe',
                      fontWeight: hw.gpu.toLowerCase().includes('nvidia') || hw.gpu.toLowerCase().includes('amd') ? 600 : 'normal',
                      marginBottom: '3px'
                    }}>
                      <span style={{ color: '#94a3b8', fontSize: '11px' }}>GPU: </span>
                      {hw.gpu}
                    </div>
                  ) : (
                    <div style={{ marginBottom: '3px', color: '#6b7280' }}>
                      <span style={{ color: '#94a3b8', fontSize: '11px' }}>GPU: </span>Unknown
                    </div>
                  )}
                  {hw && hw.memory ? (
                    <div style={{ marginBottom: '3px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '11px' }}>Memory: </span>
                      {formatMemoryGB(hw.memory)}
                    </div>
                  ) : (
                    <div style={{ marginBottom: '3px', color: '#6b7280' }}>
                      <span style={{ color: '#94a3b8', fontSize: '11px' }}>Memory: </span>Unknown
                    </div>
                  )}
                  {hw && hw.drive ? (
                    <div>
                      <span style={{ color: '#94a3b8', fontSize: '11px' }}>Drive: </span>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{hw.drive}</span>
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280' }}>
                      <span style={{ color: '#94a3b8', fontSize: '11px' }}>Drive: </span>Unknown
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => handleResetHardware(u.email)}
                className="btn-small" 
                style={{
                  height: '48px',
                  fontSize: '14px',
                  padding: '10px 18px',
                  background: '#991b1b',
                  border: '1px solid #b91c1c',
                  color: '#e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginLeft: '12px',
                  lineHeight: '1.3',
                  whiteSpace: 'normal' as const,
                  textAlign: 'center' as const,
                  width: '80px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Reset Hardware
              </button>
            </div>
            
            {/* User Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              marginTop: '4px',
              paddingTop: '4px',
              borderTop: '1px solid #1b2536',
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={() => handleToggleUser(u.email, isEnabled)}
                style={{
                  height: '30px',
                  fontSize: '12px',
                  padding: '6px 12px',
                  background: isEnabled ? '#92400e' : '#166534',
                  border: isEnabled ? '1px solid #a16207' : '1px solid #15803d',
                  color: '#e5e7eb',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  lineHeight: '1.3',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isEnabled ? 'Disable' : 'Enable'}
              </button>
              
              <button 
                onClick={() => handleDeleteUser(u.email)}
                style={{
                  height: '30px',
                  fontSize: '12px',
                  padding: '6px 12px',
                  background: '#7f1d1d',
                  border: '1px solid #991b1b',
                  color: '#e5e7eb',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  lineHeight: '1.3',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default UsersList;
