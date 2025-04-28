'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authService } from '../../lib/api/authService';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Đang xác thực địa chỉ email của bạn...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Liên kết xác thực không hợp lệ. Thiếu token xác thực.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email của bạn đã được xác nhận thành công!');
      } catch (error: any) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Không thể xác nhận email của bạn. Liên kết có thể đã hết hạn hoặc không hợp lệ.'
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h1 className="text-center text-4xl font-extrabold text-indigo-800">Flowa</h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-800">Xác nhận email</h2>
        </div>

        <div className={`p-6 rounded-lg ${
          status === 'loading' ? 'bg-blue-50 border border-blue-100' :
          status === 'success' ? 'bg-green-50 border border-green-100' : 
          'bg-red-50 border border-red-100'
        }`}>
          <div className="flex items-center">
            {status === 'loading' && (
              <div className="mr-3">
                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            {status === 'success' && (
              <div className="mr-3 flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="mr-3 flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <p className={`text-sm ${
              status === 'loading' ? 'text-blue-700' :
              status === 'success' ? 'text-green-700' : 
              'text-red-700'
            }`}>
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {status !== 'loading' && (
            <Link 
              href="/auth/login" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đăng nhập
            </Link>
          )}
          {status === 'error' && (
            <Link 
              href="/auth/register" 
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đăng ký
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 