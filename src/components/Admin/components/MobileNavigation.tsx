import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MobileNavigationProps {
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

const MOBILE_NAV_ITEMS = [
  { key: 'list-users', label: 'List', icon: '👥' },
  { key: 'show-chart', label: 'Chart', icon: '📊' },
  { key: 'current-user', label: 'Current', icon: '👤' },
  { key: 'list-resources', label: 'Resources', icon: '📁' },
  { key: 'upload-file', label: 'Upload', icon: '⬆️' },
  { key: 'clear-folder', label: 'Clear', icon: '🗑️' }
];

const MobileNavigation: React.FC<MobileNavigationProps> = ({ onOpClick }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="mobile-navigation" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #334155',
      padding: '8px 0',
      zIndex: 1000
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '2px',
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0 4px'
      }}>
        {MOBILE_NAV_ITEMS.map(({ key, label, icon }) => {
          const route = ROUTE_MAPPING[key];
          const isActive = currentPath === route;
          
          return (
            <Link
              key={key}
              to={route}
              onClick={() => onOpClick(key)}
              className="mobile-nav-item"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 2px',
                textDecoration: 'none',
                color: isActive ? '#3b82f6' : '#94a3b8',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                minHeight: '50px',
                background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.target as HTMLElement).style.background = 'rgba(59, 130, 246, 0.05)';
                  (e.target as HTMLElement).style.color = '#cbd5e1';
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent';
                (e.target as HTMLElement).style.color = isActive ? '#3b82f6' : '#94a3b8';
              }}
            >
              <div style={{
                fontSize: '16px',
                marginBottom: '2px',
                lineHeight: 1
              }}>
                {icon}
              </div>
              <div style={{
                fontSize: '9px',
                fontWeight: isActive ? '600' : '500',
                textAlign: 'center',
                lineHeight: 1.1
              }}>
                {label}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
