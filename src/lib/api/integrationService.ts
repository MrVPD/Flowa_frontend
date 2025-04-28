import axiosInstance from './axiosConfig';

interface AIServiceConfig {
  service: string;
  apiKey: string;
  parameters?: Record<string, any>;
}

interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
}

export const integrationService = {
  getAIServices: async () => {
    const response = await axiosInstance.get('/api/integrations/ai-services');
    return response.data;
  },

  updateAIService: async (serviceId: string, config: AIServiceConfig) => {
    const response = await axiosInstance.put(`/api/integrations/ai-services/${serviceId}`, config);
    return response.data;
  },

  getAPIUsage: async (dateRange?: { startDate: string; endDate: string }) => {
    let url = '/api/integrations/api-usage';
    if (dateRange) {
      url += `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
    }
    const response = await axiosInstance.get(url);
    return response.data;
  },

  configureN8N: async (config: WebhookConfig) => {
    const response = await axiosInstance.post('/api/integrations/n8n', config);
    return response.data;
  },

  getN8NConfig: async () => {
    const response = await axiosInstance.get('/api/integrations/n8n');
    return response.data;
  },

  getPublicAPIDoc: async () => {
    const response = await axiosInstance.get('/api/integrations/api-docs');
    return response.data;
  },

  generateAPIKey: async (name: string, permissions: string[]) => {
    const response = await axiosInstance.post('/api/integrations/api-key', { name, permissions });
    return response.data;
  },

  revokeAPIKey: async (keyId: string) => {
    const response = await axiosInstance.delete(`/api/integrations/api-key/${keyId}`);
    return response.data;
  },
};
