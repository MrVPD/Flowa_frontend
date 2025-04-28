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

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'twitter', name: 'Twitter/X' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'threads', name: 'Threads' },
];

const ContentGenerationSchema = Yup.object().shape({
  brandId: Yup.string().required('Vui lòng chọn thương hiệu'),
  themeId: Yup.string().required('Vui lòng chọn chủ đề'),
  platform: Yup.string().required('Vui lòng chọn nền tảng'),
  count: Yup.number().min(1, 'Tối thiểu 1 nội dung').max(5, 'Tối đa 5 nội dung').required('Vui lòng nhập số lượng'),
});

const ContentGenerationForm: React.FC<ContentGenerationFormProps> = ({
  brands,
  themes,
  onBrandChange,
  onSubmit,
  isGenerating,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState('');

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Tạo nội dung tự động</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Điền thông tin để tạo nội dung phù hợp
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <Formik
          initialValues={{
            brandId: brands.length > 0 ? brands[0]._id : '',
            themeId: themes.length > 0 ? themes[0]._id : '',
            platform: 'facebook',
            count: 1,
            aiModel: 'openai',
          }}
          validationSchema={ContentGenerationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="brandId" className="block text-sm font-medium text-gray-700">
                  Thương hiệu
                </label>
                <Field
                  as="select"
                  id="brandId"
                  name="brandId"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const brandId = e.target.value;
                    setFieldValue('brandId', brandId);
                    onBrandChange(brandId);
                  }}
                >
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="brandId" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label htmlFor="themeId" className="block text-sm font-medium text-gray-700">
                  Chủ đề
                </label>
                <Field
                  as="select"
                  id="themeId"
                  name="themeId"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {themes.length > 0 ? (
                    themes.map((theme) => (
                      <option key={theme._id} value={theme._id}>
                        {theme.name} ({theme.category})
                      </option>
                    ))
                  ) : (
                    <option value="">Không có chủ đề</option>
                  )}
                </Field>
                <ErrorMessage name="themeId" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                  Nền tảng mạng xã hội
                </label>
                <Field
                  as="select"
                  id="platform"
                  name="platform"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue('platform', e.target.value);
                    setSelectedPlatform(e.target.value);
                  }}
                >
                  {socialPlatforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="platform" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label htmlFor="count" className="block text-sm font-medium text-gray-700">
                  Số lượng nội dung
                </label>
                <Field
                  type="number"
                  id="count"
                  name="count"
                  min="1"
                  max="5"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
                <ErrorMessage name="count" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label htmlFor="aiModel" className="block text-sm font-medium text-gray-700">
                  Mô hình AI
                </label>
                <Field
                  as="select"
                  id="aiModel"
                  name="aiModel"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="openai">OpenAI GPT-4</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="claude">Anthropic Claude</option>
                </Field>
              </div>

              <div className="pt-5">
                <button
                  type="submit"
                  disabled={isSubmitting || isGenerating}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                  {isGenerating ? 'Đang tạo nội dung...' : 'Tạo nội dung'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ContentGenerationForm;
