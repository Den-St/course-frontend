import { useEffect, useState } from 'react';
import { useFilterPaymentsQuery } from '../api';
import type { FilterPaymentsRequestDto } from '../types';
import { useSearchStudentsMutation } from '../../Students/api';
import { useFilterGroupsQuery } from '../../Groups/api';

const AccountantPayments = () => {
  const [queryParams, setQueryParams] = useState<FilterPaymentsRequestDto>({});
  const { data, isLoading, error } = useFilterPaymentsQuery(queryParams);
  const [searchStudents, { data: studentsData }] = useSearchStudentsMutation();
  const { data: groupsData } = useFilterGroupsQuery({});

  useEffect(() => {
    searchStudents({});
  }, [searchStudents]);

  const modifyQueryParam = (field: keyof FilterPaymentsRequestDto, inputVal: string) => {
    setQueryParams((prev) => ({
      ...prev,
      [field]: inputVal === '' ? undefined : field === 'student_id' || field === 'group_id' ? Number(inputVal) : inputVal,
    }));
  };

  const clearAllFilters = () => {
    setQueryParams({});
  };

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
      <h1 className="text-2xl font-bold mb-6">Payment Records</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Search Criteria</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Student
            </label>
            <select
              value={queryParams.student_id || ''}
              onChange={(e) => modifyQueryParam('student_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Students</option>
              {studentsData?.students?.map((student) => (
                <option key={student.id} value={student.student_id}>
                  {student.first_name} {student.last_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Group
            </label>
            <select
              value={queryParams.group_id || ''}
              onChange={(e) => modifyQueryParam('group_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Groups</option>
              {groupsData?.groups?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
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
              value={queryParams.start_date || ''}
              onChange={(e) => modifyQueryParam('start_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period End
            </label>
            <input
              type="date"
              value={queryParams.end_date || ''}
              onChange={(e) => modifyQueryParam('end_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={clearAllFilters}
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
                    Student Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Sum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Type
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

export default AccountantPayments;