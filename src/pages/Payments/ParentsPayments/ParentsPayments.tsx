import { useEffect, useState } from 'react';
import { useFilterPaymentsQuery } from '../api';
import type { FilterPaymentsRequestDto } from '../types';
import { useGetMe } from '../../../api/authMe/hooks/useGetMe';

const ParentsPayments = () => {
  const { data: parentData } = useGetMe();
  const childrenList = parentData?.data?.children || [];

  const [filterCriteria, setFilterCriteria] = useState<FilterPaymentsRequestDto>({});
  const { data, isLoading, error } = useFilterPaymentsQuery(filterCriteria);

  useEffect(() => {
    if (childrenList.length > 0 && !filterCriteria.student_id) {
      setFilterCriteria((prev) => ({
        ...prev,
        student_id: childrenList[0].id,
      }));
    }
  }, [childrenList, filterCriteria.student_id]);

  const updateFilterParam = (field: keyof FilterPaymentsRequestDto, inputVal: string) => {
    setFilterCriteria((prev) => ({
      ...prev,
      [field]: inputVal === '' ? undefined : field === 'student_id' ? Number(inputVal) : inputVal,
    }));
  };

  const resetAllFilters = () => {
    setFilterCriteria({
      student_id: childrenList.length > 0 ? childrenList[0].id : undefined,
    });
  };

  if (childrenList.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Payment History</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">No children registered under your account.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Fetching payment records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-600">Unable to retrieve payment data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Search Criteria</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Child
            </label>
            <select
              value={filterCriteria.student_id || ''}
              onChange={(e) => updateFilterParam('student_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a child</option>
              {childrenList.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.first_name} {child.last_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period Start
            </label>
            <input
              type="date"
              value={filterCriteria.start_date || ''}
              onChange={(e) => updateFilterParam('start_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period End
            </label>
            <input
              type="date"
              value={filterCriteria.end_date || ''}
              onChange={(e) => updateFilterParam('end_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Reset Criteria
          </button>
        </div>
      </div>

      {data && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Entries: {data.data.count}
            </h2>
            <div className="text-lg font-semibold text-green-600">
              Sum Total: ${data.data.totalAmount}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Child Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.data.payments.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.student ? (
                        <>
                          {record.student.last_name} {record.student.first_name} {record.student.patronym}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${record.amount_paid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.payment_method || 'Not specified'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentsPayments;
