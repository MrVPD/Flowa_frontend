'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon, 
  BuildingStorefrontIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/src/components/layouts/DashboardLayout';
import { isAuthenticated } from '@/src/lib/utils/auth';
import { brandService } from '@/src/lib/api/brandService';
import { chatService } from '@/src/lib/api/chatService';
import { socialMediaService } from '@/src/lib/api/socialMediaService';
import { analyticsService } from '@/src/lib/api/analyticsService';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, bgColor }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    brandCount: 0,
    contentCount: 0,
    chatCount: 0,
    postCount: 0,
    engagementRate: '0%',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentBrands, setRecentBrands] = useState<any[]>([]);
  const [recentContent, setRecentContent] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch brands
        const brandsResponse = await brandService.getBrands();
        setRecentBrands(brandsResponse.slice(0, 5));
        
        // Mock data for demonstration
        setStats({
          brandCount: brandsResponse.length,
          contentCount: 24,
          chatCount: 15,
          postCount: 42,
          engagementRate: '3.8%',
        });
        
        // Mock recent content
        setRecentContent([
          { id: 1, title: 'Bài viết về sản phẩm mới', platform: 'Facebook', status: 'published', date: '2025-04-22' },
          { id: 2, title: 'Quảng cáo khuyến mãi hè', platform: 'Instagram', status: 'scheduled', date: '2025-04-25' },
          { id: 3, title: 'Hướng dẫn sử dụng sản phẩm', platform: 'LinkedIn', status: 'draft', date: '2025-04-23' },
          { id: 4, title: 'Thông báo sự kiện ra mắt', platform: 'Twitter', status: 'published', date: '2025-04-20' },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tổng quan về hoạt động của bạn trên hệ thống Flowa
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard 
              title="Thương hiệu" 
              value={stats.brandCount} 
              icon={BuildingStorefrontIcon} 
              bgColor="bg-indigo-600" 
            />
            <StatCard 
              title="Nội dung" 
              value={stats.contentCount} 
              icon={DocumentTextIcon} 
              bgColor="bg-blue-600" 
            />
            <StatCard 
              title="Chat AI" 
              value={stats.chatCount} 
              icon={ChatBubbleLeftRightIcon} 
              bgColor="bg-purple-600" 
            />
            <StatCard 
              title="Bài đăng" 
              value={stats.postCount} 
              icon={ShoppingBagIcon} 
              bgColor="bg-pink-600" 
            />
            <StatCard 
              title="Tỷ lệ tương tác" 
              value={stats.engagementRate} 
              icon={ChartBarIcon} 
              bgColor="bg-green-600" 
            />
          </div>

          {/* Recent Content */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Nội dung gần đây</h2>
            <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Tiêu đề</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nền tảng</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ngày</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentContent.map((content) => (
                    <tr key={content.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{content.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{content.platform}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(content.status)}`}>
                          {content.status === 'published' ? 'Đã đăng' : content.status === 'scheduled' ? 'Đã lên lịch' : 'Bản nháp'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{content.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Brands */}
          <div className="mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Thương hiệu của bạn</h2>
              <button 
                onClick={() => router.push('/dashboard/brands')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Xem tất cả
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recentBrands.length > 0 ? (
                recentBrands.map((brand) => (
                  <div key={brand._id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          {brand.logo ? (
                            <img src={brand.logo} alt={brand.name} className="h-8 w-8 rounded-full" />
                          ) : (
                            <span className="text-indigo-600 font-bold">{brand.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{brand.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{brand.description}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => router.push(`/dashboard/brands/${brand._id}`)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 bg-white overflow-hidden shadow rounded-lg p-6 text-center">
                  <p className="text-gray-500">Bạn chưa có thương hiệu nào. Hãy tạo thương hiệu đầu tiên!</p>
                  <button
                    onClick={() => router.push('/dashboard/brands/new')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Tạo thương hiệu
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
