import React, { useState } from 'react';
import { getApiBaseUrl, getDefaultFetchOptions } from '../../utils/apiConfig';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const API_BASE = getApiBaseUrl();
      const defaultOptions = getDefaultFetchOptions();

      const response = await fetch(`${API_BASE}/login`, {
        ...defaultOptions,
        method: 'POST',
        headers: {
          ...defaultOptions.headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token || data.data?.token);
        localStorage.setItem('loginResponse', JSON.stringify(data));
        onLoginSuccess();
      } else {
        try {
          const errorData = await response.json();
          setError(errorData.message || `Login failed (${response.status})`);
        } catch {
          setError(`Login failed (${response.status} ${response.statusText})`);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0b1022 0%, #0f172a 100%)',
      color: '#e5e7eb'
    }}>
      <div style={{
        background: '#1e293b',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '1.5rem',
          color: '#f8fafc'
        }}>
          Admin Login
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#cbd5e1'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '90%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #475569',
                borderRadius: '4px',
                background: '#334155',
                color: '#f8fafc',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#cbd5e1'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '90%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #475569',
                borderRadius: '4px',
                background: '#334155',
                color: '#f8fafc',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          {error && (
            <div style={{
              color: '#ef4444',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: isLoading ? '#64748b' : '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
