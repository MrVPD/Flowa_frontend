'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { productService } from '../../lib/api/productService';
import { brandService } from '../../lib/api/brandService';
import { isAuthenticated } from '../../lib/utils/auth';
import { PlusIcon, PencilIcon, TrashIcon, TagIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products with filters if any
        const filters = {};
        if (selectedBrand) filters.brandId = selectedBrand;
        if (selectedCategory) filters.category = selectedCategory;
        if (selectedStatus) filters.status = selectedStatus;
        
        const productsData = await productService.getAllProducts(filters);
        setProducts(productsData);
        
        // Fetch brands for filter
        const brandsData = await brandService.getAllBrands();
        setBrands(brandsData);
        
        // Fetch categories for filter
        const categoriesData = await productService.getProductCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, selectedBrand, selectedCategory, selectedStatus]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        setIsLoading(true);
        await productService.deleteProduct(id);
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setIsLoading(true);
      await productService.updateProductStatus(id, newStatus);
      
      // Update the product in the list
      setProducts(products.map(product => 
        product._id === id ? { ...product, status: newStatus } : product
      ));
    } catch (err) {
      console.error('Error updating product status:', err);
      setError('Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (id) => {
    router.push(`/dashboard/products/edit/${id}`);
  };

  const handleAddProduct = () => {
    router.push('/dashboard/products/new');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: currency || 'VND' 
    }).format(amount);
  };

  const getBrandName = (brandId) => {
    const brand = brands.find(b => b._id === brandId);
    return brand ? brand.name : 'N/A';
  };

  return (
    <DashboardLayout>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Quản lý sản phẩm
        </h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={handleAddProduct}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Thêm sản phẩm mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
        <div>
          <label htmlFor="brand-filter" className="block text-sm font-medium text-gray-700">
            Thương hiệu
          </label>
          <select
            id="brand-filter"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
            Danh mục
          </label>
          <select
            id="category-filter"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
            Trạng thái
          </label>
          <select
            id="status-filter"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="mt-8">
          {products.length === 0 ? (
            <div className="text-center py-12 bg-white shadow rounded-lg">
              <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có sản phẩm</h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedBrand || selectedCategory || selectedStatus 
                  ? 'Không tìm thấy sản phẩm nào phù hợp với bộ lọc.' 
                  : 'Bắt đầu bằng cách tạo sản phẩm đầu tiên của bạn.'}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Thêm sản phẩm mới
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <div key={product._id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="relative h-48 w-full bg-gray-200">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <TagIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 truncate" title={product.name}>
                        {product.name}
                      </h3>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(product.status)}`}>
                        {product.status === 'active' ? 'Hoạt động' : 
                         product.status === 'inactive' ? 'Không hoạt động' : 'Bản nháp'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>{formatCurrency(product.price, product.currency)}</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>Thương hiệu: {getBrandName(product.brandId)}</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>Danh mục: {product.category}</span>
                    </div>
                    {product.inventory && (
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>Tồn kho: {product.inventory.quantity} | SKU: {product.inventory.sku}</span>
                      </div>
                    )}
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => handleEditProduct(product._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
