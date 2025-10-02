import { useState, useCallback, useMemo } from 'react';
import { OUTPUT_TITLES, OPERATIONS_CONFIG } from '../config/constants';
import { getApiBaseUrl, getDefaultFetchOptions, getAuthHeaders } from '../../../utils/apiConfig';
import { 
  User, 
  UseAdminOperationsReturn, 
  ApiFunction, 
  ServerInfo
} from '../types';

const useAdminOperations = (): UseAdminOperationsReturn => {
  const [currentOpKey, setCurrentOpKey] = useState<string>('list-users');
  const [outputTitle, setOutputTitle] = useState<string>('Users');
  const [outputMeta, setOutputMeta] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [users, setUsers] = useState<User[] | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  const AUTH_TOKEN = localStorage.getItem('authToken') || '';

  const api: ApiFunction = useCallback(async (path, { method = 'GET', json, formData, headers = {} } = {}) => {
    const API_BASE = getApiBaseUrl();
    const defaultOptions = getDefaultFetchOptions();
    const authHeaders = getAuthHeaders(AUTH_TOKEN);
    
    const h: Record<string, string> = { 
      ...(defaultOptions.headers as Record<string, string>),
      ...authHeaders,
      ...headers 
    };
    
    let body: string | FormData | undefined;
    if (json !== undefined) { 
      h['Content-Type'] = 'application/json'; 
      body = JSON.stringify(json); 
    } else if (formData) { 
      body = formData; 
    }
    
    const res = await fetch(`${API_BASE}${path}`, { 
      ...defaultOptions,
      method, 
      headers: h, 
      body
    });
    const text = await res.text();
    let data: any;
    try { 
      data = JSON.parse(text); 
    } catch { 
      data = text; 
    }
    
    if (!res.ok) { 
      const err = new Error(`HTTP ${res.status}`) as any;
      err.data = data; 
      throw err; 
    }
    return data;
  }, []);

  const updateOutputTitle = useCallback((opKey: string, extra?: string) => {
    let title = OUTPUT_TITLES[opKey] || 'Output';
    if (extra) title = `${title} — ${extra}`;
    setOutputTitle(title);
  }, []);

  const setStatusMessage = useCallback((text: string, type: string = '') => {
    setStatus(text || '');
  }, []);

  // Operations definition
  const operations = useMemo(() => ({
    'list-users': {
      ...OPERATIONS_CONFIG['list-users'],
      run: async (searchEmail: string = '') => {
        setCurrentOpKey('list-users');
        updateOutputTitle('list-users');
        
        const qs = searchEmail ? `?searchEmail=${encodeURIComponent(searchEmail)}` : '';
        setStatusMessage('Loading...');
        try {
          const data: User[] = await api(`/users${qs}`, { method: 'GET' });
          setStatusMessage('OK');
          setUsers(data);
          setOutput('');
        } catch (e: any) {
          setStatusMessage(e.message);
          setUsers([]);
          setOutput(`<div class="small-muted">Error: ${e.message}</div>`);
        }
      }
    },
    'show-chart': {
      ...OPERATIONS_CONFIG['show-chart'],
      run: async () => {
        setCurrentOpKey('show-chart');
        updateOutputTitle('show-chart');
        setStatusMessage('Loading users...');
        try {
          const data: User[] = await api(`/users`, { method: 'GET' });
          setStatusMessage('OK');
          setUsers(data);
          setOutput('');
        } catch (e: any) {
          setStatusMessage(e.message);
          setUsers([]);
          setOutput(`<div class="small-muted">Error: ${e.message}</div>`);
        }
      }
    },
    'current-user': {
      ...OPERATIONS_CONFIG['current-user'],
      run: async () => {
        setCurrentOpKey('current-user');
        updateOutputTitle('current-user');
        setStatusMessage('Loading...');
        try {
          const data: User = await api('/users/current', { method: 'GET' });
          setStatusMessage('OK');
          setUsers([data]);
          setOutput('');
        } catch (e: any) {
          setStatusMessage(e.message);
          setUsers([]);
          setOutput(`<div class="small-muted">Error: ${e.message}</div>`);
        }
      }
    },
    'list-resources': {
      ...OPERATIONS_CONFIG['list-resources'],
      run: async () => {
        setCurrentOpKey('list-resources');
        updateOutputTitle('list-resources');
        setUsers(null);
        setOutput('');
        setOutputMeta(`${new Date().toLocaleString()}`);
      }
    },
    'upload-file': {
      ...OPERATIONS_CONFIG['upload-file'],
      run: async () => {
        setCurrentOpKey('upload-file');
        updateOutputTitle('upload-file');
        setUsers(null);
        setOutput(`
          <div class="card full-span">
            <h4>Upload File</h4>
            <div style="margin-top: 16px; text-align: center;">
              <p style="color: #94a3b8; margin-bottom: 20px;">
                Click the "Upload File" button to open the upload dialog.
              </p>
              <button onclick="window.adminDashboard.openUploadModal()" style="
                height: 40px;
                padding: 0 20px;
                border-radius: 8px;
                border: 2px solid #5154e6;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: #ffffff;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
              ">
                📁 Upload File
              </button>
            </div>
          </div>
        `);
      }
    },
    'clear-folder': {
      ...OPERATIONS_CONFIG['clear-folder'],
      run: async () => {
        setCurrentOpKey('clear-folder');
        updateOutputTitle('clear-folder');
        setUsers(null);
        setOutput(`
          <div class="card full-span">
            <h4 style="color: #ef4444;">⚠️ Clear Folder</h4>
            <div style="margin-top: 16px; text-align: center;">
              <p style="color: #94a3b8; margin-bottom: 20px;">
                Click the "Clear Folder" button to open the clear folder dialog.
                <br><strong style="color: #ef4444;">Warning: This action cannot be undone!</strong>
              </p>
              <button onclick="window.adminDashboard.openClearFolderModal()" style="
                height: 40px;
                padding: 0 20px;
                border-radius: 8px;
                border: 2px solid #dc2626;
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: #ffffff;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
              ">
                🗑️ Clear Folder
              </button>
            </div>
          </div>
        `);
      }
    }
  }), [api]);

  const handleUserSearch = useCallback(async (searchEmail: string) => {
    setSearchValue(searchEmail);
    await operations['list-users'].run(searchEmail);
  }, [operations]);

  return {
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
  };
};

export default useAdminOperations;
