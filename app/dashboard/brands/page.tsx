'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { isAuthenticated } from '../../lib/utils/auth';
import { brandService } from '../../lib/api/brandService';

interface Brand {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  createdAt: string;
}

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const fetchBrands = async () => {
      try {
        setIsLoading(true);
        const response = await brandService.getBrands();
        setBrands(response);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, [router]);

  const handleDeleteBrand = async (brandId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      try {
        setIsDeleting((prev) => ({ ...prev, [brandId]: true }));
        await brandService.deleteBrand(brandId);
        setBrands((prev) => prev.filter((brand) => brand._id !== brandId));
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Có lỗi xảy ra khi xóa thương hiệu');
      } finally {
        setIsDeleting((prev) => ({ ...prev, [brandId]: false }));
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">Thương hiệu</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/brands/new')}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Thêm thương hiệu
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : brands.length === 0 ? (
        <div className="mt-6 text-center">
          <div className="rounded-md bg-gray-50 px-6 py-10">
            <h3 className="text-sm font-medium text-gray-900">Chưa có thương hiệu nào</h3>
            <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo thương hiệu đầu tiên của bạn.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => router.push('/dashboard/brands/new')}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Thêm thương hiệu
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Thương hiệu
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Mô tả
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Ngày tạo
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Hành động</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {brands.map((brand) => (
                <tr key={brand._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {brand.logo ? (
                          <img className="h-10 w-10 rounded-full" src={brand.logo} alt={brand.name} />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-bold">{brand.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{brand.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate">{brand.description}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {brand.createdAt ? formatDate(brand.createdAt) : 'N/A'}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => router.push(`/dashboard/brands/${brand._id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span className="sr-only">Edit {brand.name}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(brand._id)}
                        disabled={isDeleting[brand._id]}
                        className="text-red-600 hover:text-red-900"
                      >
                        {isDeleting[brand._id] ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-red-600"></div>
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                        <span className="sr-only">Delete {brand.name}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
