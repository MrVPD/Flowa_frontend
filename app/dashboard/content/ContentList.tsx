'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ClipboardDocumentIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface GeneratedContent {
  id: string;
  content: string;
  platform: string;
  themeName: string;
}

interface ContentListProps {
  contents: GeneratedContent[];
  onOptimizeAction: (contentId: string, platform: string) => void;
}

export default function ContentList({ contents, onOptimizeAction }: ContentListProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [isCopied, setIsCopied] = useState<Record<string, boolean>>({});

  const handleOptimize = async (content: GeneratedContent) => {
    setIsOptimizing(true);
    await onOptimizeAction(content.id, content.platform);
    setIsOptimizing(false);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setIsCopied({ ...isCopied, [id]: true });
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setIsCopied((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const openModal = (content: GeneratedContent) => {
    setSelectedContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedContent(null);
  };

  if (contents.length === 0) {
    return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Nội dung đã tạo</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500 mx-auto">
            <p>Chưa có nội dung nào được tạo. Hãy sử dụng form bên trái để tạo nội dung mới.</p>
          </div>
          <div className="mt-5">
            <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-center sm:justify-center">
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-medium text-gray-900">Nội dung sẽ hiển thị ở đây</h4>
                <p className="mt-1 text-sm text-gray-500">Sau khi tạo, bạn có thể sao chép hoặc tối ưu nội dung.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Nội dung đã tạo</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Dưới đây là nội dung đã được tạo. Bạn có thể sao chép hoặc tối ưu nội dung.</p>
        </div>
        <div className="mt-5 space-y-4">
          {contents.map((content) => (
            <div key={content.id} className="rounded-md bg-gray-50 px-6 py-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
                    {content.platform.charAt(0).toUpperCase() + content.platform.slice(1)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">{content.themeName}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleOptimize(content)}
                    disabled={isOptimizing}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
                  >
                    <ArrowPathIcon className={`-ml-0.5 mr-2 h-4 w-4 ${isOptimizing ? 'animate-spin' : ''}`} />
                    Tối ưu
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(content.id, content.content)}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <ClipboardDocumentIcon className="-ml-0.5 mr-2 h-4 w-4" />
                    {isCopied[content.id] ? 'Đã sao chép' : 'Sao chép'}
                  </button>
                </div>
              </div>
              <div 
                className="text-sm text-gray-700 whitespace-pre-line cursor-pointer"
                onClick={() => openModal(content)}
              >
                {content.content.length > 300
                  ? `${content.content.substring(0, 300)}...`
                  : content.content}
              </div>
              {content.content.length > 300 && (
                <button
                  type="button"
                  onClick={() => openModal(content)}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Xem thêm
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for viewing full content */}
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
                    Nội dung đầy đủ
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="flex items-center mb-3">
                      <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
                        {selectedContent?.platform ? (
                          selectedContent.platform.charAt(0).toUpperCase() + selectedContent.platform.slice(1)
                        ) : ''}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">{selectedContent?.themeName}</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {selectedContent?.content}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => selectedContent && handleCopy(selectedContent.id, selectedContent.content)}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <ClipboardDocumentIcon className="-ml-0.5 mr-2 h-4 w-4" />
                      {selectedContent && isCopied[selectedContent.id] ? 'Đã sao chép' : 'Sao chép'}
                    </button>
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
