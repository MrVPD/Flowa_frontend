'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/src/components/layouts/DashboardLayout';
import { isAuthenticated } from '@/src/lib/utils/auth';
import { brandService } from '@/src/lib/api/brandService';
import { socialMediaService } from '@/src/lib/api/socialMediaService';
import SocialAccountsList from '@/src/components/social/SocialAccountsList';
import SocialPostsList from '@/src/components/social/SocialPostsList';
import SocialPostForm from '@/src/components/social/SocialPostForm';

interface Brand {
  _id: string;
  name: string;
}

interface SocialAccount {
  id: string;
  platform: string;
  name: string;
  isConnected: boolean;
}

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

export default function SocialMediaPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'accounts' | 'posts' | 'create'>('accounts');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const fetchBrands = async () => {
      try {
        setIsLoading(true);
        const brandsResponse = await brandService.getBrands();
        setBrands(brandsResponse);
        
        if (brandsResponse.length > 0) {
          setSelectedBrand(brandsResponse[0]._id);
          await fetchSocialAccounts(brandsResponse[0]._id);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, [router]);

  const fetchSocialAccounts = async (brandId: string) => {
    try {
      setIsLoading(true);
      const accountsResponse = await socialMediaService.getAccounts(brandId);
      setAccounts(accountsResponse);
    } catch (error) {
      console.error('Error fetching social accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSocialPosts = async (brandId: string) => {
    try {
      setIsLoading(true);
      const postsResponse = await socialMediaService.getPosts(brandId);
      setPosts(postsResponse);
    } catch (error) {
      console.error('Error fetching social posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrandChange = async (brandId: string) => {
    setSelectedBrand(brandId);
    if (activeTab === 'accounts') {
      await fetchSocialAccounts(brandId);
    } else if (activeTab === 'posts') {
      await fetchSocialPosts(brandId);
    }
  };

  const handleTabChange = async (tab: 'accounts' | 'posts' | 'create') => {
    setActiveTab(tab);
    if (tab === 'accounts' && selectedBrand) {
      await fetchSocialAccounts(selectedBrand);
    } else if (tab === 'posts' && selectedBrand) {
      await fetchSocialPosts(selectedBrand);
    }
  };

  const handleConnectAccount = async (data: any) => {
    try {
      setIsLoading(true);
      await socialMediaService.connectAccount({
        ...data,
        brandId: selectedBrand,
      });
      await fetchSocialAccounts(selectedBrand);
    } catch (error) {
      console.error('Error connecting social account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (data: any) => {
    try {
      setIsLoading(true);
      await socialMediaService.createPost({
        ...data,
        brandId: selectedBrand,
      });
      setActiveTab('posts');
      await fetchSocialPosts(selectedBrand);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePostStatus = async (postId: string, status: string) => {
    try {
      setIsLoading(true);
      await socialMediaService.updatePostStatus(postId, status);
      await fetchSocialPosts(selectedBrand);
    } catch (error) {
      console.error('Error updating post status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">Mạng xã hội</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý tài khoản và bài đăng mạng xã hội
        </p>
      </div>

      <div className="mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="w-full sm:w-64 mb-4 sm:mb-0">
            <label htmlFor="brandSelect" className="block text-sm font-medium text-gray-700">
              Thương hiệu
            </label>
            <select
              id="brandSelect"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              disabled={isLoading || brands.length === 0}
            >
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
              {brands.length === 0 && (
                <option value="">Không có thương hiệu nào</option>
              )}
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'accounts'
                  ? 'text-indigo-700 bg-indigo-100'
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              } border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => handleTabChange('accounts')}
            >
              Tài khoản
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'posts'
                  ? 'text-indigo-700 bg-indigo-100'
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              } border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => handleTabChange('posts')}
            >
              Bài đăng
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'create'
                  ? 'text-indigo-700 bg-indigo-100'
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              } border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => handleTabChange('create')}
            >
              Tạo bài đăng
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'accounts' && (
              <SocialAccountsList 
                accounts={accounts} 
                onConnect={handleConnectAccount} 
              />
            )}
            {activeTab === 'posts' && (
              <SocialPostsList 
                posts={posts} 
                onUpdateStatus={handleUpdatePostStatus} 
              />
            )}
            {activeTab === 'create' && (
              <SocialPostForm 
                accounts={accounts.filter(account => account.isConnected)} 
                onSubmit={handleCreatePost} 
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
