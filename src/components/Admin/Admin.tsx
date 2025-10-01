import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboardNew';
import { ServerInfo } from './types';
import { getApiBaseUrl, getDefaultFetchOptions, getAuthHeaders } from '../../utils/apiConfig';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async (): Promise<void> => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const API_BASE = getApiBaseUrl();
        const defaultOptions = getDefaultFetchOptions();
        const authHeaders = getAuthHeaders(token);

        const res = await fetch(`${API_BASE}/currentuser`, {
          ...defaultOptions,
          method: 'GET',
          headers: {
            ...defaultOptions.headers,
            ...authHeaders
          }
        });

        if (res.ok) {
          const data = await res.json();
          const roleVal = (data && (data.role !== undefined ? data.role : (data.data && data.data.role))) ?? null;
          
          const toNum = (r: any): number => {
            if (typeof r === 'number') return r;
            if (typeof r === 'string') { 
              const m = r.match(/-?\d+/); 
              if (m) return Number(m[0]); 
            }
            return Number(r);
          };
          
          const roleNum = toNum(roleVal);
          
          if (roleNum === 40 || roleNum === 1000) {
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('loginResponse');
          }
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('loginResponse');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('loginResponse');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (): void => {
    setIsLoggedIn(true);
  };

  const handleLogout = (): void => {
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(180deg, #0b1022 0%, #0f172a 100%)',
        color: '#e5e7eb'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" replace />} />
      <Route path="/*" element={<AdminDashboard onLogout={handleLogout} />} />
    </Routes>
  );
};

export default Admin;
