import axiosInstance from './axiosConfig';

interface ContentGenerationData {
  brandId: string;
  themeId: string;
  productId?: string;
  platform?: string;
  contentType?: string;
  length?: string;
  tone?: string;
  keywords?: string[];
  targetAudience?: string;
}

interface ContentOptimizationData {
  content: string;
  platform: string;
  optimizationType?: string;
}

interface KeywordAnalysisData {
  content: string;
  industry?: string;
}

interface ImageGenerationData {
  prompt: string;
  style?: string;
  size?: string;
}

export const contentService = {
  generateContent: async (data: ContentGenerationData) => {
    const response = await axiosInstance.post('/api/content/generate', data);
    return response.data;
  },

  optimizeContent: async (data: ContentOptimizationData) => {
    const response = await axiosInstance.post('/api/content/optimize', data);
    return response.data;
  },

  analyzeKeywords: async (data: KeywordAnalysisData) => {
    const response = await axiosInstance.post('/api/content/analyze-keywords', data);
    return response.data;
  },

  generateImage: async (data: ImageGenerationData) => {
    const response = await axiosInstance.post('/api/content/generate-image', data);
    return response.data;
  },
};
