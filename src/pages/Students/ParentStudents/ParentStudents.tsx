import { useEffect } from 'react';
import { useSearchStudentsMutation } from '../api';
import { useGetMeQuery } from '../../../api/authMe/api';

const ParentStudents = () => {
  const { data: userData, isLoading, error } = useGetMeQuery();
  const children = userData?.data?.children || [];

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 font-semibold';
    if (grade >= 75) return 'text-blue-600 font-semibold';
    if (grade >= 60) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-600">Error loading students</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Children</h1>

      {children && children.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((student) => (
            <div key={student.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                {student.first_name} {student.last_name}
              </h2>
              <div className="space-y-2">
                {student.patronym && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Patronym
                    </label>
                    <p className="text-gray-900">{student.patronym}</p>
                  </div>
                )}
                {student.group_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Group ID
                    </label>
                    <p className="text-gray-900">{student.group_id}</p>
                  </div>
                )}
                {student.average_grade && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Average grade
                    </label>
                    <p className={`text-2xl ${getGradeColor(student.average_grade)}`}>
                      {student.average_grade.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">No students found</p>
        </div>
      )}
    </div>
  );
};

export default ParentStudents;
