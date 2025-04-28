'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CalendarIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface Brand {
  id: string;
  name: string;
}

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  connected: boolean;
}

// Mock data
const mockBrands: Brand[] = [
  { id: '1', name: 'Brand 1' },
  { id: '2', name: 'Brand 2' },
  { id: '3', name: 'Brand 3' },
];

const mockAccounts: SocialAccount[] = [
  { id: '1', platform: 'facebook', username: 'brandpage1', connected: true },
  { id: '2', platform: 'instagram', username: 'brand.official', connected: true },
  { id: '3', platform: 'twitter', username: 'brandtwitter', connected: false },
  { id: '4', platform: 'linkedin', username: 'brand-company', connected: true },
];

const PostSchema = Yup.object().shape({
  brandId: Yup.string().required('Vui lòng chọn thương hiệu'),
  accountIds: Yup.array().min(1, 'Vui lòng chọn ít nhất một tài khoản'),
  content: Yup.string().required('Vui lòng nhập nội dung bài đăng').max(2000, 'Nội dung quá dài'),
  scheduleType: Yup.string().required('Vui lòng chọn loại lịch'),
  scheduledDate: Yup.string().when('scheduleType', {
    is: 'scheduled',
    then: Yup.string().required('Vui lòng chọn ngày lên lịch'),
  }),
});

export default function SocialPostForm() {
  const [brands] = useState<Brand[]>(mockBrands);
  const [accounts] = useState<SocialAccount[]>(mockAccounts);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log('Form values:', values);
    console.log('Selected image:', selectedImage);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setSelectedImage(null);
    resetForm();
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  const getConnectedAccounts = () => {
    return accounts.filter(account => account.connected);
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Tạo bài đăng mới</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Tạo và lên lịch bài đăng cho các nền tảng mạng xã hội của bạn.</p>
        </div>
        
        {isSuccess && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Bài đăng đã được tạo thành công!
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-5">
          <Formik
            initialValues={{
              brandId: '',
              accountIds: [],
              content: '',
              scheduleType: 'now',
              scheduledDate: '',
            }}
            validationSchema={PostSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="brandId" className="block text-sm font-medium text-gray-700">
                    Thương hiệu
                  </label>
                  <Field
                    as="select"
                    id="brandId"
                    name="brandId"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="brandId" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tài khoản mạng xã hội</label>
                  <div className="mt-1">
                    {getConnectedAccounts().length === 0 ? (
                      <div className="text-sm text-gray-500">
                        Không có tài khoản nào được kết nối. Vui lòng kết nối tài khoản trước.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {getConnectedAccounts().map((account) => (
                          <div key={account.id} className="relative flex items-start">
                            <div className="flex h-5 items-center">
                              <Field
                                type="checkbox"
                                id={`account-${account.id}`}
                                name="accountIds"
                                value={account.id}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor={`account-${account.id}`} className="font-medium text-gray-700">
                                {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)} ({account.username})
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <ErrorMessage name="accountIds" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Nội dung
                  </label>
                  <div className="mt-1">
                    <Field
                      as="textarea"
                      id="content"
                      name="content"
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Nhập nội dung bài đăng của bạn..."
                    />
                  </div>
                  <ErrorMessage name="content" component="div" className="mt-1 text-sm text-red-600" />
                  <p className="mt-2 text-sm text-gray-500">
                    Nội dung bài đăng của bạn sẽ được đăng lên các nền tảng đã chọn.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hình ảnh (tùy chọn)</label>
                  <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                      {selectedImage ? (
                        <div>
                          <img src={selectedImage} alt="Preview" className="mx-auto h-32 w-auto" />
                          <button
                            type="button"
                            onClick={() => setSelectedImage(null)}
                            className="mt-2 text-sm text-red-600 hover:text-red-500"
                          >
                            Xóa
                          </button>
                        </div>
                      ) : (
                        <>
                          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="image-upload"
                              className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              <span>Tải lên hình ảnh</span>
                              <input
                                id="image-upload"
                                name="image-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1">hoặc kéo và thả</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Lịch đăng</label>
                  <div className="mt-1 space-y-4">
                    <div className="flex items-center">
                      <Field
                        type="radio"
                        id="scheduleNow"
                        name="scheduleType"
                        value="now"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="scheduleNow" className="ml-3 block text-sm font-medium text-gray-700">
                        Đăng ngay
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Field
                        type="radio"
                        id="scheduleDate"
                        name="scheduleType"
                        value="scheduled"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="scheduleDate" className="ml-3 block text-sm font-medium text-gray-700">
                        Lên lịch
                      </label>
                    </div>
                    {values.scheduleType === 'scheduled' && (
                      <div className="ml-7">
                        <div className="relative mt-1 rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <Field
                            type="datetime-local"
                            name="scheduledDate"
                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <ErrorMessage name="scheduledDate" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setFieldValue('content', '');
                        setFieldValue('accountIds', []);
                        setFieldValue('scheduleType', 'now');
                        setFieldValue('scheduledDate', '');
                        setSelectedImage(null);
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || getConnectedAccounts().length === 0}
                      className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang xử lý...
                        </>
                      ) : (
                        'Đăng bài'
                      )}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
