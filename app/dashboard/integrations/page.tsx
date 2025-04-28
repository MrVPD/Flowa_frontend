'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { integrationService } from '../../lib/api/integrationService';
import { isAuthenticated } from '../../lib/utils/auth';
import { PlusIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function IntegrationsPage() {
  const router = useRouter();
  const [integrations, setIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [supportedTypes, setSupportedTypes] = useState([]);
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: '',
    config: {}
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const fetchIntegrations = async () => {
      try {
        setIsLoading(true);
        const data = await integrationService.getAllIntegrations();
        setIntegrations(data);
        
        const typesData = await integrationService.getSupportedIntegrationTypes();
        setSupportedTypes(typesData);
      } catch (err) {
        console.error('Error fetching integrations:', err);
        setError('Không thể tải danh sách tích hợp. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntegrations();
  }, [router]);

  const handleAddIntegration = async () => {
    try {
      setIsLoading(true);
      const data = await integrationService.createIntegration(newIntegration);
      setIntegrations([...integrations, data]);
      setShowAddModal(false);
      setNewIntegration({ name: '', type: '', config: {} });
    } catch (err) {
      console.error('Error adding integration:', err);
      setError('Không thể thêm tích hợp. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIntegration = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tích hợp này không?')) {
      try {
        setIsLoading(true);
        await integrationService.deleteIntegration(id);
        setIntegrations(integrations.filter(integration => integration._id !== id));
      } catch (err) {
        console.error('Error deleting integration:', err);
        setError('Không thể xóa tích hợp. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setIsLoading(true);
      if (currentStatus === 'active') {
        await integrationService.deactivateIntegration(id);
      } else {
        await integrationService.activateIntegration(id);
      }
      
      // Refresh the list
      const data = await integrationService.getAllIntegrations();
      setIntegrations(data);
    } catch (err) {
      console.error('Error updating integration status:', err);
      setError('Không thể cập nhật trạng thái tích hợp. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncIntegration = async (id) => {
    try {
      setIsLoading(true);
      await integrationService.syncIntegrationData(id);
      alert('Đồng bộ dữ liệu thành công!');
    } catch (err) {
      console.error('Error syncing integration data:', err);
      setError('Không thể đồng bộ dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = (key, value) => {
    setNewIntegration({
      ...newIntegration,
      config: {
        ...newIntegration.config,
        [key]: value
      }
    });
  };

  const renderConfigFields = () => {
    const selectedType = supportedTypes.find(type => type.value === newIntegration.type);
    
    if (!selectedType || !selectedType.configFields) {
      return null;
    }

    return selectedType.configFields.map(field => (
      <div key={field.key} className="mb-4">
        <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
          {field.label}
        </label>
        <input
          type={field.type === 'password' ? 'password' : 'text'}
          id={field.key}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={field.placeholder}
          value={newIntegration.config[field.key] || ''}
          onChange={(e) => handleConfigChange(field.key, e.target.value)}
          required={field.required}
        />
        {field.description && (
          <p className="mt-1 text-xs text-gray-500">{field.description}</p>
        )}
      </div>
    ));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Quản lý tích hợp
        </h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Thêm tích hợp mới
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
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
        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tên tích hợp
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Loại
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Trạng thái
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ngày tạo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {integrations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          Chưa có tích hợp nào. Hãy thêm tích hợp đầu tiên của bạn!
                        </td>
                      </tr>
                    ) : (
                      integrations.map((integration) => (
                        <tr key={integration._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{integration.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{integration.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(integration.status)}`}>
                              {integration.status === 'active' ? 'Hoạt động' : 
                               integration.status === 'inactive' ? 'Không hoạt động' : 'Đang xử lý'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(integration.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleToggleStatus(integration._id, integration.status)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              {integration.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            </button>
                            <button
                              onClick={() => handleSyncIntegration(integration._id)}
                              className="text-green-600 hover:text-green-900 mr-4"
                            >
                              <ArrowPathIcon className="h-5 w-5 inline" /> Đồng bộ
                            </button>
                            <button
                              onClick={() => handleDeleteIntegration(integration._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Thêm tích hợp mới
                    </h3>
                    <div className="mt-2">
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Tên tích hợp
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Nhập tên tích hợp"
                          value={newIntegration.name}
                          onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                          Loại tích hợp
                        </label>
                        <select
                          id="type"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={newIntegration.type}
                          onChange={(e) => setNewIntegration({...newIntegration, type: e.target.value, config: {}})}
                          required
                        >
                          <option value="">Chọn loại tích hợp</option>
                          {supportedTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {newIntegration.type && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Cấu hình tích hợp</h4>
                          {renderConfigFields()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddIntegration}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Thêm tích hợp
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
