export const extractToken = (data: any): string | null => {
  if (!data) return null;
  
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return parsed.token || parsed.data?.token || null;
    } catch {
      return data;
    }
  }
  
  if (data.token) return data.token;
  if (data.data?.token) return data.data.token;
  
  return null;
};

export const parseHardware = (hardware: any): any => {
  if (!hardware) return null;
  
  try {
    if (typeof hardware === 'string') {
      // Try to parse as JSON first
      try {
        return JSON.parse(hardware);
      } catch {
        // If JSON parsing fails, try to extract hardware info from string
        const hw: any = {};
        
        // Handle single line format: "CPU: ... GPU: ... Memory: ... DriveSerial: ..."
        const cpuMatch = hardware.match(/CPU:\s*([^.]*)/i);
        const gpuMatch = hardware.match(/GPU:\s*([^.]*)/i);
        const memoryMatch = hardware.match(/Memory:\s*([^.]*)/i);
        const driveMatch = hardware.match(/DriveSerial:\s*([^.]*)/i);
        
        if (cpuMatch) hw.cpu = cpuMatch[1].trim();
        if (gpuMatch) hw.gpu = gpuMatch[1].trim();
        if (memoryMatch) hw.memory = memoryMatch[1].trim();
        if (driveMatch) hw.drive = driveMatch[1].trim();
        
        return Object.keys(hw).length > 0 ? hw : null;
      }
    }
    
    // If it's already an object, return it
    if (typeof hardware === 'object') {
      return hardware;
    }
    
    return null;
  } catch {
    return null;
  }
};

export const roleCode = (role: any): number => {
  if (typeof role === 'number') return role;
  if (typeof role === 'string') {
    const match = role.match(/-?\d+/);
    if (match) return Number(match[0]);
  }
  return Number(role) || 0;
};

export const roleLabel = (role: any): { text: string; cls: string } => {
  const code = roleCode(role);
  
  switch (code) {
    case 0: return { text: 'None', cls: 'none' };
    case 10: return { text: 'Operator', cls: 'operator' };
    case 20: return { text: 'Validator', cls: 'validator' };
    case 30: return { text: 'CompanionPC', cls: 'companion' };
    case 40: return { text: 'Admin', cls: 'admin' };
    case 50: return { text: 'ResourceUploader', cls: 'uploader' };
    case 1000: return { text: 'ApiAdmin', cls: 'apiadmin' };
    default: return { text: `Role ${code}`, cls: 'none' };
  }
};

export const getLastLoginValue = (lastLogin: any): string => {
  if (!lastLogin) return 'Never';
  
  try {
    const date = new Date(lastLogin);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleString();
  } catch {
    return 'Invalid Date';
  }
};
