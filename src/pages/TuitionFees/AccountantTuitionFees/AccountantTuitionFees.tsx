import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useCreateTuitionFeeMutation, useFilterTuitionFeesQuery } from '../api';
import { createTuitionFeeSchema, type CreateTuitionFeeFormData, filterTuitionFeesSchema, type FilterTuitionFeesFormData } from '../schemas';
import { useSearchStudentsMutation } from '../../Students/api';
import { useFilterGroupsQuery } from '../../Groups/api';

const AccountantTuitionFees = () => {
  const [createTuitionFee, { isLoading: isCreating, isSuccess: createSuccess, isError: createError }] = useCreateTuitionFeeMutation();
  const [searchStudents, { data: studentsData }] = useSearchStudentsMutation();
  const { data: groupsData } = useFilterGroupsQuery({});

  const [filterValues, setFilterValues] = useState<FilterTuitionFeesFormData>({});
  const { data: feesData, isLoading: loadingFees } = useFilterTuitionFeesQuery(filterValues);

  const createForm = useForm<CreateTuitionFeeFormData>({
    resolver: zodResolver(createTuitionFeeSchema),
    defaultValues: {
      student_id: undefined,
      group_id: undefined,
      period_start: '',
      period_end: '',
      amount: undefined,
      due_date: '',
      description: '',
    },
  });

  const filterForm = useForm<FilterTuitionFeesFormData>({
    resolver: zodResolver(filterTuitionFeesSchema),
    defaultValues: {
      student_id: undefined,
      group_id: undefined,
      start_date: '',
      end_date: '',
      onlyOverdue: false,
    },
  });

  useEffect(() => {
    searchStudents({});
  }, [searchStudents]);

  const handleCreate = async (formData: CreateTuitionFeeFormData) => {
    try {
      await createTuitionFee(formData).unwrap();
      createForm.reset();
    } catch (err) {
      console.error('Error creating tuition fee:', err);
    }
  };

  const applyFilters = (formData: FilterTuitionFeesFormData) => {
    setFilterValues(formData);
  };

  const clearFilters = () => {
    filterForm.reset();
    setFilterValues({});
  };

  const formatDate = (dateValue: Date | string) => {
    return new Date(dateValue).toLocaleDateString();
  };

  const isOverdue = (dueDate: Date | string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Tuition Fees Management</h1>
      
      {/* Create Section */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Tuition Fee</h2>

        {createSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
            ✓ Tuition fee has been created successfully
          </div>
        )}

        {createError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            ✗ Unable to create tuition fee. Please check the form and try again.
          </div>
        )}

        <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Student (Optional)
              </label>
              <select
                {...createForm.register('student_id', { 
                  setValueAs: (v) => v === '' ? undefined : Number(v) 
                })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Choose Student --</option>
                {studentsData?.students?.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} (ID: {student.id})
                  </option>
                ))}
              </select>
              {createForm.formState.errors.student_id && (
                <p className="text-sm text-red-600">
                  {createForm.formState.errors.student_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Group (Optional)
              </label>
              <select
                {...createForm.register('group_id', { 
                  setValueAs: (v) => v === '' ? undefined : Number(v) 
                })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Choose Group --</option>
                {groupsData?.groups?.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} (ID: {group.id})
                  </option>
                ))}
              </select>
              {createForm.formState.errors.group_id && (
                <p className="text-sm text-red-600">
                  {createForm.formState.errors.group_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Amount (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                {...createForm.register('amount', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {createForm.formState.errors.amount && (
                <p className="text-sm text-red-600">
                  {createForm.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Period Start <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...createForm.register('period_start')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {createForm.formState.errors.period_start && (
                <p className="text-sm text-red-600">
                  {createForm.formState.errors.period_start.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Period End <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...createForm.register('period_end')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {createForm.formState.errors.period_end && (
                <p className="text-sm text-red-600">
                  {createForm.formState.errors.period_end.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...createForm.register('due_date')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {createForm.formState.errors.due_date && (
                <p className="text-sm text-red-600">
                  {createForm.formState.errors.due_date.message}
                </p>
              )}
            </div>

            <div className="lg:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Description (Optional)
              </label>
              <textarea
                {...createForm.register('description')}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes or description..."
              />
              {createForm.formState.errors.description && (
                <p className="text-sm text-red-600">
                  {createForm.formState.errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isCreating}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Creating...' : 'Create Fee'}
            </button>
            <button
              type="button"
              onClick={() => createForm.reset()}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Search & Filter Fees</h2>

        <form onSubmit={filterForm.handleSubmit(applyFilters)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Filter by Student
              </label>
              <select
                {...filterForm.register('student_id', { 
                  setValueAs: (v) => v === '' ? undefined : Number(v) 
                })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Students</option>
                {studentsData?.students?.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Filter by Group
              </label>
              <select
                {...filterForm.register('group_id', { 
                  setValueAs: (v) => v === '' ? undefined : Number(v) 
                })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Groups</option>
                {groupsData?.groups?.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                From Date
              </label>
              <input
                type="date"
                {...filterForm.register('start_date')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                To Date
              </label>
              <input
                type="date"
                {...filterForm.register('end_date')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...filterForm.register('onlyOverdue')}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-700">Show only overdue fees</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search Fees
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="bg-white shadow-md rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Fee Records</h2>
            {feesData && (
              <div className="flex gap-6 text-sm">
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">{feesData.data.count}</span> records
                </span>
                <span className="text-gray-600">
                  Total: <span className="font-semibold text-gray-900">${feesData.data.totalAmount}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {loadingFees && (
            <p className="text-center text-gray-500 py-8">Loading fee records...</p>
          )}

          {!loadingFees && feesData && feesData.data.tuitionFees.length === 0 && (
            <p className="text-center text-gray-500 py-8">No tuition fees match your search criteria</p>
          )}

          {!loadingFees && feesData && feesData.data.tuitionFees.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Fee ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {feesData.data.tuitionFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-900">
                        #{fee.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {fee.student ? `${fee.student.first_name} ${fee.student.last_name}` : 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {formatDate(fee.period_start)} - {formatDate(fee.period_end)}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                        ${fee.amount}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={isOverdue(fee.due_date) && !fee.payment ? 'text-red-600 font-medium' : 'text-gray-700'}>
                          {formatDate(fee.due_date)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {fee.payment ? (
                          <div className="space-y-1">
                            <span className="inline-block px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              Paid
                            </span>
                            <p className="text-xs text-gray-600">
                              ${fee.payment.amount} on {formatDate(fee.payment.payment_date)}
                            </p>
                          </div>
                        ) : (
                          <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                            isOverdue(fee.due_date) 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {isOverdue(fee.due_date) ? 'Overdue' : 'Pending'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {fee.description || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountantTuitionFees;