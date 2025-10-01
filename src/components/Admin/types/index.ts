// Type definitions for the Admin dashboard

export interface User {
  id: string;
  email: string;
  role: number;
  hardware?: string | HardwareParsed;
  lastLogin?: string | number;
  last_login?: string | number;
  lastLoginAt?: string | number;
  last_login_at?: string | number;
  lastSeen?: string | number;
  last_seen?: string | number;
  lastSeenAt?: string | number;
  last_seen_at?: string | number;
  last_activity?: string | number;
  lastActivity?: string | number;
  userConfig?: {
    queueOffsets?: {
      annotationsOffset?: number;
      annotationsConfirmOffset?: number;
      annotationsCommandsOffset?: number;
    };
  };
  isEnabled?: boolean;
}

export interface HardwareParsed {
  cpu: string;
  gpu: string;
  memory: string;
  drive: string;
}

export interface RoleInfo {
  text: string;
  cls: string;
  code?: number;
}

export interface OperationConfig {
  title: string;
  description: string;
  hasForm: boolean;
}

export interface ChartData {
  label: string;
  value: number;
}

export interface ChartSegment extends ChartData {
  color: string;
  startDeg: number;
  endDeg: number;
  percent: number;
}

export interface RoleOption {
  value: string;
  text: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  id?: string;
  userId?: string;
  user?: {
    id: string;
  };
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  jwt?: string;
  Authorization?: string;
  authorization?: string;
  authToken?: string;
  data?: {
    token?: string;
  };
}

export interface ServerInfo {
  proxyEnabled?: boolean;
}

export interface CreateUserFormData {
  email: string;
  password: string;
  role: number;
}

export interface QueueOffsets {
  annotationsOffset: number;
  annotationsConfirmOffset: number;
  annotationsCommandsOffset: number;
}

export interface Operation {
  title: string;
  hasForm: boolean;
  run: (formData?: any) => Promise<void>;
}

export interface UseAdminOperationsReturn {
  currentOpKey: string;
  outputTitle: string;
  outputMeta: string;
  output: string;
  status: string;
  users: User[] | null;
  searchValue: string;
  operations: Record<string, Operation>;
  api: ApiFunction;
  setStatusMessage: (text: string, type?: string) => void;
  setOutputMeta: (meta: string) => void;
  updateOutputTitle: (opKey: string, extra?: string) => void;
  handleUserSearch: (searchEmail: string) => Promise<void>;
}

export interface ApiFunction {
  (path: string, options?: {
    method?: string;
    json?: any;
    formData?: FormData;
    headers?: Record<string, string>;
  }): Promise<any>;
}

export type MemoryThreshold = 'VERY_LARGE' | 'LARGE' | 'MEDIUM';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

