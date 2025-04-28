'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/src/components/layouts/DashboardLayout';
import { isAuthenticated } from '@/src/lib/utils/auth';
import { brandService } from '@/src/lib/api/brandService';
import { themeService } from '@/src/lib/api/themeService';
import { contentService } from '@/src/lib/api/contentService';
import ContentGenerationForm from '@/src/components/content/ContentGenerationForm';
import ContentList from '@/src/components/content/ContentList';

interface Brand {
  _id: string;
  name: string;
}

interface Theme {
  _id: string;
  name: string;
  category: string;
}

interface GeneratedContent {
  id: string;
  content: string;
  platform: string;
  themeName: string;
}

export default function ContentPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const brandsResponse = await brandService.getBrands();
        setBrands(brandsResponse);

        if (brandsResponse.length > 0) {
          const themesResponse = await themeService.getThemes(brandsResponse[0]._id);
          setThemes(themesResponse);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleBrandChange = async (brandId: string) => {
    try {
      setIsLoading(true);
      const themesResponse = await themeService.getThemes(brandId);
      setThemes(themesResponse);
    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateContent = async (formData: any) => {
    try {
      setIsGenerating(true);
      const response = await contentService.generateContent(formData);
      setGeneratedContent(response.contents);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimizeContent = async (contentId: string, platform: string) => {
    try {
      setIsLoading(true);
      const response = await contentService.optimizeContent({
        contentId,
        platform,
      });
      
      // Update the content list with the optimized content
      setGeneratedContent(prev => [
        ...prev,
        response.content
      ]);
    } catch (error) {
      console.error('Error optimizing content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">Tạo nội dung</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tạo nội dung tự động cho các nền tảng mạng xã hội
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ContentGenerationForm 
              brands={brands}
              themes={themes}
              onBrandChange={handleBrandChange}
              onSubmit={handleGenerateContent}
              isGenerating={isGenerating}
            />
          </div>
          <div className="lg:col-span-2">
            <ContentList 
              contents={generatedContent}
              onOptimize={handleOptimizeContent}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
