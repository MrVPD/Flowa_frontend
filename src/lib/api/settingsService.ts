import axiosInstance from './axiosConfig';

interface GeneralSettings {
  siteName?: string;
  defaultLanguage?: string;
  timezone?: string;
  notificationEmail?: string;
  logoUrl?: string;
}

interface AISettings {
  defaultModel?: string;
  temperature?: number;
  maxTokens?: number;
  defaultPromptTemplate?: string;
  contentFilters?: string[];
}

interface AdvancedSettings {
  debugMode?: boolean;
  logLevel?: string;
  cacheExpiration?: number;
  rateLimits?: Record<string, number>;
  corsOrigins?: string[];
}

export const settingsService = {
  getGeneralSettings: async () => {
    const response = await axiosInstance.get('/api/settings/general');
    return response.data;
  },

  updateGeneralSettings: async (settings: GeneralSettings) => {
    const response = await axiosInstance.put('/api/settings/general', settings);
    return response.data;
  },

  getAISettings: async () => {
    const response = await axiosInstance.get('/api/settings/ai');
    return response.data;
  },

  updateAISettings: async (settings: AISettings) => {
    const response = await axiosInstance.put('/api/settings/ai', settings);
    return response.data;
  },

  getAdvancedSettings: async () => {
    const response = await axiosInstance.get('/api/settings/advanced');
    return response.data;
  },

  updateAdvancedSettings: async (settings: AdvancedSettings) => {
    const response = await axiosInstance.put('/api/settings/advanced', settings);
    return response.data;
  },

  backupSystem: async () => {
    const response = await axiosInstance.post('/api/settings/backup');
    return response.data;
  },

  restoreSystem: async (backupFile: File) => {
    const formData = new FormData();
    formData.append('backup', backupFile);
    
    const response = await axiosInstance.post('/api/settings/restore', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getBackupHistory: async () => {
    const response = await axiosInstance.get('/api/settings/backup-history');
    return response.data;
  },
};
