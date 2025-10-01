import React, { useState } from 'react';
import { ApiFunction } from '../types';

interface ClearFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
  api: ApiFunction;
  setStatusMessage: (message: string) => void;
}

const ClearFolderModal: React.FC<ClearFolderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
  api,
  setStatusMessage
}) => {
  const [folderPath, setFolderPath] = useState<string>('');
  const [isClearing, setIsClearing] = useState(false);
  const [confirmText, setConfirmText] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderPath.trim()) {
      setStatusMessage('Please enter a folder path');
      return;
    }

    if (confirmText !== 'CLEAR') {
      setStatusMessage('Please type "CLEAR" to confirm');
      return;
    }

    setIsClearing(true);
    setStatusMessage('Clearing folder...');

    try {
      const result = await api('/clear-folder', { 
        method: 'POST', 
        json: { folderPath: folderPath.trim() }
      });
      
      console.log('Clear folder result:', result);
      setStatusMessage('Folder cleared successfully!');
      onSuccess(`Folder "${folderPath}" has been cleared successfully!`);
      handleClose();
      
    } catch (e: any) {
      console.error('Clear folder error:', e);
      const errorMessage = `Failed to clear folder: ${e.message}`;
      setStatusMessage(errorMessage);
      onError(errorMessage);
    } finally {
      setIsClearing(false);
    }
  };

  const handleClose = () => {
    setFolderPath('');
    setConfirmText('');
    onClose();
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
            color: '#ef4444'
          }}>
            ⚠️ Clear Folder
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

        {/* Warning Message */}
        <div style={{
          backgroundColor: '#7f1d1d',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <div style={{ color: '#ef4444', fontWeight: '600', fontSize: '14px' }}>
              Warning: This action cannot be undone!
            </div>
            <div style={{ color: '#fca5a5', fontSize: '12px' }}>
              All files in the specified folder will be permanently deleted.
            </div>
          </div>
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
              Folder Path *
            </label>
            <input
              type="text"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              placeholder="/uploads/documents"
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
                e.target.style.border = '2px solid #ef4444';
                e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
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
              Type "CLEAR" to confirm *
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="CLEAR"
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
                e.target.style.border = '2px solid #ef4444';
                e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid #374151';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isClearing}
              style={{
                height: '40px',
                padding: '0 20px',
                borderRadius: '8px',
                border: '2px solid #374151',
                background: 'transparent',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isClearing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isClearing ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isClearing) {
                  (e.target as HTMLElement).style.border = '2px solid #6b7280';
                  (e.target as HTMLElement).style.color = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isClearing) {
                  (e.target as HTMLElement).style.border = '2px solid #374151';
                  (e.target as HTMLElement).style.color = '#94a3b8';
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isClearing || !folderPath.trim() || confirmText !== 'CLEAR'}
              style={{
                height: '40px',
                padding: '0 20px',
                borderRadius: '8px',
                border: '2px solid #dc2626',
                background: isClearing ? '#4b5563' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: (isClearing || !folderPath.trim() || confirmText !== 'CLEAR') ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: (isClearing || !folderPath.trim() || confirmText !== 'CLEAR') ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isClearing && folderPath.trim() && confirmText === 'CLEAR') {
                  (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                  (e.target as HTMLElement).style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isClearing && folderPath.trim() && confirmText === 'CLEAR') {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = 'none';
                }
              }}
            >
              {isClearing ? 'Clearing...' : 'Clear Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClearFolderModal;



