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

const VerificationSchema = Yup.object().shape({
  verificationCode: Yup.string()
    .length(6, 'Mã xác nhận phải có 6 chữ số')
    .required('Mã xác nhận là bắt buộc')
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'unknown'>('unknown');
  const [registrationStep, setRegistrationStep] = useState<'form' | 'verification'>('form');
  const [registrationEmail, setRegistrationEmail] = useState<string>('');
  const [resendingCode, setResendingCode] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check server status before submitting
  const checkServerStatus = async () => {
    try {
      setIsLoading(true);
      // Just make a simple request to the API
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}`);
      setServerStatus('online');
      return true;
    } catch (error) {
      console.error('Server connection error:', error);
      setServerStatus('offline');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Start cooldown timer for resend button
  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle initial registration step
  const handleInitialSubmit = async (values: { name: string; email: string; password: string; confirmPassword: string }) => {
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
      
      // Begin registration process and send verification code
      await authService.beginRegistration(registerData);
      
      // Save email for verification step
      setRegistrationEmail(values.email);
      
      // Move to verification step
      setRegistrationStep('verification');
      
      // Start cooldown for resend button
      startResendCooldown();
      
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

  // Handle verification code submission
  const handleVerification = async (values: { verificationCode: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Complete registration with verification code
      const response = await authService.completeRegistration({
        email: registrationEmail,
        code: values.verificationCode
      });

      // Set token and redirect
      setToken(response.token);
      router.push('/dashboard');
      
    } catch (err: any) {
      console.error('Lỗi xác thực:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Mã xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    try {
      setResendingCode(true);
      setError(null);

      // Re-send email verification
      await authService.beginRegistration({
        name: '', // The backend already has this information
        email: registrationEmail,
        password: '', // The backend already has this information
      });

      startResendCooldown();
    } catch (err: any) {
      console.error('Lỗi khi gửi lại mã:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Không thể gửi lại mã xác nhận. Vui lòng thử lại sau.');
      }
    } finally {
      setResendingCode(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h1 className="text-center text-4xl font-extrabold text-indigo-800">Flowa</h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-800">
            {registrationStep === 'form' ? 'Đăng ký tài khoản' : 'Xác nhận email'}
          </h2>
          {registrationStep === 'form' && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Hoặc{' '}
              <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                đăng nhập nếu đã có tài khoản
              </Link>
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded">
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

        {registrationStep === 'form' ? (
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleInitialSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                      placeholder="Nhập họ và tên"
                    />
                    <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                      placeholder="Nhập địa chỉ email"
                    />
                    <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                      placeholder="Nhập mật khẩu"
                    />
                    <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Xác nhận mật khẩu
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                      placeholder="Nhập lại mật khẩu"
                    />
                    <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50"
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : 'Đăng ký'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{
              verificationCode: '',
            }}
            validationSchema={VerificationSchema}
            onSubmit={handleVerification}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Chúng tôi đã gửi mã xác nhận đến email {registrationEmail}. Vui lòng kiểm tra và nhập mã xác nhận để hoàn tất đăng ký.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                        Mã xác nhận
                      </label>
                      <Field
                        id="verificationCode"
                        name="verificationCode"
                        type="text"
                        required
                        className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm tracking-widest text-center letter-spacing-2"
                        placeholder="Nhập mã 6 chữ số"
                        maxLength="6"
                      />
                      <ErrorMessage name="verificationCode" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50"
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : 'Xác nhận'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendingCode || resendCooldown > 0}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50"
                  >
                    {resendCooldown > 0
                      ? `Gửi lại mã sau ${resendCooldown}s`
                      : resendingCode
                      ? 'Đang gửi...'
                      : 'Gửi lại mã'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}
