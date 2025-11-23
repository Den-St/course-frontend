import { useState, useEffect } from 'react';
import { useSearchStudentsMutation } from '../api';
import { useFilterGroupsQuery } from '../../Groups/api';
import type { SearchStudentRequestDto } from '../types/types';

const AdminStudents = () => {
  const [searchParams, setSearchParams] = useState<SearchStudentRequestDto>({
    first_name: '',
    last_name: '',
    patronym: '',
  });

  const [searchStudents, { data: students, isLoading, error }] = useSearchStudentsMutation();
  const { data: groupsData } = useFilterGroupsQuery({});

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

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-6">Admin - Students Management</h1>
      
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
                <th className="p-2.5 text-left">Student ID</th>
                <th className="p-2.5 text-left">First Name</th>
                <th className="p-2.5 text-left">Last Name</th>
                <th className="p-2.5 text-left">patronym</th>
                <th className="p-2.5 text-left">Group</th>
                <th className="p-2.5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.students.map((student) => (
                <tr key={student.id} className="border-b border-gray-300">
                  <td className="p-2.5">{student.id}</td>
                  <td className="p-2.5">{student.student_id}</td>
                  <td className="p-2.5">{student.first_name}</td>
                  <td className="p-2.5">{student.last_name}</td>
                  <td className="p-2.5">{student.patronym || '-'}</td>
                  <td className="p-2.5">{student.group_id}</td>
                  <td className="p-2.5">
                    <button>Edit</button>
                  </td>
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
