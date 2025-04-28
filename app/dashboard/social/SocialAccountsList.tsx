'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { PlusIcon } from '@heroicons/react/24/outline';

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  connected: boolean;
  lastSync?: string;
}

const mockAccounts: SocialAccount[] = [
  { id: '1', platform: 'facebook', username: 'brandpage1', connected: true, lastSync: '2025-04-22T10:30:00Z' },
  { id: '2', platform: 'instagram', username: 'brand.official', connected: true, lastSync: '2025-04-23T14:15:00Z' },
  { id: '3', platform: 'twitter', username: 'brandtwitter', connected: false },
  { id: '4', platform: 'linkedin', username: 'brand-company', connected: true, lastSync: '2025-04-20T09:45:00Z' },
];

const AddAccountSchema = Yup.object().shape({
  platform: Yup.string().required('Vui lòng chọn nền tảng'),
  username: Yup.string().required('Vui lòng nhập tên người dùng'),
});

export default function SocialAccountsList() {
  const [accounts, setAccounts] = useState<SocialAccount[]>(mockAccounts);
  const [isAdding, setIsAdding] = useState(false);
  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({});

  const handleConnect = async (accountId: string) => {
    setIsConnecting((prev) => ({ ...prev, [accountId]: true }));
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? { ...account, connected: true, lastSync: new Date().toISOString() }
          : account
      )
    );
    
    setIsConnecting((prev) => ({ ...prev, [accountId]: false }));
  };

  const handleDisconnect = async (accountId: string) => {
    setIsConnecting((prev) => ({ ...prev, [accountId]: true }));
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? { ...account, connected: false, lastSync: undefined }
          : account
      )
    );
    
    setIsConnecting((prev) => ({ ...prev, [accountId]: false }));
  };

  const handleAddAccount = async (values: { platform: string; username: string }, { resetForm }: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const newAccount: SocialAccount = {
      id: Date.now().toString(),
      platform: values.platform,
      username: values.username,
      connected: false,
    };
    
    setAccounts((prev) => [...prev, newAccount]);
    resetForm();
    setIsAdding(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return (
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold">F</span>
          </div>
        );
      case 'instagram':
        return (
          <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
            <span className="text-pink-600 font-bold">I</span>
          </div>
        );
      case 'twitter':
        return (
          <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
            <span className="text-sky-600 font-bold">T</span>
          </div>
        );
      case 'linkedin':
        return (
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-800 font-bold">L</span>
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-600 font-bold">?</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Tài khoản mạng xã hội</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Kết nối tài khoản mạng xã hội của bạn để lên lịch và đăng bài tự động.</p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Thêm tài khoản
            </button>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Thêm tài khoản mới</h3>
            <Formik
              initialValues={{ platform: '', username: '' }}
              validationSchema={AddAccountSchema}
              onSubmit={handleAddAccount}
            >
              {({ isSubmitting }) => (
                <Form className="mt-5 sm:flex sm:items-center">
                  <div className="w-full sm:max-w-xs">
                    <label htmlFor="platform" className="sr-only">
                      Nền tảng
                    </label>
                    <Field
                      as="select"
                      name="platform"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Chọn nền tảng</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter</option>
                      <option value="linkedin">LinkedIn</option>
                    </Field>
                    <ErrorMessage name="platform" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  <div className="mt-3 w-full sm:mt-0 sm:ml-3 sm:max-w-xs">
                    <label htmlFor="username" className="sr-only">
                      Tên người dùng
                    </label>
                    <Field
                      type="text"
                      name="username"
                      placeholder="Tên người dùng"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage name="username" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang thêm...
                        </>
                      ) : (
                        'Thêm'
                      )}
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                      Hủy
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Nền tảng
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Tên người dùng
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Trạng thái
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Đồng bộ lần cuối
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Hành động</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {accounts.map((account) => (
              <tr key={account.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="flex items-center">
                    {getPlatformIcon(account.platform)}
                    <div className="ml-4">
                      <div className="font-medium text-gray-900 capitalize">{account.platform}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{account.username}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      account.connected
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {account.connected ? 'Đã kết nối' : 'Chưa kết nối'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {account.lastSync ? formatDate(account.lastSync) : 'Chưa đồng bộ'}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  {account.connected ? (
                    <button
                      type="button"
                      onClick={() => handleDisconnect(account.id)}
                      disabled={isConnecting[account.id]}
                      className="text-red-600 hover:text-red-900 disabled:opacity-75"
                    >
                      {isConnecting[account.id] ? 'Đang xử lý...' : 'Ngắt kết nối'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleConnect(account.id)}
                      disabled={isConnecting[account.id]}
                      className="text-indigo-600 hover:text-indigo-900 disabled:opacity-75"
                    >
                      {isConnecting[account.id] ? 'Đang xử lý...' : 'Kết nối'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
