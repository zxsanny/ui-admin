import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { OPERATIONS_CONFIG } from '../config/constants';
import { Operation } from '../types';

interface AdminSidebarProps {
  operations: Record<string, Operation>;
  currentOpKey: string;
  onOpClick: (key: string) => void;
}

const ROUTE_MAPPING: Record<string, string> = {
  'list-users': '/users',
  'show-chart': '/charts',
  'current-user': '/current',
  'list-resources': '/resources',
  'upload-file': '/upload',
  'clear-folder': '/clear'
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({ operations, currentOpKey, onOpClick }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="admin-sidebar" style={{
      border: '1px solid #334155',
      borderRadius: '16px',
      background: 'rgba(15, 23, 42, 0.8)',
      overflow: 'hidden',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ maxHeight: 'calc(100vh - 260px)', overflow: 'auto' }}>
        {Object.entries(operations).map(([key, op]) => {
          const config = OPERATIONS_CONFIG[key] || {};
          const route = ROUTE_MAPPING[key];
          const isActive = currentPath === route;
          
          return (
            <Link
              key={key}
              to={route}
              onClick={() => onOpClick(key)}
              className="sidebar-nav-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                cursor: 'pointer',
                background: isActive ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)' : 'transparent',
                borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent',
                borderBottom: '1px solid rgba(51, 65, 85, 0.3)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.target as HTMLElement).style.background = 'rgba(59, 130, 246, 0.08)';
                  (e.target as HTMLElement).style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = isActive ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)' : 'transparent';
                (e.target as HTMLElement).style.transform = 'translateX(0)';
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: isActive ? '#f1f5f9' : '#cbd5e1', 
                  fontSize: '15px', 
                  fontWeight: isActive ? '600' : '500',
                  marginBottom: '4px'
                }}>
                  {config.title || op.title}
                </div>
                <div style={{ 
                  color: isActive ? '#94a3b8' : '#64748b', 
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}>
                  {config.description || ''}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default AdminSidebar;
