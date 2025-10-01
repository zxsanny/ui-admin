import React, { useState, useRef } from 'react';
import { ApiFunction } from '../types';

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
  api: ApiFunction;
  setStatusMessage: (message: string) => void;
}

const UploadFileModal: React.FC<UploadFileModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
  api,
  setStatusMessage
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [folderPath, setFolderPath] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setStatusMessage('Please select a file to upload');
      return;
    }

    if (!folderPath.trim()) {
      setStatusMessage('Please enter a folder path');
      return;
    }

    setIsUploading(true);
    setStatusMessage('Uploading file...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folderPath', folderPath);

      const result = await api('/upload', { 
        method: 'POST', 
        formData: formData 
      });
      
      console.log('Upload result:', result);
      setStatusMessage('File uploaded successfully!');
      onSuccess(`File "${selectedFile.name}" uploaded to "${folderPath}" successfully!`);
      handleClose();
      
    } catch (e: any) {
      console.error('Upload error:', e);
      const errorMessage = `Failed to upload file: ${e.message}`;
      setStatusMessage(errorMessage);
      onError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFolderPath('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
            color: '#e5e7eb'
          }}>
            Upload File
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
              Select File *
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
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
            />
            {selectedFile && (
              <div style={{
                marginTop: '8px',
                padding: '8px',
                backgroundColor: '#065f46',
                border: '1px solid #10b981',
                borderRadius: '6px',
                color: '#a7f3d0',
                fontSize: '12px'
              }}>
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
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
                e.target.style.border = '2px solid #6366f1';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
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
              disabled={isUploading}
              style={{
                height: '40px',
                padding: '0 20px',
                borderRadius: '8px',
                border: '2px solid #374151',
                background: 'transparent',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isUploading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isUploading) {
                  (e.target as HTMLElement).style.border = '2px solid #6b7280';
                  (e.target as HTMLElement).style.color = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isUploading) {
                  (e.target as HTMLElement).style.border = '2px solid #374151';
                  (e.target as HTMLElement).style.color = '#94a3b8';
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !selectedFile || !folderPath.trim()}
              style={{
                height: '40px',
                padding: '0 20px',
                borderRadius: '8px',
                border: '2px solid #5154e6',
                background: isUploading ? '#4b5563' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: (isUploading || !selectedFile || !folderPath.trim()) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: (isUploading || !selectedFile || !folderPath.trim()) ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isUploading && selectedFile && folderPath.trim()) {
                  (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                  (e.target as HTMLElement).style.boxShadow = '0 4px 8px rgba(99, 102, 241, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isUploading && selectedFile && folderPath.trim()) {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = 'none';
                }
              }}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadFileModal;



