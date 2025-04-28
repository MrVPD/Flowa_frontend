'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon, 
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { isAuthenticated } from '../lib/utils/auth';
import { brandService } from '../lib/api/brandService';
import { contentService } from '../lib/api/contentService';
import { socialMediaService } from '../lib/api/socialMediaService';
import { analyticsService } from '../lib/api/analyticsService';
import { chatService } from '../lib/api/chatService';

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
    audienceGrowth: '0%',
    topPlatform: '',
    scheduledPosts: 0,
    completedTasks: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentBrands, setRecentBrands] = useState<any[]>([]);
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    // Check if running in browser environment
    if (typeof window !== 'undefined') {
      if (!isAuthenticated()) {
        router.push('/auth/login');
        return;
      }
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch brands
        try {
          const brandsResponse = await brandService.getBrands();
          setRecentBrands(Array.isArray(brandsResponse) ? brandsResponse.slice(0, 3) : []);
          setStats(prev => ({
            ...prev,
            brandCount: Array.isArray(brandsResponse) ? brandsResponse.length : 0
          }));
        } catch (brandError) {
          console.error('Error fetching brands:', brandError);
          setRecentBrands([]);
        }
        
        // Fetch content
        try {
          const contentResponse = await contentService.getUserContent(1, 5);
          if (contentResponse && Array.isArray(contentResponse.items)) {
            setRecentContent(contentResponse.items.map(item => ({
              id: item._id || item.id,
              title: item.title || 'Nội dung không tiêu đề',
              platform: item.platform || 'Đa nền tảng',
              status: item.status || 'draft',
              date: item.createdAt || new Date().toISOString()
            })));
            
            setStats(prev => ({
              ...prev,
              contentCount: contentResponse.total || contentResponse.items.length
            }));
          } else {
            // Fallback to mock data if API fails
            setRecentContent([
              { id: 1, title: 'Bài viết về sản phẩm mới', platform: 'Facebook', status: 'published', date: '2025-04-22' },
              { id: 2, title: 'Quảng cáo khuyến mãi hè', platform: 'Instagram', status: 'scheduled', date: '2025-04-25' },
              { id: 3, title: 'Hướng dẫn sử dụng sản phẩm', platform: 'LinkedIn', status: 'draft', date: '2025-04-23' },
              { id: 4, title: 'Thông báo sự kiện ra mắt', platform: 'Twitter', status: 'published', date: '2025-04-20' },
            ]);
            setStats(prev => ({ ...prev, contentCount: 24 }));
          }
        } catch (contentError) {
          console.error('Error fetching content:', contentError);
          // Fallback to mock data
          setRecentContent([
            { id: 1, title: 'Bài viết về sản phẩm mới', platform: 'Facebook', status: 'published', date: '2025-04-22' },
            { id: 2, title: 'Quảng cáo khuyến mãi hè', platform: 'Instagram', status: 'scheduled', date: '2025-04-25' },
            { id: 3, title: 'Hướng dẫn sử dụng sản phẩm', platform: 'LinkedIn', status: 'draft', date: '2025-04-23' },
            { id: 4, title: 'Thông báo sự kiện ra mắt', platform: 'Twitter', status: 'published', date: '2025-04-20' },
          ]);
          setStats(prev => ({ ...prev, contentCount: 24 }));
        }
        
        // Fetch social posts
        try {
          const postsResponse = await socialMediaService.getPosts({ limit: 5 });
          if (postsResponse && Array.isArray(postsResponse.items)) {
            setRecentPosts(postsResponse.items.map(item => ({
              id: item._id || item.id,
              content: item.content || '',
              platform: item.platform || 'Facebook',
              status: item.status || 'draft',
              scheduledDate: item.scheduledDate,
              metrics: item.metrics || { likes: 0, comments: 0, shares: 0 }
            })));
            
            setStats(prev => ({
              ...prev,
              postCount: postsResponse.total || postsResponse.items.length,
              scheduledPosts: postsResponse.items.filter(post => post.status === 'scheduled').length
            }));
          } else {
            // Fallback to mock data
            setRecentPosts([
              { id: 1, content: 'Chúng tôi vui mừng thông báo ra mắt sản phẩm mới!', platform: 'Facebook', status: 'published', metrics: { likes: 45, comments: 12, shares: 8 } },
              { id: 2, content: 'Khám phá bộ sưu tập mới của chúng tôi ngay hôm nay!', platform: 'Instagram', status: 'scheduled', scheduledDate: '2025-04-28T10:00:00Z' },
            ]);
            setStats(prev => ({ ...prev, postCount: 42, scheduledPosts: 12 }));
          }
        } catch (postsError) {
          console.error('Error fetching posts:', postsError);
          // Fallback to mock data
          setRecentPosts([
            { id: 1, content: 'Chúng tôi vui mừng thông báo ra mắt sản phẩm mới!', platform: 'Facebook', status: 'published', metrics: { likes: 45, comments: 12, shares: 8 } },
            { id: 2, content: 'Khám phá bộ sưu tập mới của chúng tôi ngay hôm nay!', platform: 'Instagram', status: 'scheduled', scheduledDate: '2025-04-28T10:00:00Z' },
          ]);
          setStats(prev => ({ ...prev, postCount: 42, scheduledPosts: 12 }));
        }
        
        // Fetch chat sessions
        try {
          const chatResponse = await chatService.getSessions();
          if (chatResponse && Array.isArray(chatResponse)) {
            setRecentChats(chatResponse.slice(0, 3).map(chat => ({
              id: chat._id || chat.id,
              title: chat.title || 'Chat không tiêu đề',
              updatedAt: chat.updatedAt || new Date().toISOString(),
              messageCount: chat.messages?.length || 0
            })));
            
            setStats(prev => ({
              ...prev,
              chatCount: chatResponse.length
            }));
          } else {
            // Fallback to mock data
            setRecentChats([
              { id: 1, title: 'Chiến dịch mùa hè', updatedAt: '2025-04-23T15:30:00Z', messageCount: 24 },
              { id: 2, title: 'Ý tưởng sản phẩm mới', updatedAt: '2025-04-22T10:15:00Z', messageCount: 18 },
            ]);
            setStats(prev => ({ ...prev, chatCount: 15 }));
          }
        } catch (chatError) {
          console.error('Error fetching chats:', chatError);
          // Fallback to mock data
          setRecentChats([
            { id: 1, title: 'Chiến dịch mùa hè', updatedAt: '2025-04-23T15:30:00Z', messageCount: 24 },
            { id: 2, title: 'Ý tưởng sản phẩm mới', updatedAt: '2025-04-22T10:15:00Z', messageCount: 18 },
          ]);
          setStats(prev => ({ ...prev, chatCount: 15 }));
        }
        
        // Fetch analytics
        try {
          const analyticsResponse = await analyticsService.getDashboardStats();
          if (analyticsResponse) {
            setStats(prev => ({
              ...prev,
              engagementRate: analyticsResponse.engagementRate || '3.8%',
              audienceGrowth: analyticsResponse.audienceGrowth || '2.5%',
              topPlatform: analyticsResponse.topPlatform || 'Instagram',
              completedTasks: analyticsResponse.completedTasks || 28
            }));
            
            setPerformanceData(analyticsResponse.performanceData || null);
          } else {
            // Fallback to mock data
            setStats(prev => ({
              ...prev,
              engagementRate: '3.8%',
              audienceGrowth: '2.5%',
              topPlatform: 'Instagram',
              completedTasks: 28
            }));
            
            setPerformanceData({
              labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
              datasets: [
                {
                  label: 'Lượt tương tác',
                  data: [65, 78, 52, 91, 83, 56, 89],
                }
              ]
            });
          }
        } catch (analyticsError) {
          console.error('Error fetching analytics:', analyticsError);
          // Fallback to mock data
          setStats(prev => ({
            ...prev,
            engagementRate: '3.8%',
            audienceGrowth: '2.5%',
            topPlatform: 'Instagram',
            completedTasks: 28
          }));
        }
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
      <div className="pb-5 border-b border-gray-200 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tổng quan về hoạt động của bạn trên hệ thống Flowa
          </p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Dữ liệu cập nhật: {new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5">
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

          {/* Additional Stats */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500 truncate">Tăng trưởng người theo dõi</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">{stats.audienceGrowth}</div>
                  </div>
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <UserGroupIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500">So với tháng trước</div>
                    <div className="ml-2 flex items-center text-sm font-semibold text-green-600">
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      1.2%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500 truncate">Nền tảng hiệu quả nhất</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">{stats.topPlatform}</div>
                  </div>
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <ChartBarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Tỷ lệ chuyển đổi cao nhất</div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500 truncate">Bài đăng đã lên lịch</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">{stats.scheduledPosts}</div>
                  </div>
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <CalendarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Sẽ được đăng trong 7 ngày tới</div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-500 truncate">Nhiệm vụ hoàn thành</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">{stats.completedTasks}</div>
                  </div>
                  <div className="flex-shrink-0 bg-pink-100 rounded-md p-3">
                    <ShoppingBagIcon className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500">Tháng này</div>
                    <div className="ml-2 flex items-center text-sm font-semibold text-green-600">
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      8%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`${activeTab === 'content' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Nội dung gần đây
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`${activeTab === 'posts' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Bài đăng mạng xã hội
                </button>
                <button
                  onClick={() => setActiveTab('chats')}
                  className={`${activeTab === 'chats' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Chat AI gần đây
                </button>
              </nav>
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="mt-4">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg w-full">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Tiêu đề</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nền tảng</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ngày</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Hành động</span>
                        </th>
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
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => router.push(`/dashboard/content/${content.id}`)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Xem<span className="sr-only">, {content.title}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => router.push('/dashboard/content')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Xem tất cả nội dung
                  </button>
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="mt-4">
                <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="bg-white shadow sm:rounded-lg overflow-hidden">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-bold">{post.platform.charAt(0)}</span>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-900 capitalize">{post.platform}</span>
                            <span
                              className={`ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(
                                post.status
                              )}`}
                            >
                              {post.status === 'published' ? 'Đã đăng' : post.status === 'scheduled' ? 'Đã lên lịch' : post.status === 'failed' ? 'Thất bại' : 'Bản nháp'}
                            </span>
                          </div>
                          <button
                            onClick={() => router.push(`/dashboard/social/posts/${post.id}`)}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-line">
                          {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                        </div>
                        {post.scheduledDate && (
                          <div className="mt-2 text-xs text-gray-500">
                            Lên lịch: {new Date(post.scheduledDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                        {post.metrics && (
                          <div className="mt-3 flex space-x-4 text-xs text-gray-500">
                            <span>{post.metrics.likes || 0} lượt thích</span>
                            <span>{post.metrics.comments || 0} bình luận</span>
                            <span>{post.metrics.shares || 0} chia sẻ</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => router.push('/dashboard/social')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Quản lý mạng xã hội
                  </button>
                </div>
              </div>
            )}

            {/* Chats Tab */}
            {activeTab === 'chats' && (
              <div className="mt-4">
                <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {recentChats.map((chat) => (
                    <div key={chat.id} className="bg-white shadow sm:rounded-lg overflow-hidden">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">{chat.title}</h3>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <span>{chat.messageCount} tin nhắn</span>
                              <span className="mx-2">•</span>
                              <span>Cập nhật: {new Date(chat.updatedAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => router.push(`/dashboard/chat/${chat.id}`)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Tiếp tục chat
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => router.push('/dashboard/chat')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Xem tất cả chat
                  </button>
                </div>
              </div>
            )}
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
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentBrands.length > 0 ? (
                recentBrands.map((brand) => (
                  <div key={brand._id || Math.random().toString()} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          {brand.logo ? (
                            <img src={brand.logo} alt={brand.name} className="h-8 w-8 rounded-full" />
                          ) : (
                            <span className="text-indigo-600 font-bold">{brand.name ? brand.name.charAt(0) : 'B'}</span>
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
