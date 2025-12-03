import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateGroupMutation, useFilterGroupsQuery } from '../api';
import { createGroupSchema, type CreateGroupFormData } from '../schemas';
import { useGetTeachersSortedQuery } from '../../Teachers/api';
import { formatFullName } from '../../../helpers/formatFullName';

const AdminGroups: FC = () => {
  const [filterParams, setFilterParams] = useState<{
    name?: string;
    start_year?: number;
    curator_id?: number;
  }>({});

  const [createGroup, { isLoading, isSuccess, isError, error }] = useCreateGroupMutation();
  const { data: teachersData, isLoading: isLoadingTeachers } = useGetTeachersSortedQuery({
    sortBy: 'hireDate',
    order: 'ASC',
  });
  const { data: groupsData, isLoading: isLoadingGroups } = useFilterGroupsQuery(filterParams);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
  });

  const onSubmit = async (data: CreateGroupFormData) => {
    try {
      await createGroup(data).unwrap();
      reset();
    } catch (err) {
      console.error('Failed to create group:', err);
    }
  };

  const handleFilterChange = (field: keyof typeof filterParams, value: string) => {
    setFilterParams(prev => ({
      ...prev,
      [field]: value ? (field === 'start_year' ? Number(value) : value) : undefined,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Groups</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mb-6">
        <h2 className="text-2xl font-semibold mb-6">Create New Group</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Group Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter group name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="start_year" className="block text-sm font-medium text-gray-700 mb-1">
              Start Year
            </label>
            <input
              id="start_year"
              type="number"
              {...register('start_year', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter start year (optional)"
              min="2000"
              max="2100"
            />
            {errors.start_year && (
              <p className="mt-1 text-sm text-red-600">{errors.start_year.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="curator_id" className="block text-sm font-medium text-gray-700 mb-1">
              Curator
            </label>
            <select
              id="curator_id"
              {...register('curator_id', { 
                setValueAs: (value) => value === '' ? undefined : Number(value) 
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isLoadingTeachers}
            >
              <option value="">Select a curator (optional)</option>
              {teachersData?.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {formatFullName(teacher.first_name, teacher.last_name, teacher.patronym)}
                </option>
              ))}
            </select>
            {errors.curator_id && (
              <p className="mt-1 text-sm text-red-600">{errors.curator_id.message}</p>
            )}
          </div>

          {isSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              Group created successfully!
            </div>
          )}

          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              Error creating group: {error && 'data' in error ? JSON.stringify(error.data) : 'Unknown error'}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Filter Groups</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="filter_name" className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              id="filter_name"
              type="text"
              value={filterParams.name || ''}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filter by name"
            />
          </div>

          <div>
            <label htmlFor="filter_year" className="block text-sm font-medium text-gray-700 mb-1">
              Start Year
            </label>
            <input
              id="filter_year"
              type="number"
              min="2000"
              max="2100"
              value={filterParams.start_year || ''}
              onChange={(e) => handleFilterChange('start_year', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filter by year"
            />
          </div>

          <div>
            <label htmlFor="filter_curator" className="block text-sm font-medium text-gray-700 mb-1">
              Curator
            </label>
            <select
              id="filter_curator"
              value={filterParams.curator_id || ''}
              onChange={(e) => handleFilterChange('curator_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoadingTeachers}
            >
              <option value="">All Curators</option>
              {teachersData?.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {formatFullName(teacher.first_name, teacher.last_name, teacher.patronym)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoadingGroups && <div className="text-center py-4">Loading groups...</div>}
        
        {groupsData && (
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Groups ({groupsData.groups.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Start Year</th>
                    <th className="p-3 text-left">Curator</th>
                    <th className="p-3 text-left">Students</th>
                  </tr>
                </thead>
                <tbody>
                  {groupsData.groups.map((group) => (
                    <tr key={group.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">{group.id}</td>
                      <td className="p-3 font-medium">{group.name}</td>
                      <td className="p-3">{group.start_year}</td>
                      <td className="p-3">{group.curator_name || '-'}</td>
                      <td className="p-3">{group.student_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGroups;
