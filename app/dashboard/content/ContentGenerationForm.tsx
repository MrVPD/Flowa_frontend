'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface Brand {
  _id: string;
  name: string;
}

interface Theme {
  _id: string;
  name: string;
  category: string;
}

interface ContentGenerationFormProps {
  brands: Brand[];
  themes: Theme[];
  onBrandChange: (brandId: string) => void;
  onSubmit: (values: any) => void;
  isGenerating: boolean;
}

const platforms = [
  { id: 'facebook', name: 'Facebook' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'twitter', name: 'Twitter' },
  { id: 'linkedin', name: 'LinkedIn' },
];

const contentTypes = [
  { id: 'post', name: 'Bài đăng' },
  { id: 'caption', name: 'Caption' },
  { id: 'article', name: 'Bài viết dài' },
];

const ContentGenerationSchema = Yup.object().shape({
  brandId: Yup.string().required('Vui lòng chọn thương hiệu'),
  themeId: Yup.string().required('Vui lòng chọn chủ đề'),
  platform: Yup.string().required('Vui lòng chọn nền tảng'),
  contentType: Yup.string().required('Vui lòng chọn loại nội dung'),
  tone: Yup.string().required('Vui lòng chọn giọng điệu'),
  keywords: Yup.string(),
});

export default function ContentGenerationForm({
  brands,
  themes,
  onBrandChange,
  onSubmit,
  isGenerating,
}: ContentGenerationFormProps) {
  const [selectedBrand, setSelectedBrand] = useState('');

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    onBrandChange(brandId);
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Tạo nội dung mới</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Điền thông tin bên dưới để tạo nội dung tự động</p>
        </div>
        <div className="mt-5">
          <Formik
            initialValues={{
              brandId: '',
              themeId: '',
              platform: '',
              contentType: 'post',
              tone: 'professional',
              keywords: '',
            }}
            validationSchema={ContentGenerationSchema}
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="brandId" className="block text-sm font-medium text-gray-700">
                    Thương hiệu
                  </label>
                  <Field
                    as="select"
                    id="brandId"
                    name="brandId"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      handleBrandChange(e);
                      setFieldValue('brandId', e.target.value);
                      setFieldValue('themeId', ''); // Reset theme when brand changes
                    }}
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="brandId" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="themeId" className="block text-sm font-medium text-gray-700">
                    Chủ đề
                  </label>
                  <Field
                    as="select"
                    id="themeId"
                    name="themeId"
                    disabled={!selectedBrand}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Chọn chủ đề</option>
                    {themes.map((theme) => (
                      <option key={theme._id} value={theme._id}>
                        {theme.name} ({theme.category})
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="themeId" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                    Nền tảng
                  </label>
                  <Field
                    as="select"
                    id="platform"
                    name="platform"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Chọn nền tảng</option>
                    {platforms.map((platform) => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="platform" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="contentType" className="block text-sm font-medium text-gray-700">
                    Loại nội dung
                  </label>
                  <Field
                    as="select"
                    id="contentType"
                    name="contentType"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {contentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="contentType" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                    Giọng điệu
                  </label>
                  <Field
                    as="select"
                    id="tone"
                    name="tone"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="professional">Chuyên nghiệp</option>
                    <option value="casual">Thân thiện</option>
                    <option value="humorous">Hài hước</option>
                    <option value="formal">Trang trọng</option>
                    <option value="inspirational">Truyền cảm hứng</option>
                  </Field>
                  <ErrorMessage name="tone" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                    Từ khóa (tùy chọn)
                  </label>
                  <Field
                    type="text"
                    id="keywords"
                    name="keywords"
                    placeholder="Nhập từ khóa, phân cách bằng dấu phẩy"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage name="keywords" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || isGenerating}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang tạo...
                      </>
                    ) : (
                      'Tạo nội dung'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
