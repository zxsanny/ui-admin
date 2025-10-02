import React, { useState, useEffect } from 'react';
import UsersList from './UsersList';
import HardwareCharts from './HardwareCharts';
import ListResources from './ListResources';
import CreateUserModal from './CreateUserModal';
import UploadFileModal from './UploadFileModal';
import ClearFolderModal from './ClearFolderModal';
import NotificationBadge from './NotificationBadge';
import { User, ApiFunction, CreateUserFormData } from '../types';

interface AdminContentProps {
  currentOpKey: string;
  outputTitle: string;
  outputMeta: string;
  output: string;
  status: string;
  users: User[] | null;
  searchValue: string;
  onUserSearch: (searchEmail: string) => void;
  api: ApiFunction;
  setStatusMessage: (message: string) => void;
  setOutputMeta: (meta: string) => void;
  updateOutputTitle: (opKey: string, extra?: string) => void;
  onUserUpdate?: () => void;
  operations: any;
}

const AdminContent: React.FC<AdminContentProps> = ({ 
  currentOpKey, 
  outputTitle, 
  outputMeta, 
  output, 
  status, 
  users, 
  searchValue, 
  onUserSearch,
  api,
  setStatusMessage,
  setOutputMeta,
  updateOutputTitle,
  onUserUpdate,
  operations
}) => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);
  const [isClearFolderModalOpen, setIsClearFolderModalOpen] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  // Ref to store the current timeout
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Update local search value when prop changes
  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle input change with throttling
  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onUserSearch(value);
    }, 700);
  };

  // Handle Enter key press for immediate search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      onUserSearch(localSearchValue);
    }
  };

  const handleCreateUser = async (formData: CreateUserFormData) => {
    // This function is called after successful user creation
    // Refresh the user list to show the new user
    console.log('Refreshing user list after creation');
    onUserSearch(searchValue);
    
    // Show success notification
    setNotification({
      message: `User "${formData.email}" has been created successfully!`,
      type: 'success',
      isVisible: true
    });
  };

  const handleCreateUserError = (error: string) => {
    // Show error notification
    setNotification({
      message: error,
      type: 'error',
      isVisible: true
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  // Handle operation-specific modals
  useEffect(() => {
    if (currentOpKey === 'upload-file') {
      setIsUploadFileModalOpen(true);
    } else if (currentOpKey === 'clear-folder') {
      setIsClearFolderModalOpen(true);
    }
  }, [currentOpKey]);

  const handleUploadFileSuccess = (message: string) => {
    setNotification({
      message,
      type: 'success',
      isVisible: true
    });
  };

  const handleUploadFileError = (error: string) => {
    setNotification({
      message: error,
      type: 'error',
      isVisible: true
    });
  };

  const handleClearFolderSuccess = (message: string) => {
    setNotification({
      message,
      type: 'success',
      isVisible: true
    });
  };

  const handleClearFolderError = (error: string) => {
    setNotification({
      message: error,
      type: 'error',
      isVisible: true
    });
  };
  return (
    <section className="admin-content" style={{
      border: '1px solid #1f2937',
      borderRadius: '12px',
      background: 'rgba(17, 24, 39, 0.7)',
      padding: '12px'
    }}>
      <div className="header-controls" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1' }}>
          <h3 style={{ margin: 0, fontSize: '20px', whiteSpace: 'nowrap' }}>{outputTitle}</h3>
          {currentOpKey === 'list-users' && (
            <input
              type="email"
              placeholder="🔍 Search by email..."
              value={localSearchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="search-input"
              style={{
                height: '44px',
                padding: '0 20px',
                borderRadius: '12px',
                border: '2px solid #475569',
                background: 'rgba(30, 41, 59, 0.8)',
                color: '#f1f5f9',
                fontSize: '15px',
                flex: '1',
                minWidth: '300px',
                maxWidth: '800px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(4px)'
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #3b82f6';
                e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                e.target.style.background = 'rgba(30, 41, 59, 0.95)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid #475569';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                e.target.style.background = 'rgba(30, 41, 59, 0.8)';
              }}
            />
          )}
        </div>
        
        {currentOpKey === 'list-users' && (
          <button
            onClick={() => setIsCreateUserModalOpen(true)}
            style={{
              height: '44px',
              padding: '0 24px',
              borderRadius: '12px',
              border: '2px solid #10b981',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '140px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-2px)';
              (e.target as HTMLElement).style.boxShadow = '0 8px 12px -2px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = '0 4px 6px -1px rgba(16, 185, 129, 0.3)';
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>+</span>
            Create User
          </button>
        )}
      </div>
      {currentOpKey !== 'list-resources' && (
        <div style={{ color: '#94a3b8', fontSize: '14px' }}>{outputMeta}</div>
      )}
      <div 
        className={`human-output ${currentOpKey === 'list-users' || currentOpKey === 'current-user' ? 'users-grid' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: currentOpKey === 'list-users' || currentOpKey === 'current-user' 
            ? 'repeat(auto-fill, minmax(400px, 1fr))' 
            : 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}
      >
        {/* Render React components based on current operation */}
        {currentOpKey === 'show-chart' && users && (
          <HardwareCharts users={users} />
        )}
        
        {(currentOpKey === 'list-users' || currentOpKey === 'current-user') && (
          <UsersList 
            users={users} 
            onSearch={onUserSearch}
            searchValue={localSearchValue}
            api={api}
            setStatusMessage={setStatusMessage}
            onUserUpdate={onUserUpdate}
          />
        )}
        
        {currentOpKey === 'list-resources' && (
          <ListResources 
            api={api}
            setStatusMessage={setStatusMessage}
            setOutputMeta={setOutputMeta}
            updateOutputTitle={updateOutputTitle}
          />
        )}
        
        {/* Fallback for HTML content - only show when no React components are rendering */}
        {output && !(currentOpKey === 'list-users' || currentOpKey === 'current-user' || currentOpKey === 'show-chart' || currentOpKey === 'list-resources') && (
          <div dangerouslySetInnerHTML={{ __html: output }} />
        )}
        
      </div>
      {status && (
        <div style={{ 
          color: '#94a3b8', 
          fontSize: '12px', 
          marginTop: '8px',
          padding: '8px',
          background: '#0b1223',
          borderRadius: '4px'
        }}>
          Status: {status}
        </div>
      )}
      
      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => {
          setIsCreateUserModalOpen(false);
          // Reset form when closing
        }}
        onSubmit={handleCreateUser}
        onError={handleCreateUserError}
        api={api}
        setStatusMessage={setStatusMessage}
      />
      
      {/* Upload File Modal */}
      <UploadFileModal
        isOpen={isUploadFileModalOpen}
        onClose={() => {
          setIsUploadFileModalOpen(false);
          // Switch back to list-users when closing
          if (currentOpKey === 'upload-file') {
            operations['list-users'].run();
          }
        }}
        onSuccess={handleUploadFileSuccess}
        onError={handleUploadFileError}
        api={api}
        setStatusMessage={setStatusMessage}
      />
      
      {/* Clear Folder Modal */}
      <ClearFolderModal
        isOpen={isClearFolderModalOpen}
        onClose={() => {
          setIsClearFolderModalOpen(false);
          // Switch back to list-users when closing
          if (currentOpKey === 'clear-folder') {
            operations['list-users'].run();
          }
        }}
        onSuccess={handleClearFolderSuccess}
        onError={handleClearFolderError}
        api={api}
        setStatusMessage={setStatusMessage}
      />
      
      {/* Notification Badge */}
      <NotificationBadge
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
    </section>
  );
};

export default AdminContent;
