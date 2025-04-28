'use client';

import React, { useState } from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  status: string;
  publishedAt?: string;
  scheduledFor?: string;
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

interface SocialPostsListProps {
  posts: SocialPost[];
  onUpdateStatus: (postId: string, status: string) => void;
}

const SocialPostsList: React.FC<SocialPostsListProps> = ({ posts, onUpdateStatus }) => {
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const platformIcons: Record<string, string> = {
    facebook: 'bg-blue-100 text-blue-600',
    instagram: 'bg-pink-100 text-pink-600',
    tiktok: 'bg-black text-white',
    twitter: 'bg-blue-50 text-blue-400',
    x: 'bg-black text-white',
    linkedin: 'bg-blue-700 text-white',
    threads: 'bg-purple-100 text-purple-600',
  };

  const platformNames: Record<string, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    twitter: 'Twitter',
    x: 'X',
    linkedin: 'LinkedIn',
    threads: 'Threads',
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Đã đăng';
      case 'scheduled':
        return 'Đã lên lịch';
      case 'draft':
        return 'Bản nháp';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const handleViewPost = (post: SocialPost) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Bài đăng mạng xã hội</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {posts.length} bài đăng
          </span>
        </div>

        <div className="border-t border-gray-200">
          {posts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nền tảng
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nội dung
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tương tác
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full ${platformIcons[post.platform] || 'bg-gray-100'} flex items-center justify-center`}>
                            <span className="font-medium">{post.platform.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="ml-2 text-sm font-medium text-gray-900">
                            {platformNames[post.platform] || post.platform}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-xs">
                          {post.content.substring(0, 50)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(post.status)}`}>
                          {getStatusText(post.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.publishedAt && (
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                            {formatDate(post.publishedAt)}
                          </div>
                        )}
                        {post.scheduledFor && (
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1 text-blue-500" />
                            {formatDate(post.scheduledFor)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.metrics ? (
                          <div className="flex space-x-2">
                            <span>{post.metrics.likes} likes</span>
                            <span>{post.metrics.comments} comments</span>
                            <span>{post.metrics.shares} shares</span>
                          </div>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleViewPost(post)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          {post.status === 'draft' && (
                            <button
                              onClick={() => onUpdateStatus(post.id, 'published')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                          )}
                          {post.status === 'scheduled' && (
                            <button
                              onClick={() => onUpdateStatus(post.id, 'published')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <ArrowPathIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-4 py-5 text-center">
              <p className="text-gray-500">Chưa có bài đăng nào.</p>
            </div>
          )}
        </div>
      </div>

      {/* Post Detail Modal */}
      {showPostModal && selectedPost && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${platformIcons[selectedPost.platform] || 'bg-gray-100'} sm:mx-0 sm:h-10 sm:w-10`}>
                    <span className="font-medium">{selectedPost.platform.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {platformNames[selectedPost.platform] || selectedPost.platform} Post
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">
                        {selectedPost.status === 'published' && selectedPost.publishedAt && (
                          <span className="flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                            Đã đăng: {formatDate(selectedPost.publishedAt)}
                          </span>
                        )}
                        {selectedPost.status === 'scheduled' && selectedPost.scheduledFor && (
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1 text-blue-500" />
                            Đã lên lịch: {formatDate(selectedPost.scheduledFor)}
                          </span>
                        )}
                      </p>
                      <div className="bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                        {selectedPost.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowPostModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialPostsList;
