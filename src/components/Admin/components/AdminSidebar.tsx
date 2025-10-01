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
    <aside style={{
      border: '1px solid #1f2937',
      borderRadius: '12px',
      background: 'rgba(17, 24, 39, 0.7)',
      overflow: 'hidden'
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
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                cursor: 'pointer',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                borderBottom: 'none',
                textDecoration: 'none',
                color: 'inherit'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.target as HTMLElement).style.background = 'rgba(99, 102, 241, 0.08)';
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent';
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                  {config.title || op.title}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>
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
