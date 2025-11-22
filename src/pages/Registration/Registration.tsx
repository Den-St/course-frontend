import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationSchema, type RegistrationFormData } from './schema';
import { useRegisterMutation } from './api';
import type { UserRole } from './types';
import { routes } from '../../routes/routes';

const Registration = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: 'student',
    },
  });

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const result = await register(data).unwrap();
      if (result.success && result.token) {
        localStorage.setItem('token', result.token);
        navigate(routes.homePage.getRoute());
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Registration</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Account Type</label>
          <select
            {...registerField('role')}
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            {...registerField('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
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

        {/* Phone (Optional for all) */}
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

        {/* Teacher-specific fields */}
        {selectedRole === 'teacher' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Specialization (Optional)</label>
              <input
                type="text"
                {...registerField('specialization')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mathematics"
              />
              {errors.specialization && (
                <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hire Date (Optional)</label>
              <input
                type="date"
                {...registerField('hire_date')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.hire_date && (
                <p className="text-red-500 text-sm mt-1">{errors.hire_date.message}</p>
              )}
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Registration;
