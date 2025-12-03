import { useGetMe } from '../../../api/authMe';
import Loader from '../../../components/Loader/Loader';
import Error from '../../../components/Error/Error';
import { useGetCoursesByTeacherQuery } from '../api';

const TeacherCourses = () => {
  const { data: userData } = useGetMe();
  const user = userData?.data;
  const { data: coursesData, isLoading, error } = useGetCoursesByTeacherQuery(
    { teacherId: user?.id || 0 },
    { skip: !user?.id }
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>
        <Loader message="Loading courses..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>
        <Error message="Failed to load courses. Please try again." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      
      {coursesData?.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">You are not teaching any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData?.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {course.name}
                </h2>
              </div>
              
              {course.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
