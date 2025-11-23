import { baseApi } from '../../api/baseApi';
import type {
  CreateCourseRequestDto,
  CreateCourseResponseDto,
  AssignTeacherRequestDto,
  AssignTeacherResponseDto,
  GetCoursesByTeacherRequestDto,
  GetCoursesByStudentRequestDto,
  GetCoursesResponseDto,
  FilterCoursesRequestDto,
  FilterCoursesResponseDto,
} from './types/types';

const endpointsUrl = {
  createCourse: () => `/courses/`,
  assignTeacher: () => `/courses/assign-teacher`,
  getCoursesByTeacher: (params: GetCoursesByTeacherRequestDto) =>
    `/courses/teacher/${params.teacherId}`,
  getCoursesByStudent: (params: GetCoursesByStudentRequestDto) =>
    `/courses/student/${params.studentId}`,
  filterCourses: (params: FilterCoursesRequestDto) => {
    const searchParams = new URLSearchParams();
    if (params.teacher_id !== undefined) {
      searchParams.append('teacher_id', params.teacher_id.toString());
    }
    if (params.student_id !== undefined) {
      searchParams.append('student_id', params.student_id.toString());
    }
    return `/courses/filter?${searchParams.toString()}`;
  },
} as const;

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    createCourse: create.mutation<
      CreateCourseResponseDto,
      CreateCourseRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.createCourse(),
        method: 'POST',
        body,
      }),
    }),
    assignTeacher: create.mutation<
      AssignTeacherResponseDto,
      AssignTeacherRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.assignTeacher(),
        method: 'POST',
        body,
      }),
    }),
    getCoursesByTeacher: create.query<
      GetCoursesResponseDto,
      GetCoursesByTeacherRequestDto
    >({
      query: (params) => endpointsUrl.getCoursesByTeacher(params),
    }),
    getCoursesByStudent: create.query<
      GetCoursesResponseDto,
      GetCoursesByStudentRequestDto
    >({
      query: (params) => endpointsUrl.getCoursesByStudent(params),
    }),
    filterCourses: create.query<
      FilterCoursesResponseDto,
      FilterCoursesRequestDto
    >({
      query: (params) => endpointsUrl.filterCourses(params),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateCourseMutation,
  useAssignTeacherMutation,
  useGetCoursesByTeacherQuery,
  useGetCoursesByStudentQuery,
  useFilterCoursesQuery,
} = coursesApi;
