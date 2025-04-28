'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../lib/api/authService';
import { setToken } from '../../lib/utils/auth';
import axios from 'axios';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Tên quá ngắn')
    .max(50, 'Tên quá dài')
    .required('Tên là bắt buộc'),
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');

  // Kiểm tra trạng thái server
  const checkServerStatus = async () => {
    setIsLoading(true);
    try {
      // Chỉ kiểm tra endpoint đơn giản, không cần authentication
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await axios.get(`${API_URL}`, { timeout: 5000 });
      setServerStatus('online');
      setError(null);
    } catch (err) {
      console.error('Server không phản hồi:', err);
      setServerStatus('offline');
      setError('Backend server hiện không khả dụng. Vui lòng thử lại sau hoặc liên hệ quản trị viên.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: { name: string; email: string; password: string; confirmPassword: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Đang gửi dữ liệu đăng ký:', { name: values.name, email: values.email });

      // Kiểm tra server trước khi gửi yêu cầu đăng ký
      if (serverStatus === 'unknown' || serverStatus === 'offline') {
        await checkServerStatus();
        if (serverStatus === 'offline') {
          throw new Error('Server không khả dụng. Vui lòng thử lại sau.');
        }
      }

      const { confirmPassword, ...registerData } = values;
      const response = await authService.register(registerData);

      console.log('Đăng ký thành công:', response);

      setToken(response.token);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Lỗi đăng ký:', err);

      // Xử lý thông báo lỗi chi tiết hơn
      if (err.response) {
        // Lỗi từ server với response
        const responseData = err.response.data;
        if (responseData.message) {
          setError(responseData.message);
        } else if (responseData.error) {
          setError(responseData.error);
        } else if (err.response.status === 409) {
          setError('Email đã được sử dụng. Vui lòng chọn email khác.');
        } else if (err.response.status === 400) {
          setError('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
        } else {
          setError(`Lỗi máy chủ: ${err.response.status}`);
        }
      } else if (err.request) {
        // Yêu cầu đã được gửi nhưng không nhận được response
        setError('Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối và thử lại sau.');
      } else {
        // Lỗi khi thiết lập request
        setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h1 className="text-center text-4xl font-extrabold text-indigo-800">Flowa</h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-800">Đăng ký tài khoản</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{' '}
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              đăng nhập nếu đã có tài khoản
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {serverStatus === 'offline' && (
          <div className="mb-4">
            <button
              onClick={checkServerStatus}
              type="button"
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Đang kiểm tra...' : 'Kiểm tra kết nối tới server'}
            </button>
          </div>
        )}

        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                    placeholder="Nhập họ và tên của bạn"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1 pl-1" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                    placeholder="Nhập email của bạn"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 pl-1" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                    placeholder="Nhập mật khẩu của bạn"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1 pl-1" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                    placeholder="Nhập lại mật khẩu của bạn"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1 pl-1" />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading || serverStatus === 'offline'}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors duration-200 shadow-sm hover:shadow"
                >
                  {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
