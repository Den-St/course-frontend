import { baseApi } from '../../api/baseApi';
import type {
  GetLessonsForTeacherRequestDto,
  GetLessonsForTeacherResponseDto,
  GetLessonsForStudentRequestDto,
  GetLessonsForStudentResponseDto,
  CreateLessonRequestDto,
  CreateLessonResponseDto,
} from './types/types';

const endpointsUrl = {
  getLessonsForTeacher: (params: GetLessonsForTeacherRequestDto) => {
    const searchParams = new URLSearchParams();
    searchParams.append('teacher_id', params.teacher_id.toString());
    if (params.course_id !== undefined) {
      searchParams.append('course_id', params.course_id.toString());
    }
    if (params.start_date !== undefined) {
      searchParams.append('start_date', params.start_date);
    }
    if (params.end_date !== undefined) {
      searchParams.append('end_date', params.end_date);
    }
    return `/lessons/teacher?${searchParams.toString()}`;
  },
  getLessonsForStudent: (params: GetLessonsForStudentRequestDto) => {
    const searchParams = new URLSearchParams();
    searchParams.append('student_id', params.student_id.toString());
    if (params.start_date !== undefined) {
      searchParams.append('start_date', params.start_date);
    }
    if (params.end_date !== undefined) {
      searchParams.append('end_date', params.end_date);
    }
    return `/lessons/student?${searchParams.toString()}`;
  },
  createLesson: () => `/lessons/create`,
} as const;

export const lessonsApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    getLessonsForTeacher: create.query<
      GetLessonsForTeacherResponseDto,
      GetLessonsForTeacherRequestDto
    >({
      query: (params) => endpointsUrl.getLessonsForTeacher(params),
    }),
    getLessonsForStudent: create.query<
      GetLessonsForStudentResponseDto,
      GetLessonsForStudentRequestDto
    >({
      query: (params) => endpointsUrl.getLessonsForStudent(params),
    }),
    createLesson: create.mutation<
      CreateLessonResponseDto,
      CreateLessonRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.createLesson(),
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetLessonsForTeacherQuery,
  useGetLessonsForStudentQuery,
  useCreateLessonMutation,
} = lessonsApi;
