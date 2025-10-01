import React, { useEffect, useState } from 'react';

interface NotificationBadgeProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? '#065f46' : '#7f1d1d';
  const borderColor = isSuccess ? '#10b981' : '#ef4444';
  const textColor = isSuccess ? '#10b981' : '#ef4444';
  const icon = isSuccess ? '✅' : '❌';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '16px 20px',
        minWidth: '300px',
        maxWidth: '500px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        zIndex: 10000,
        transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
        opacity: isAnimating ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer'
      }}
      onClick={onClose}
    >
      <span style={{ fontSize: '24px', flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          color: textColor,
          fontWeight: '600',
          fontSize: '16px',
          marginBottom: '4px'
        }}>
          {isSuccess ? 'Success!' : 'Error!'}
        </div>
        <div style={{
          color: isSuccess ? '#a7f3d0' : '#fca5a5',
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          {message}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          background: 'none',
          border: 'none',
          color: isSuccess ? '#a7f3d0' : '#fca5a5',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.backgroundColor = 'transparent';
        }}
      >
        ×
      </button>
    </div>
  );
};

export default NotificationBadge;



