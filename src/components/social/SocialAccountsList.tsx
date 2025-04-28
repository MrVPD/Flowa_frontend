'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  PlusIcon, 
  LinkIcon, 
  CheckCircleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';

interface SocialAccount {
  id: string;
  platform: string;
  name: string;
  isConnected: boolean;
}

interface SocialAccountsListProps {
  accounts: SocialAccount[];
  onConnect: (data: any) => void;
}

const ConnectAccountSchema = Yup.object().shape({
  platform: Yup.string().required('Vui lòng chọn nền tảng'),
  accountName: Yup.string().required('Vui lòng nhập tên tài khoản'),
  accessToken: Yup.string().required('Vui lòng nhập token truy cập'),
});

const SocialAccountsList: React.FC<SocialAccountsListProps> = ({ accounts, onConnect }) => {
  const [showConnectForm, setShowConnectForm] = useState(false);

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

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Tài khoản mạng xã hội</h3>
        <button
          type="button"
          onClick={() => setShowConnectForm(!showConnectForm)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showConnectForm ? (
            <>
              <XCircleIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Hủy
            </>
          ) : (
            <>
              <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Kết nối tài khoản
            </>
          )}
        </button>
      </div>

      {showConnectForm && (
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <Formik
            initialValues={{
              platform: 'facebook',
              accountName: '',
              accessToken: '',
            }}
            validationSchema={ConnectAccountSchema}
            onSubmit={(values, { resetForm }) => {
              onConnect(values);
              resetForm();
              setShowConnectForm(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                      Nền tảng
                    </label>
                    <Field
                      as="select"
                      id="platform"
                      name="platform"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="twitter">Twitter/X</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="threads">Threads</option>
                    </Field>
                    <ErrorMessage name="platform" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
                      Tên tài khoản
                    </label>
                    <Field
                      type="text"
                      id="accountName"
                      name="accountName"
                      placeholder="Tên tài khoản/Trang"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage name="accountName" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700">
                      Token truy cập
                    </label>
                    <Field
                      type="password"
                      id="accessToken"
                      name="accessToken"
                      placeholder="Token API"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage name="accessToken" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <LinkIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Kết nối
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      <div className="border-t border-gray-200">
        {accounts.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {accounts.map((account) => (
              <li key={account.id} className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full ${platformIcons[account.platform] || 'bg-gray-100'} flex items-center justify-center`}>
                    <span className="text-lg font-medium">{account.platform.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{account.name}</div>
                    <div className="text-sm text-gray-500">{platformNames[account.platform] || account.platform}</div>
                  </div>
                </div>
                <div>
                  {account.isConnected ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="-ml-0.5 mr-1 h-4 w-4" />
                      Đã kết nối
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircleIcon className="-ml-0.5 mr-1 h-4 w-4" />
                      Chưa kết nối
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-5 text-center">
            <p className="text-gray-500">Chưa có tài khoản mạng xã hội nào được kết nối.</p>
            {!showConnectForm && (
              <button
                type="button"
                onClick={() => setShowConnectForm(true)}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Kết nối tài khoản
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialAccountsList;
