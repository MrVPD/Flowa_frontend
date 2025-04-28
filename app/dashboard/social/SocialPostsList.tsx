'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface SocialPost {
  id: string;
  content: string;
  platform: string;
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  image?: string;
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

const mockPosts: SocialPost[] = [
  {
    id: '1',
    content: 'Chúng tôi vui mừng thông báo ra mắt sản phẩm mới! #newproduct #launch',
    platform: 'facebook',
    scheduledDate: '2025-05-01T10:00:00Z',
    status: 'scheduled',
    image: 'https://placehold.co/600x400/png',
  },
  {
    id: '2',
    content: 'Khám phá bộ sưu tập mới của chúng tôi ngay hôm nay! #newcollection',
    platform: 'instagram',
    status: 'published',
    image: 'https://placehold.co/600x600/png',
    metrics: {
      likes: 120,
      comments: 15,
      shares: 8,
    },
  },
  {
    id: '3',
    content: 'Đang làm việc trên một dự án thú vị. Hãy đón xem! #comingsoon',
    platform: 'twitter',
    status: 'draft',
  },
  {
    id: '4',
    content: 'Chia sẻ kinh nghiệm của chúng tôi về cách xây dựng thương hiệu trong thời đại số. #branding #digitalmarketing',
    platform: 'linkedin',
    scheduledDate: '2025-04-28T14:30:00Z',
    status: 'failed',
  },
];

export default function SocialPostsList() {
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  const handleViewPost = (post: SocialPost) => {
    setSelectedPost(post);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedPost(null);
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) {
      setIsDeleting((prev) => ({ ...prev, [postId]: true }));
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setIsDeleting((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold">F</span>
          </div>
        );
      case 'instagram':
        return (
          <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
            <span className="text-pink-600 font-bold">I</span>
          </div>
        );
      case 'twitter':
        return (
          <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center">
            <span className="text-sky-600 font-bold">T</span>
          </div>
        );
      case 'linkedin':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-800 font-bold">L</span>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-600 font-bold">?</span>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="bg-white shadow sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Bài đăng mạng xã hội</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Quản lý tất cả các bài đăng của bạn trên các nền tảng mạng xã hội.</p>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-10 bg-white shadow sm:rounded-lg">
          <p className="text-gray-500">Chưa có bài đăng nào. Hãy tạo bài đăng đầu tiên của bạn!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getPlatformIcon(post.platform)}
                    <span className="ml-2 text-sm font-medium text-gray-900 capitalize">{post.platform}</span>
                    <span
                      className={`ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(
                        post.status
                      )}`}
                    >
                      {getStatusText(post.status)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewPost(post)}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Xem
                    </button>
                    <button
                      onClick={() => {}}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      disabled={isDeleting[post.id]}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {isDeleting[post.id] ? (
                        <div className="h-4 w-4 mr-1 animate-spin rounded-full border-b-2 border-gray-600"></div>
                      ) : (
                        <TrashIcon className="h-4 w-4 mr-1" />
                      )}
                      Xóa
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                </div>
                {post.scheduledDate && (
                  <div className="mt-2 text-xs text-gray-500">
                    Lên lịch: {formatDate(post.scheduledDate)}
                  </div>
                )}
                {post.image && (
                  <div className="mt-3">
                    <img
                      src={post.image}
                      alt="Post"
                      className="h-40 w-auto object-cover rounded-md"
                    />
                  </div>
                )}
                {post.metrics && (
                  <div className="mt-3 flex space-x-4 text-xs text-gray-500">
                    <span>{post.metrics.likes} lượt thích</span>
                    <span>{post.metrics.comments} bình luận</span>
                    <span>{post.metrics.shares} chia sẻ</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing post details */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all sm:max-w-lg">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Chi tiết bài đăng
                  </Dialog.Title>
                  {selectedPost && (
                    <div className="mt-4">
                      <div className="flex items-center mb-4">
                        {getPlatformIcon(selectedPost.platform)}
                        <span className="ml-2 text-sm font-medium text-gray-900 capitalize">{selectedPost.platform}</span>
                        <span
                          className={`ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(
                            selectedPost.status
                          )}`}
                        >
                          {getStatusText(selectedPost.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-line mb-4">
                        {selectedPost.content}
                      </div>
                      {selectedPost.scheduledDate && (
                        <div className="mb-4 text-sm text-gray-500">
                          Lên lịch: {formatDate(selectedPost.scheduledDate)}
                        </div>
                      )}
                      {selectedPost.image && (
                        <div className="mb-4">
                          <img
                            src={selectedPost.image}
                            alt="Post"
                            className="w-full h-auto object-cover rounded-md"
                          />
                        </div>
                      )}
                      {selectedPost.metrics && (
                        <div className="flex space-x-4 text-sm text-gray-500 mb-4">
                          <span>{selectedPost.metrics.likes} lượt thích</span>
                          <span>{selectedPost.metrics.comments} bình luận</span>
                          <span>{selectedPost.metrics.shares} chia sẻ</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Đóng
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
