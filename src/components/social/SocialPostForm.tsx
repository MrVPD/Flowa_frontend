'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  PaperAirplaneIcon, 
  CalendarIcon, 
  PhotoIcon 
} from '@heroicons/react/24/outline';

interface SocialAccount {
  id: string;
  platform: string;
  name: string;
  isConnected: boolean;
}

interface SocialPostFormProps {
  accounts: SocialAccount[];
  onSubmit: (data: any) => void;
}

const SocialPostSchema = Yup.object().shape({
  content: Yup.string().required('Vui lòng nhập nội dung bài đăng'),
  platforms: Yup.array().min(1, 'Vui lòng chọn ít nhất một nền tảng'),
  scheduledTime: Yup.date().nullable(),
});

const SocialPostForm: React.FC<SocialPostFormProps> = ({ accounts, onSubmit }) => {
  const [isScheduled, setIsScheduled] = useState(false);

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

  // Group accounts by platform
  const accountsByPlatform = accounts.reduce((acc: Record<string, SocialAccount[]>, account) => {
    if (!acc[account.platform]) {
      acc[account.platform] = [];
    }
    acc[account.platform].push(account);
    return acc;
  }, {});

  const availablePlatforms = Object.keys(accountsByPlatform);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Tạo bài đăng mới</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Đăng nội dung lên các nền tảng mạng xã hội
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {accounts.length > 0 ? (
          <Formik
            initialValues={{
              content: '',
              platforms: [],
              scheduledTime: '',
              images: [],
            }}
            validationSchema={SocialPostSchema}
            onSubmit={(values) => {
              const formData = {
                ...values,
                scheduledTime: isScheduled ? values.scheduledTime : null,
              };
              onSubmit(formData);
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Nội dung
                  </label>
                  <div className="mt-1">
                    <Field
                      as="textarea"
                      id="content"
                      name="content"
                      rows={5}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Nhập nội dung bài đăng của bạn..."
                    />
                    <ErrorMessage name="content" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nền tảng
                  </label>
                  <div className="mt-2 grid grid-cols-1 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                    {availablePlatforms.map((platform) => (
                      <div key={platform} className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <Field
                            type="checkbox"
                            id={`platform-${platform}`}
                            name="platforms"
                            value={platform}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`platform-${platform}`} className="font-medium text-gray-700 flex items-center">
                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${platformIcons[platform] || 'bg-gray-100'} mr-2`}>
                              {platform.charAt(0).toUpperCase()}
                            </span>
                            {platformNames[platform] || platform}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ErrorMessage name="platforms" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <div className="flex items-center">
                    <input
                      id="schedule"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={isScheduled}
                      onChange={(e) => setIsScheduled(e.target.checked)}
                    />
                    <label htmlFor="schedule" className="ml-2 block text-sm font-medium text-gray-700">
                      Lên lịch đăng bài
                    </label>
                  </div>
                  {isScheduled && (
                    <div className="mt-2">
                      <Field
                        type="datetime-local"
                        id="scheduledTime"
                        name="scheduledTime"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      <ErrorMessage name="scheduledTime" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hình ảnh (tùy chọn)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Tải lên hình ảnh</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files) {
                                setFieldValue('images', Array.from(e.target.files));
                              }
                            }}
                          />
                        </label>
                        <p className="pl-1">hoặc kéo thả vào đây</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isScheduled ? (
                      <>
                        <CalendarIcon className="-ml-1 mr-2 h-5 w-5" />
                        Lên lịch đăng
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="-ml-1 mr-2 h-5 w-5" />
                        Đăng ngay
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">Bạn cần kết nối ít nhất một tài khoản mạng xã hội để đăng bài.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialPostForm;
