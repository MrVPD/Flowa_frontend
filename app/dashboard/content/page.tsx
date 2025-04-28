'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { isAuthenticated } from '../../lib/utils/auth';
import ContentGenerationForm from './ContentGenerationForm';
import ContentList from './ContentList';

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
        
        // In a real application, we would fetch data from the API
        // For now, let's use mock data
        
        // Mock brands
        const mockBrands = [
          { _id: '1', name: 'Brand 1' },
          { _id: '2', name: 'Brand 2' },
          { _id: '3', name: 'Brand 3' },
        ];
        setBrands(mockBrands);
        
        // Mock themes
        const mockThemes = [
          { _id: '1', name: 'Summer Collection', category: 'Fashion' },
          { _id: '2', name: 'New Products', category: 'Products' },
          { _id: '3', name: 'Holiday Deals', category: 'Promotions' },
        ];
        setThemes(mockThemes);
        
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
      
      // In a real application, we would fetch themes based on the selected brand
      // For now, let's use mock data
      
      const mockThemes = [
        { _id: '4', name: 'Brand Specific Theme 1', category: 'Brand Specific' },
        { _id: '5', name: 'Brand Specific Theme 2', category: 'Brand Specific' },
      ];
      setThemes(mockThemes);
      
    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateContent = async (formData: any) => {
    try {
      setIsGenerating(true);
      
      // In a real application, we would call the API to generate content
      // For now, let's use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockGeneratedContent = [
        {
          id: '1',
          content: `📣 [Nội dung mẫu cho ${formData.platform} về chủ đề "${themes.find(t => t._id === formData.themeId)?.name}"]

Bạn đã bao giờ tự hỏi làm thế nào để tối ưu hóa chiến lược tiếp thị của mình? Hôm nay chúng tôi sẽ chia sẻ với bạn những bí quyết hàng đầu.

Chiến lược tiếp thị hiệu quả bắt đầu từ việc hiểu rõ khách hàng của bạn. Hãy dành thời gian nghiên cứu và phân tích đối tượng mục tiêu của bạn để tạo ra nội dung phù hợp nhất.

Đừng quên chia sẻ bài viết này nếu bạn thấy nó hữu ích và để lại bình luận về trải nghiệm của bạn!

#MarketingTips #ChiaSẻKiếnThức`,
          platform: formData.platform,
          themeName: themes.find(t => t._id === formData.themeId)?.name || '',
        },
        {
          id: '2',
          content: `✨ [Tiêu đề hấp dẫn khác về chủ đề "${themes.find(t => t._id === formData.themeId)?.name}"]

Trong thế giới kinh doanh cạnh tranh ngày nay, việc nổi bật là điều cần thiết. Hãy xem cách chúng tôi có thể giúp thương hiệu của bạn tỏa sáng.

Bạn đã có trải nghiệm nào tương tự chưa? Chia sẻ với chúng tôi trong phần bình luận nhé!

.
.
.

#BusinessStrategy #BrandGrowth #MarketingSuccess`,
          platform: formData.platform,
          themeName: themes.find(t => t._id === formData.themeId)?.name || '',
        },
      ];
      
      setGeneratedContent(mockGeneratedContent);
      
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimizeContent = async (contentId: string, platform: string) => {
    try {
      setIsLoading(true);
      
      // In a real application, we would call the API to optimize content
      // For now, let's use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const optimizedContent = {
        id: Date.now().toString(),
        content: `[Nội dung đã tối ưu cho ${platform}]

📱 Cách tối ưu nội dung của bạn trên ${platform} để đạt hiệu quả cao nhất!

✅ Sử dụng hình ảnh chất lượng cao
✅ Viết caption ngắn gọn, súc tích
✅ Sử dụng hashtag phù hợp
✅ Tương tác với người theo dõi

Hãy thử áp dụng những mẹo này và xem kết quả nhé!

#${platform}Tips #ContentStrategy #DigitalMarketing`,
        platform: platform,
        themeName: 'Nội dung tối ưu',
      };
      
      setGeneratedContent(prev => [...prev, optimizedContent]);
      
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
              onOptimizeAction={handleOptimizeContent}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
