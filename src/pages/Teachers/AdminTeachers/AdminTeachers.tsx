import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetTeachersSortedQuery } from '../api';
import { useRegisterMutation } from '../../Registration/api';
import { registrationSchema, type RegistrationFormData } from '../../Registration/schema';
import type { GetTeachersSortedRequestDto } from '../types/types';

const AdminTeachers: React.FC = () => {
  const [filters, setFilters] = useState<GetTeachersSortedRequestDto>({
    sortBy: 'hireDate',
    order: 'ASC',
    first_name: '',
    last_name: '',
    patronym: '',
  });

  const { data: teachers, isLoading, error } = useGetTeachersSortedQuery(filters);
  const [register, { isLoading: isCreating }] = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: 'teacher',
    },
  });

  const handleFilterChange = (field: keyof GetTeachersSortedRequestDto, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleSortChange = (sortBy: 'hireDate' | 'courseCount') => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
    }));
  };

  const handleOrderChange = (order: 'ASC' | 'DESC') => {
    setFilters((prev) => ({
      ...prev,
      order,
    }));
  };

  const onCreateTeacher = async (data: RegistrationFormData) => {
    try {
      await register({ ...data, role: 'teacher' }).unwrap();
      reset();
    } catch (error) {
      console.error('Failed to create teacher:', error);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Admin Teachers</h1>

      {/* Create Teacher Form */}
      <div className="mb-8 p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Create New Teacher</h2>
        
        <form onSubmit={handleSubmit(onCreateTeacher)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              {...registerField('email')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="teacher@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              {...registerField('password')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <input
              type="text"
              {...registerField('first_name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="John"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <input
              type="text"
              {...registerField('last_name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Doe"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
            )}
          </div>

          {/* Patronym */}
          <div>
            <label className="block text-sm font-medium mb-2">Patronym</label>
            <input
              type="text"
              {...registerField('patronym')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Patronym"
            />
            {errors.patronym && (
              <p className="text-red-500 text-sm mt-1">{errors.patronym.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
            <input
              type="tel"
              {...registerField('phone')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+1234567890"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium mb-2">Specialization (Optional)</label>
            <input
              type="text"
              {...registerField('specialization')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Mathematics"
            />
            {errors.specialization && (
              <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>
            )}
          </div>

          {/* Hire Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Hire Date (Optional)</label>
            <input
              type="date"
              {...registerField('hire_date')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.hire_date && (
              <p className="text-red-500 text-sm mt-1">{errors.hire_date.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isCreating}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Creating...' : 'Create Teacher'}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-8 p-5 bg-gray-100 rounded-lg">
        <div className="flex flex-col gap-1">
          <label htmlFor="first_name" className="font-medium text-sm">First Name:</label>
          <input
            id="first_name"
            type="text"
            value={filters.first_name || ''}
            onChange={(e) => handleFilterChange('first_name', e.target.value)}
            placeholder="Filter by first name"
            className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[150px] focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="last_name" className="font-medium text-sm">Last Name:</label>
          <input
            id="last_name"
            type="text"
            value={filters.last_name || ''}
            onChange={(e) => handleFilterChange('last_name', e.target.value)}
            placeholder="Filter by last name"
            className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[150px] focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="patronym" className="font-medium text-sm">Patronym:</label>
          <input
            id="patronym"
            type="text"
            value={filters.patronym || ''}
            onChange={(e) => handleFilterChange('patronym', e.target.value)}
            placeholder="Filter by patronym"
            className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[150px] focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="sortBy" className="font-medium text-sm">Sort By:</label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as 'hireDate' | 'courseCount')}
            className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[150px] focus:outline-none focus:border-green-500"
          >
            <option value="hireDate">Hire Date</option>
            <option value="courseCount">Course Count</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="order" className="font-medium text-sm">Order:</label>
          <select
            id="order"
            value={filters.order}
            onChange={(e) => handleOrderChange(e.target.value as 'ASC' | 'DESC')}
            className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[150px] focus:outline-none focus:border-green-500"
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading && <div className="p-5 text-center text-base text-gray-600">Loading teachers...</div>}
        
        {error && <div className="p-5 text-center text-base text-red-600">Error loading teachers</div>}
        
        {teachers && teachers.length > 0 && (
          <table className="w-full border-collapse bg-white shadow-sm">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left border-b border-gray-300 bg-gray-50 font-semibold text-gray-800">ID</th>
                <th className="px-3 py-3 text-left border-b border-gray-300 bg-gray-50 font-semibold text-gray-800">First Name</th>
                <th className="px-3 py-3 text-left border-b border-gray-300 bg-gray-50 font-semibold text-gray-800">Last Name</th>
                <th className="px-3 py-3 text-left border-b border-gray-300 bg-gray-50 font-semibold text-gray-800">Patronym</th>
                <th className="px-3 py-3 text-left border-b border-gray-300 bg-gray-50 font-semibold text-gray-800">Hire Date</th>
                <th className="px-3 py-3 text-left border-b border-gray-300 bg-gray-50 font-semibold text-gray-800">Course Count</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 border-b border-gray-300">{teacher.id}</td>
                  <td className="px-3 py-3 border-b border-gray-300">{teacher.first_name}</td>
                  <td className="px-3 py-3 border-b border-gray-300">{teacher.last_name}</td>
                  <td className="px-3 py-3 border-b border-gray-300">{teacher.patronym || '-'}</td>
                  <td className="px-3 py-3 border-b border-gray-300">{new Date(teacher.hire_date).toLocaleDateString()}</td>
                  <td className="px-3 py-3 border-b border-gray-300">{teacher.courseCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {teachers && teachers.length === 0 && (
          <div className="p-5 text-center text-base text-gray-400">No teachers found</div>
        )}
      </div>
    </div>
  );
};

export default AdminTeachers;
