export type CreateCourseRequestDto = {
  name: string;
  description?: string;
  teacher_id?: number;
};

export type CreateCourseResponseDto = {
  id: number;
  name: string;
  description: string | null;
  teacher_id: number | null;
};

export type AssignTeacherRequestDto = {
  course_id: number;
  teacher_id: number;
};

export type AssignTeacherResponseDto = {
  id: number;
  name: string;
  description: string | null;
  teacher_id: number;
};

export type GetCoursesByTeacherRequestDto = {
  teacherId: number;
};

export type GetCoursesByStudentRequestDto = {
  studentId: number;
};

export type CourseResponseDto = {
  id: number;
  name: string;
  description: string | null;
  teacher_id: number | null;
  teacher?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
};

export type GetCoursesResponseDto = CourseResponseDto[];

export type FilterCoursesRequestDto = {
  teacher_id?: number;
  student_id?: number;
};

export type FilteredCourseResponseDto = {
  id: number;
  name: string;
  description: string | null;
  teacher_id: number | null;
  enrollment_count: number;
  teacher?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
};

export type FilterCoursesResponseDto = {
  courses: FilteredCourseResponseDto[];
};
