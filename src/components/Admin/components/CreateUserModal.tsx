import React, { useState } from 'react';
import { ROLE_OPTIONS } from '../config/constants';
import { CreateUserFormData, ApiFunction } from '../types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateUserFormData) => void;
  onError: (error: string) => void;
  api: ApiFunction;
  setStatusMessage: (message: string) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onError,
  api,
  setStatusMessage
}) => {
  const [formData, setFormData] = useState<CreateUserFormData>({
    email: '',
    password: '',
    role: 0 // Default to 0 (None role)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setStatusMessage('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Creating user...');
    
    try {
      // Convert role to number before sending
      const userData = {
        ...formData,
        role: typeof formData.role === 'string' ? parseInt(formData.role, 10) : formData.role
      };
      
      // Make the API call directly
      const result = await api('/users', { method: 'POST', json: userData });
      console.log('User creation result:', result);
      
      setStatusMessage('User created successfully!');
      
      // Call the parent's onSubmit for any additional handling
      await onSubmit(formData);
      
      // Close modal immediately
      handleClose();
      
    } catch (e: any) {
      console.error('User creation error:', e);
      const errorMessage = `Failed to create user: ${e.message}`;
      setStatusMessage(errorMessage);
      onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', password: '', role: 0 });
    onClose();
  };

  const handleInputChange = (field: keyof CreateUserFormData, value: string) => {
    if (field === 'role') {
      setFormData(prev => ({ ...prev, [field]: parseInt(value, 10) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1f2937',
        border: '1px solid #374151',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: '#e5e7eb'
          }}>
            Create New User
          </h3>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = '#e5e7eb';
              (e.target as HTMLElement).style.backgroundColor = '#374151';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = '#94a3b8';
              (e.target as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>


        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#e5e7eb'
            }}>
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="user@azaion.com"
              required
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '2px solid #374151',
                background: '#111827',
                color: '#e5e7eb',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #6366f1';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid #374151';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#e5e7eb'
            }}>
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '2px solid #374151',
                background: '#111827',
                color: '#e5e7eb',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #6366f1';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid #374151';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#e5e7eb'
            }}>
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '2px solid #374151',
                background: '#111827',
                color: '#e5e7eb',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #6366f1';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid #374151';
                e.target.style.boxShadow = 'none';
              }}
            >
              {ROLE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              style={{
                height: '40px',
                padding: '0 20px',
                borderRadius: '8px',
                border: '2px solid #374151',
                background: 'transparent',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isSubmitting ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  (e.target as HTMLElement).style.border = '2px solid #6b7280';
                  (e.target as HTMLElement).style.color = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  (e.target as HTMLElement).style.border = '2px solid #374151';
                  (e.target as HTMLElement).style.color = '#94a3b8';
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.email || !formData.password}
              style={{
                height: '40px',
                padding: '0 20px',
                borderRadius: '8px',
                border: '2px solid #5154e6',
                background: isSubmitting ? '#4b5563' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: (isSubmitting || !formData.email || !formData.password) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: (isSubmitting || !formData.email || !formData.password) ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting && formData.email && formData.password) {
                  (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                  (e.target as HTMLElement).style.boxShadow = '0 4px 8px rgba(99, 102, 241, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting && formData.email && formData.password) {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = 'none';
                }
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
