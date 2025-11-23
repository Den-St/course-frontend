import { baseApi } from '../../api/baseApi';
import type {
  SearchStudentRequestDto,
  StudentListResponseDto,
  UpdateStudentRequestDto,
  UpdateStudentResponseDto,
  UpdateStudentParams,
} from './types/types';

const endpointsUrl = {
  searchStudents: '/students/search',
  updateStudent: (id: number) => `/students/${id}`,
} as const;

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    searchStudents: create.mutation<
      StudentListResponseDto,
      SearchStudentRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.searchStudents,
        method: 'POST',
        body,
      }),
    }),
    updateStudent: create.mutation<
      UpdateStudentResponseDto,
      UpdateStudentParams & { body: UpdateStudentRequestDto }
    >({
      query: ({ id, body }) => ({
        url: endpointsUrl.updateStudent(id),
        method: 'PUT',
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useSearchStudentsMutation, useUpdateStudentMutation } = studentsApi;
