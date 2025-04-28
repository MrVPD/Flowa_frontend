'use client';

import React, { useState } from 'react';
import { 
  ArrowPathIcon, 
  ShareIcon, 
  PencilIcon, 
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';

interface ContentItem {
  id: string;
  content: string;
  platform: string;
  themeName: string;
}

interface ContentListProps {
  contents: ContentItem[];
  onOptimize: (contentId: string, platform: string) => void;
}

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

const ContentList: React.FC<ContentListProps> = ({ contents, onOptimize }) => {
  const [optimizing, setOptimizing] = useState<Record<string, boolean>>({});
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [optimizePlatform, setOptimizePlatform] = useState<string>('');
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);

  const handleOptimizeClick = (contentId: string) => {
    setSelectedContent(contentId);
    setShowOptimizeModal(true);
  };

  const handleOptimizeSubmit = async () => {
    if (!selectedContent || !optimizePlatform) return;
    
    try {
      setOptimizing({ ...optimizing, [selectedContent]: true });
      await onOptimize(selectedContent, optimizePlatform);
    } finally {
      setOptimizing({ ...optimizing, [selectedContent]: false });
      setShowOptimizeModal(false);
      setSelectedContent(null);
      setOptimizePlatform('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (contents.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <div className="text-center">
          <p className="text-gray-500">Chưa có nội dung nào được tạo. Vui lòng sử dụng form bên trái để tạo nội dung.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Nội dung đã tạo</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {contents.length} nội dung
          </span>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {contents.map((item) => (
              <li key={item.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${platformIcons[item.platform] || 'bg-gray-100 text-gray-600'}`}>
                      {item.platform.charAt(0).toUpperCase()}
                    </span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {platformNames[item.platform] || item.platform} - {item.themeName}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOptimizeClick(item.id)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.content)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <DocumentDuplicateIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                  {item.content}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Optimize Modal */}
      {showOptimizeModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ArrowPathIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Tối ưu nội dung</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Chọn nền tảng để tối ưu nội dung này
                      </p>
                      <div className="mt-4">
                        <label htmlFor="optimizePlatform" className="block text-sm font-medium text-gray-700">
                          Nền tảng
                        </label>
                        <select
                          id="optimizePlatform"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={optimizePlatform}
                          onChange={(e) => setOptimizePlatform(e.target.value)}
                        >
                          <option value="">Chọn nền tảng</option>
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="tiktok">TikTok</option>
                          <option value="twitter">Twitter/X</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="threads">Threads</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleOptimizeSubmit}
                  disabled={!optimizePlatform || optimizing[selectedContent || '']}
                >
                  {optimizing[selectedContent || ''] ? 'Đang tối ưu...' : 'Tối ưu'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowOptimizeModal(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentList;
