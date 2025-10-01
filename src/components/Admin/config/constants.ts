// Static configurations for the admin dashboard
import { RoleInfo, OperationConfig, RoleOption } from '../types';

export const ROLES: Record<number, RoleInfo> = {
  1000: { text: 'ApiAdmin', cls: 'apiadmin' },
  40: { text: 'Admin', cls: 'admin' },
  50: { text: 'ResourceUploader', cls: 'uploader' },
  30: { text: 'CompanionPC', cls: 'companion' },
  20: { text: 'Validator', cls: 'validator' },
  10: { text: 'Operator', cls: 'operator' },
  0: { text: 'None', cls: 'none' }
};

export const ROLE_OPTIONS: RoleOption[] = [
  { value: '', text: 'Choose Role' },
  { value: '10', text: '10 (Operator)' },
  { value: '20', text: '20 (Validator)' },
  { value: '30', text: '30 (CompanionPC)' },
  { value: '40', text: '40 (Admin)' },
  { value: '50', text: '50 (ResourceUploader)' },
  { value: '1000', text: '1000 (ApiAdmin)' }
];

export const OPERATIONS_CONFIG: Record<string, OperationConfig> = {
  'list-users': {
    title: 'List Users',
    description: 'Filter by email (optional)',
    hasForm: false
  },
  'show-chart': {
    title: 'Show Chart',
    description: 'Pie charts by CPU / GPU / Memory',
    hasForm: false
  },
  'current-user': {
    title: 'Current User',
    description: 'Get info about current user',
    hasForm: false
  },
  'list-resources': {
    title: 'List Resources',
    description: 'List files in folder',
    hasForm: false
  },
  'upload-file': {
    title: 'Upload File',
    description: 'To specific folder',
    hasForm: true
  },
  'clear-folder': {
    title: 'Clear Folder',
    description: 'Remove all files',
    hasForm: true
  }
};

export const OUTPUT_TITLES: Record<string, string> = {
  'list-users': 'Users',
  'current-user': 'Current User',
  'list-resources': 'Resources',
  'show-chart': 'Users Hardware charts',
  'upload-file': 'Upload File',
  'clear-folder': 'Clear Folder',
};

export const CHART_COLORS: string[] = [
  '#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#a78bfa', 
  '#f87171', '#22d3ee', '#86efac', '#fca5a5', '#c084fc'
];

export const MEMORY_THRESHOLDS = {
  VERY_LARGE: 1e7,  // Likely KB
  LARGE: 1e5,       // Likely MB  
  MEDIUM: 256       // Likely already GB
} as const;

export const LOGIN_FIELDS: string[] = [
  'lastLogin', 'last_login', 'lastLoginAt', 'last_login_at',
  'lastSeen', 'last_seen', 'lastSeenAt', 'last_seen_at',
  'last_activity', 'lastActivity'
];
