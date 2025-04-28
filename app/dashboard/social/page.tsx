'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tab } from '@headlessui/react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { isAuthenticated } from '../../lib/utils/auth';
import SocialAccountsList from './SocialAccountsList';
import SocialPostsList from './SocialPostsList';
import SocialPostForm from './SocialPostForm';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SocialPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  const tabs = [
    { name: 'Tài khoản', component: <SocialAccountsList /> },
    { name: 'Bài đăng', component: <SocialPostsList /> },
    { name: 'Tạo bài đăng', component: <SocialPostForm /> },
  ];

  return (
    <DashboardLayout>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">Mạng xã hội</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý tài khoản mạng xã hội và lên lịch đăng bài
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="mt-6">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/5 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-indigo-700 shadow'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600'
                    )
                  }
                >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              {tabs.map((tab, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none'
                  )}
                >
                  {tab.component}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}
    </DashboardLayout>
  );
}
