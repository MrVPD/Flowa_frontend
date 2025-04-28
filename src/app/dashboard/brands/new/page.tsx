'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  XMarkIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '@/src/components/layouts/DashboardLayout';
import { brandService } from '@/src/lib/api/brandService';

const BrandSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Tên quá ngắn')
    .max(50, 'Tên quá dài')
    .required('Tên thương hiệu là bắt buộc'),
  description: Yup.string()
    .min(10, 'Mô tả quá ngắn')
    .max(500, 'Mô tả quá dài')
    .required('Mô tả là bắt buộc'),
  tone: Yup.string(),
  keywords: Yup.array().of(Yup.string()),
  hashtags: Yup.array().of(Yup.string()),
  contentRules: Yup.string(),
});

export default function NewBrandPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create brand
      const brandResponse = await brandService.createBrand(values);
      
      // Upload logo if selected
      if (logoFile && brandResponse._id) {
        await brandService.uploadLogo(brandResponse._id, logoFile);
      }
      
      router.push('/dashboard/brands');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tạo thương hiệu. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-4 text-gray-400 hover:text-gray-500"
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">Thêm thương hiệu mới</h1>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Formik
          initialValues={{
            name: '',
            description: '',
            tone: '',
            keywords: [''],
            hashtags: [''],
            contentRules: '',
          }}
          validationSchema={BrandSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched }) => (
            <Form className="space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200">
                <div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Thông tin thương hiệu</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Thông tin cơ bản về thương hiệu của bạn.
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Tên thương hiệu
                      </label>
                      <div className="mt-1">
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Mô tả
                      </label>
                      <div className="mt-1">
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          rows={3}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        />
                        <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Mô tả ngắn gọn về thương hiệu của bạn.</p>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                        Logo
                      </label>
                      <div className="mt-1 flex items-center">
                        {logoPreview ? (
                          <div className="relative">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="h-32 w-32 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setLogoPreview(null);
                                setLogoFile(null);
                                if (logoInputRef.current) {
                                  logoInputRef.current.value = '';
                                }
                              }}
                              className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-32 w-32 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center">
                            <div className="space-y-1 text-center">
                              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="logo-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                  <span>Tải lên logo</span>
                                  <input
                                    id="logo-upload"
                                    name="logo-upload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    ref={logoInputRef}
                                    onChange={handleLogoChange}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Thông tin nội dung</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Thông tin giúp tạo nội dung phù hợp với thương hiệu của bạn.
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                        Tone giọng điệu
                      </label>
                      <div className="mt-1">
                        <Field
                          as="select"
                          id="tone"
                          name="tone"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Chọn tone giọng điệu</option>
                          <option value="professional">Chuyên nghiệp</option>
                          <option value="friendly">Thân thiện</option>
                          <option value="casual">Thông thường</option>
                          <option value="humorous">Hài hước</option>
                          <option value="formal">Trang trọng</option>
                          <option value="inspirational">Truyền cảm hứng</option>
                        </Field>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                        Từ khóa
                      </label>
                      <FieldArray name="keywords">
                        {({ remove, push }) => (
                          <div>
                            {values.keywords.map((keyword, index) => (
                              <div key={index} className="flex mt-2">
                                <Field
                                  name={`keywords.${index}`}
                                  type="text"
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  placeholder="Nhập từ khóa"
                                />
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => push('')}
                              className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                              Thêm từ khóa
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700">
                        Hashtags
                      </label>
                      <FieldArray name="hashtags">
                        {({ remove, push }) => (
                          <div>
                            {values.hashtags.map((hashtag, index) => (
                              <div key={index} className="flex mt-2">
                                <Field
                                  name={`hashtags.${index}`}
                                  type="text"
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  placeholder="Nhập hashtag"
                                />
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => push('')}
                              className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                              Thêm hashtag
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="contentRules" className="block text-sm font-medium text-gray-700">
                        Quy tắc nội dung
                      </label>
                      <div className="mt-1">
                        <Field
                          as="textarea"
                          id="contentRules"
                          name="contentRules"
                          rows={3}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Nhập các quy tắc nội dung cho thương hiệu của bạn"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Các quy tắc, hướng dẫn về nội dung mà thương hiệu của bạn nên tuân theo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                  >
                    {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </DashboardLayout>
  );
}
