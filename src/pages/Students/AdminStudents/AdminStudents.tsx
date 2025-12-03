import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchStudentsMutation } from '../api';
import { useFilterGroupsQuery } from '../../Groups/api';
import { useRegisterMutation } from '../../Registration/api';
import { registrationSchema, type RegistrationFormData } from '../../Registration/schema';
import type { SearchStudentRequestDto } from '../types/types';

const AdminStudents = () => {
  const [searchParams, setSearchParams] = useState<SearchStudentRequestDto>({
    first_name: '',
    last_name: '',
    patronym: '',
  });

  const [searchStudents, { data: students, isLoading, error }] = useSearchStudentsMutation();
  const { data: groupsData } = useFilterGroupsQuery({});
  const [register, { isLoading: isCreating }] = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: 'student',
    },
  });

  useEffect(() => {
    searchStudents(searchParams);
  }, []);

  const handleSearch = () => {
    searchStudents(searchParams);
  };

  const handleInputChange = (field: keyof SearchStudentRequestDto, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleGroupChange = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      group_id: value ? Number(value) : undefined,
    }));
  };

  const onCreateStudent = async (data: RegistrationFormData) => {
    try {
      await register({ ...data, role: 'student' }).unwrap();
      reset();
      searchStudents(searchParams); // Refresh the list
    } catch (error) {
      console.error('Failed to create student:', error);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-6">Admin - Students Management</h1>
      
      {/* Create Student Form */}
      <div className="mb-8 p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Create New Student</h2>
        
        <form onSubmit={handleSubmit(onCreateStudent)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              {...registerField('email')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="student@email.com"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1234567890"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Birth Date</label>
            <input
              type="date"
              {...registerField('birth_date')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.birth_date && (
              <p className="text-red-500 text-sm mt-1">{errors.birth_date.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isCreating}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Creating...' : 'Create Student'}
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

      <div className="mb-5">
        <div className="flex gap-2.5 mb-2.5">
          <input
            type="text"
            placeholder="First Name"
            value={searchParams.first_name || ''}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            className="p-2 flex-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={searchParams.last_name || ''}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            className="p-2 flex-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="patronym"
            value={searchParams.patronym || ''}
            onChange={(e) => handleInputChange('patronym', e.target.value)}
            className="p-2 flex-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={searchParams.group_id || ''}
            onChange={(e) => handleGroupChange(e.target.value)}
            className="p-2 flex-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Groups</option>
            {groupsData?.groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
        <button 
          onClick={handleSearch} 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium shadow-sm"
        >
          Search
        </button>
      </div>

      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading students</div>}
      
      {students && (
        <div>
          <h2>Students ({students.students.length})</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="p-2.5 text-left">ID</th>
                <th className="p-2.5 text-left">First Name</th>
                <th className="p-2.5 text-left">Last Name</th>
                <th className="p-2.5 text-left">patronym</th>
                <th className="p-2.5 text-left">Group</th>
              </tr>
            </thead>
            <tbody>
              {students.students.map((student) => (
                <tr key={student.id} className="border-b border-gray-300">
                  <td className="p-2.5">{student.id}</td>
                  <td className="p-2.5">{student.first_name}</td>
                  <td className="p-2.5">{student.last_name}</td>
                  <td className="p-2.5">{student.patronym || '-'}</td>
                  <td className="p-2.5">{student.group_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
