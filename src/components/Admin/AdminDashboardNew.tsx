import React, { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import AdminContent from './components/AdminContent';
import useAdminOperations from './hooks/useAdminOperations';
import { extractToken } from './utils/parsers';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const location = useLocation();
  const hasInitialized = useRef(false);
  
  const PATH_TO_OPERATION: Record<string, string> = {
    '/users': 'list-users',
    '/charts': 'show-chart',
    '/current': 'current-user',
    '/resources': 'list-resources',
    '/upload': 'upload-file',
    '/clear': 'clear-folder'
  };
  
  const {
    currentOpKey,
    outputTitle,
    outputMeta,
    output,
    status,
    users,
    searchValue,
    operations,
    api,
    setStatusMessage,
    setOutputMeta,
    updateOutputTitle,
    handleUserSearch
  } = useAdminOperations();

  const ensureAuth = useCallback((): void => {
    const AUTH_TOKEN = localStorage.getItem('authToken');
    if (!AUTH_TOKEN) {
      const last = localStorage.getItem('loginResponse');
      if (last) {
        try {
          const data = JSON.parse(last);
          const token = extractToken(data);
          if (token) localStorage.setItem('authToken', token);
        } catch {
          // ignore parse errors
        }
      }
    }
    if (!localStorage.getItem('authToken')) onLogout();
  }, [onLogout]);

  const handleOpClick = (opKey: string): void => {
    if (!operations[opKey].hasForm) {
      operations[opKey].run();
    } else {
      // For operations with forms, show the form
      operations[opKey].run();
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loginResponse');
    onLogout();
  };

  const handleUserUpdate = (): void => {
    // Refresh the current operation if it's user-related
    if (currentOpKey === 'list-users') {
      operations['list-users'].run(searchValue);
    } else if (currentOpKey === 'current-user') {
      operations['current-user'].run();
    }
  };

  useEffect(() => {
    ensureAuth();
  }, [ensureAuth]);

  useEffect(() => {
    // Only run the operation on initial load
    if (!hasInitialized.current) {
      const currentPath = location.pathname;
      const operationKey = PATH_TO_OPERATION[currentPath] || 'list-users';
      if (operations[operationKey]) {
        operations[operationKey].run();
        hasInitialized.current = true;
      }
    }
  }, [location.pathname, operations]);

  useEffect(() => {
    // Expose functions for inline onclick handlers (for forms that still use HTML)
    (window as any).adminDashboard = {
      submitCreateUser: () => {
        const emailEl = document.getElementById('createUserEmail') as HTMLInputElement;
        const passwordEl = document.getElementById('createUserPassword') as HTMLInputElement;
        const roleEl = document.getElementById('createUserRole') as HTMLSelectElement;
        
        const email = emailEl?.value?.trim() || '';
        const password = passwordEl?.value || '';
        const role = roleEl?.value || '';
        
        if (!email || !password || !role) {
          setStatusMessage('Please fill in all fields');
          return;
        }
        
        operations['create-user'].run({
          email,
          password,
          role: parseInt(role, 10)
        });
      },
      openUploadModal: () => {
        // This will be handled by the AdminContent component
        // We'll need to pass a callback to open the modal
        console.log('Upload modal should open');
      },
      openClearFolderModal: () => {
        // This will be handled by the AdminContent component
        // We'll need to pass a callback to open the modal
        console.log('Clear folder modal should open');
      }
    };

    return () => {
      delete (window as any).adminDashboard;
    };
  }, [operations, setStatusMessage]);

  return (
    <>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0b1022 0%, #0f172a 100%)', color: '#e5e7eb' }}>
        <AdminHeader onLogout={handleLogout} />

        <main style={{ 
          display: 'grid', 
          gridTemplateColumns: '180px 1fr', 
          gap: '16px', 
          padding: '16px',
          minHeight: 'calc(100vh - 80px)'
        }}>
          <AdminSidebar 
            operations={operations}
            currentOpKey={currentOpKey}
            onOpClick={handleOpClick}
          />

          <AdminContent
            currentOpKey={currentOpKey}
            outputTitle={outputTitle}
            outputMeta={outputMeta}
            output={output}
            status={status}
            users={users}
            searchValue={searchValue}
            onUserSearch={handleUserSearch}
            api={api}
            setStatusMessage={setStatusMessage}
            setOutputMeta={setOutputMeta}
            updateOutputTitle={updateOutputTitle}
            onUserUpdate={handleUserUpdate}
            operations={operations}
          />
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
