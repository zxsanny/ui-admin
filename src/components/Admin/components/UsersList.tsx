import React from 'react';
import { parseHardware, roleCode, roleLabel, getLastLoginValue } from '../utils/parsers';
import { formatMemoryGB } from '../utils/formatters';
import { User, ApiFunction } from '../types';
import LoadingSkeleton from './LoadingSkeleton';

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
  const [editingRoleEmail, setEditingRoleEmail] = React.useState<string | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<number>(0);

  const roles = [
    { value: 0, label: 'None' },
    { value: 10, label: 'Operator' },
    { value: 20, label: 'Validator' },
    { value: 30, label: 'CompanionPC' },
    { value: 40, label: 'Admin' },
    { value: 50, label: 'ResourceUploader' },
    { value: 1000, label: 'ApiAdmin' }
  ];

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

  const handleChangeRole = async (email: string, newRole: number) => {
    setStatusMessage('Changing role...');
    
    try {
      await api(`/users/${encodeURIComponent(email)}/set-role/${newRole}`, { method: 'PUT' });
      setStatusMessage('Role changed successfully');
      setEditingRoleEmail(null);
      if (onUserUpdate) onUserUpdate();
    } catch (e: any) {
      setStatusMessage(`Failed to change role: ${e.message}`);
    }
  };

  const arr = Array.isArray(users) ? users : (users ? [users] : []);
  
  if (users === null) {
    return <LoadingSkeleton count={3} />;
  }
  
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
          <div key={u.id} className="card user-card" style={{
            padding: '24px',
            minHeight: '280px',
            opacity: isEnabled ? 1 : 0.6,
            filter: isEnabled ? 'none' : 'grayscale(0.3)',
            border: isEnabled ? '1px solid #374151' : '1px solid #4b5563',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            boxShadow: isEnabled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Header with email and badges */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ 
                margin: '0 0 12px', 
                fontSize: '22px', 
                fontWeight: '700', 
                color: '#f1f5f9',
                lineHeight: '1.2'
              }}>
                {u.email || 'User'}
              </h4>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap' as const,
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {editingRoleEmail === u.email ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(Number(e.target.value))}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #3b82f6',
                          background: '#1e293b',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleChangeRole(u.email, selectedRole)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #10b981',
                          background: '#10b981',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingRoleEmail(null)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #ef4444',
                          background: '#ef4444',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      {rText && (
                        <span className={`badge ${rCls}`} style={{
                          display: 'inline-block',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          border: '1px solid #3b82f6',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          color: '#ffffff',
                          fontWeight: '600',
                          boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                        }}>
                          {rText}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setEditingRoleEmail(u.email);
                          setSelectedRole(roleCode(u.role));
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '20px',
                          border: '1px solid #475569',
                          background: '#374151',
                          color: '#9ca3af',
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          fontWeight: '500',
                          boxShadow: 'none',
                          height: '36px'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background = '#4b5563';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background = '#374151';
                        }}
                        title="Edit role"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                        </svg>
                      </button>
                    </>
                  )}
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  border: '1px solid #475569',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: '#cbd5e1',
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap' as const,
                  fontWeight: '500',
                  backdropFilter: 'blur(4px)'
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
            <div className="hardware-panel" style={{ 
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '16px',
              minHeight: '100px',
              backdropFilter: 'blur(4px)',
              marginBottom: '16px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <div style={{ 
                  color: '#94a3b8', 
                  fontSize: '14px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Hardware
                </div>
                <button 
                  onClick={() => handleResetHardware(u.email)}
                  className="btn-small hardware-reset-btn" 
                  style={{
                    height: '32px',
                    fontSize: '12px',
                    padding: '6px 12px',
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    border: '1px solid #dc2626',
                    color: '#ffffff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    lineHeight: '1.3',
                    whiteSpace: 'nowrap' as const,
                    textAlign: 'center' as const,
                    minWidth: '70px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                    (e.target as HTMLElement).style.boxShadow = '0 4px 8px rgba(220, 38, 38, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.transform = 'translateY(0)';
                    (e.target as HTMLElement).style.boxShadow = '0 2px 4px rgba(220, 38, 38, 0.3)';
                  }}
                >
                  Reset
                </button>
              </div>
              <div style={{ flex: '1' }}>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  {hw && hw.cpu ? (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>CPU: </span>
                      <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{hw.cpu}</span>
                    </div>
                  ) : (
                    <div style={{ marginBottom: '8px', color: '#64748b' }}>
                      <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>CPU: </span>
                      <span style={{ color: '#64748b' }}>Unknown</span>
                    </div>
                  )}
                  {hw && hw.gpu ? (
                    <div style={{ 
                      color: hw.gpu.toLowerCase().includes('nvidia') ? '#10b981' : 
                             hw.gpu.toLowerCase().includes('amd') || hw.gpu.toLowerCase().includes('radeon') ? '#f59e0b' : '#8b5cf6',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>GPU: </span>
                      {hw.gpu}
                    </div>
                  ) : (
                    <div style={{ marginBottom: '8px', color: '#64748b' }}>
                      <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>GPU: </span>
                      <span style={{ color: '#64748b' }}>Unknown</span>
                    </div>
                  )}
                  {hw && hw.memory ? (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>Memory: </span>
                      <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{formatMemoryGB(hw.memory)}</span>
                    </div>
                  ) : (
                    <div style={{ marginBottom: '8px', color: '#64748b' }}>
                      <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>Memory: </span>
                      <span style={{ color: '#64748b' }}>Unknown</span>
                    </div>
                  )}
                  {hw && hw.drive ? (
                    <div>
                      <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>Drive: </span>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#cbd5e1', wordBreak: 'break-all' }}>{hw.drive}</span>
                    </div>
                  ) : (
                    <div style={{ color: '#64748b' }}>
                      <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>Drive: </span>
                      <span style={{ color: '#64748b', fontSize: '11px' }}>Unknown</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* User Action Buttons */}
            <div className="user-action-buttons" style={{ 
              display: 'flex', 
              gap: '12px', 
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #334155',
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={() => handleToggleUser(u.email, isEnabled)}
                style={{
                  height: '36px',
                  fontSize: '13px',
                  padding: '8px 16px',
                  background: isEnabled 
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: isEnabled ? '1px solid #f59e0b' : '1px solid #10b981',
                  color: '#ffffff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  lineHeight: '1.3',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '80px',
                  boxShadow: isEnabled 
                    ? '0 2px 4px rgba(245, 158, 11, 0.3)' 
                    : '0 2px 4px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                  (e.target as HTMLElement).style.boxShadow = isEnabled 
                    ? '0 4px 8px rgba(245, 158, 11, 0.4)' 
                    : '0 4px 8px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = isEnabled 
                    ? '0 2px 4px rgba(245, 158, 11, 0.3)' 
                    : '0 2px 4px rgba(16, 185, 129, 0.3)';
                }}
              >
                {isEnabled ? 'Disable' : 'Enable'}
              </button>
              
              <button 
                onClick={() => handleDeleteUser(u.email)}
                style={{
                  height: '36px',
                  fontSize: '13px',
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  border: '1px solid #dc2626',
                  color: '#ffffff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  lineHeight: '1.3',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '80px',
                  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                  (e.target as HTMLElement).style.boxShadow = '0 4px 8px rgba(220, 38, 38, 0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = '0 2px 4px rgba(220, 38, 38, 0.3)';
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
