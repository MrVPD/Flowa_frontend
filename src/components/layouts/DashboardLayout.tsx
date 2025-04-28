import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { 
  HomeIcon, 
  BuildingStorefrontIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  ShareIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { removeToken } from '@/lib/utils/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Thương hiệu', href: '/dashboard/brands', icon: BuildingStorefrontIcon },
    { name: 'Chủ đề nội dung', href: '/dashboard/themes', icon: DocumentTextIcon },
    { name: 'Sản phẩm', href: '/dashboard/products', icon: ShoppingBagIcon },
    { name: 'Chat AI', href: '/dashboard/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Tạo nội dung', href: '/dashboard/content', icon: PencilSquareIcon },
    { name: 'Mạng xã hội', href: '/dashboard/social', icon: ShareIcon },
    { name: 'Phân tích', href: '/dashboard/analytics', icon: ChartBarIcon },
    { name: 'Cài đặt', href: '/dashboard/settings', icon: CogIcon },
  ];

  const handleLogout = () => {
    removeToken();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <span className="text-xl font-bold">Flowa</span>
            </div>
            <button
              type="button"
              className="text-gray-300 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    router.pathname.startsWith(item.href)
                      ? 'bg-indigo-700 text-white'
                      : 'text-gray-100 hover:bg-indigo-700'
                  }`}
                >
                  <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-indigo-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-base font-medium text-gray-100 rounded-md hover:bg-indigo-700"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
          <div className="flex items-center h-16 px-4">
            <span className="text-xl font-bold">Flowa</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    router.pathname.startsWith(item.href)
                      ? 'bg-indigo-700 text-white'
                      : 'text-gray-100 hover:bg-indigo-700'
                  }`}
                >
                  <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-indigo-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-base font-medium text-gray-100 rounded-md hover:bg-indigo-700"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              {/* Search bar can be added here */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <Link href="/dashboard/profile" className="flex items-center text-gray-700 hover:text-gray-900">
                  <UserCircleIcon className="h-8 w-8" />
                  <span className="ml-2 hidden md:block">Hồ sơ</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
