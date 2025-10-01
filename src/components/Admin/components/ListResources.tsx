import React, { useState, useEffect, useCallback } from 'react';
import { html, formatJSON } from '../utils/formatters';
import { ApiFunction } from '../types';

interface ListResourcesProps {
  api: ApiFunction;
  setStatusMessage: (message: string) => void;
  setOutputMeta: (meta: string) => void;
  updateOutputTitle: (opKey: string, extra?: string) => void;
}

interface ResourceData {
  error?: string;
  data?: any;
}

const ListResources: React.FC<ListResourcesProps> = ({ 
  api, 
  setStatusMessage, 
  setOutputMeta, 
  updateOutputTitle 
}) => {
  const [prodResources, setProdResources] = useState<any[] | ResourceData | null>(null);
  const [stageResources, setStageResources] = useState<any[] | ResourceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDownload = async (endpoint: string, envType: string) => {
    try {
      setStatusMessage(`Downloading installer for ${envType}...`);
      setOutputMeta(`${new Date().toLocaleString()} — Downloading installer from ${endpoint}`);
      
      // Use proxy for consistency with other API calls
      const API_BASE = '/proxy';

      // Get auth token
      const AUTH_TOKEN = localStorage.getItem('authToken') || '';
      const headers: Record<string, string> = {};
      if (AUTH_TOKEN) {
        headers['Authorization'] = AUTH_TOKEN.startsWith('Bearer ') ? AUTH_TOKEN : `Bearer ${AUTH_TOKEN}`;
      }

      // Add auth header via fetch and create blob URL for secure download
      const downloadUrl = `${API_BASE}${endpoint}`;
      const response = await fetch(downloadUrl, { headers });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Extract filename from Content-Disposition header if available
      let filename = '';
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.style.display = 'none';
      
      // Only set download attribute if we have a filename, otherwise let browser handle it
      if (filename) {
        link.download = filename;
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
      
      setStatusMessage(`Installer download started for ${envType}`);
      setOutputMeta(`${new Date().toLocaleString()} — Installer download initiated from ${endpoint}`);
    } catch (error: any) {
      console.error('Download error:', error);
      setStatusMessage(`Download failed: ${error.message}`);
      setOutputMeta(`${new Date().toLocaleString()} — Download error: ${error.message}`);
    }
  };

  const handleUpdateBoth = useCallback(async () => {
    setIsLoading(true);
    updateOutputTitle('list-resources');
    setStatusMessage('Loading...');
    setOutputMeta(`${new Date().toLocaleString()} — Loading resources from both environments...`);
    
    try {
      // Load both environments in parallel
      const [prodData, stageData] = await Promise.all([
        api('/resources/list/suite', { method: 'GET' }).catch((e: any) => ({ error: e.message, data: e.data })),
        api('/resources/list/suite-stage', { method: 'GET' }).catch((e: any) => ({ error: e.message, data: e.data }))
      ]);
      
      setProdResources(prodData);
      setStageResources(stageData);
      setStatusMessage('OK');
      setOutputMeta(`${new Date().toLocaleString()} — Resources loaded from both environments`);
    } catch (e: any) {
      setStatusMessage(e.message);
      setOutputMeta(`${new Date().toLocaleString()} — Error loading resources`);
      setProdResources({ error: e.message, data: e.data });
      setStageResources({ error: e.message, data: e.data });
    } finally {
      setIsLoading(false);
    }
  }, [api, updateOutputTitle, setStatusMessage, setOutputMeta, setProdResources, setStageResources]);

  // Load resources on component mount
  useEffect(() => {
    handleUpdateBoth();
  }, [handleUpdateBoth]);

  const renderResourceSection = (resources: any[] | ResourceData | null, title: string, envType: string) => {
    return (
      <div style={{
        border: '1px solid #1b2536',
        background: '#0b1223',
        borderRadius: '8px',
        padding: '16px',
        flex: '1'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h4 style={{ 
            margin: '0', 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#e5e7eb'
          }}>
            {title}
          </h4>
          <button
            onClick={() => handleDownload(
              envType === 'stage' ? '/resources/get-installer/stage' : '/resources/get-installer',
              envType
            )}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #4f46e5',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-1px)';
              (e.target as HTMLElement).style.boxShadow = '0 4px 8px rgba(79, 70, 229, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = '0 2px 4px rgba(79, 70, 229, 0.3)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download Installer
          </button>
        </div>
        
        {resources ? (
          (resources as ResourceData).error ? (
            <pre style={{
              background: '#0b1223',
              border: '1px solid #0f1a33',
              borderRadius: '8px',
              padding: '10px',
              maxHeight: '260px',
              overflow: 'auto',
              color: '#e5e7eb',
              fontSize: '12px'
            }}>
              {html(formatJSON((resources as ResourceData).data || (resources as ResourceData).error))}
            </pre>
          ) : (
            <div>
              {Array.isArray(resources) ? (
                resources.length > 0 ? (
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    maxWidth: '100%',
                    overflowWrap: 'anywhere' as const,
                    wordBreak: 'break-word' as const
                  }}>
                    {resources.map((item, index) => (
                      <li key={index} style={{
                        padding: '12px 16px',
                        border: '1px solid #1b2536',
                        background: '#111827',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        maxWidth: '100%',
                        whiteSpace: 'normal' as const,
                        overflowWrap: 'anywhere' as const,
                        wordBreak: 'break-word' as const,
                        color: '#e5e7eb',
                        fontSize: '16px',
                        fontWeight: '500',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                      }}>
                        {typeof item === 'string' ? item : JSON.stringify(item)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ 
                    color: '#94a3b8', 
                    fontSize: '16px', 
                    textAlign: 'center' as const,
                    padding: '20px'
                  }}>
                    No resources found.
                  </div>
                )
              ) : (
                <div style={{ 
                  color: '#94a3b8', 
                  fontSize: '14px', 
                  textAlign: 'center' as const,
                  padding: '20px'
                }}>
                  No resources found.
                </div>
              )}
            </div>
          )
        ) : (
          <div style={{ 
            color: '#94a3b8', 
            fontSize: '16px', 
            textAlign: 'center' as const,
            padding: '20px'
          }}>
            {isLoading ? 'Loading...' : 'Click Reload to load resources'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ gridColumn: '1 / -1' }}>
      {/* Two-column layout for environments */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {renderResourceSection(prodResources, 'Prod Env', 'prod')}
        {renderResourceSection(stageResources, 'Stage Env', 'stage')}
      </div>

      {/* Reload Button underneath */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center'
      }}>
        <button 
          onClick={handleUpdateBoth}
          disabled={isLoading}
          style={{
            height: '48px',
            padding: '0 32px',
            borderRadius: '8px',
            border: '2px solid #5154e6',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#ffffff',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            opacity: isLoading ? 0.6 : 1,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(99, 102, 241, 0.3)'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              (e.target as HTMLElement).style.transform = 'translateY(-1px)';
              (e.target as HTMLElement).style.boxShadow = '0 4px 8px rgba(99, 102, 241, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = 'translateY(0)';
            (e.target as HTMLElement).style.boxShadow = '0 2px 4px rgba(99, 102, 241, 0.3)';
          }}
        >
          {isLoading ? 'Reloading...' : 'Reload'}
        </button>
      </div>
    </div>
  );
};

export default ListResources;
