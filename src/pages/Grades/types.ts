export interface CreateGradeRequestDto {
  submission_id: number;
  teacher_id?: number;
  grade?: number;
}

export interface CreateGradeResponseDto {
  id: number;
  teacher_id: number | null;
  grade: number | null;
  submission_id: number;
  date_given: Date;
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  submission: {
    id: number;
    assignment_id: number;
    student_id: number;
    content: string | null;
    submitted_at: Date;
    assignment: {
      id: number;
      title: string;
      course_id: number;
    };
    student: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

export interface UpdateGradeRequestDto {
  teacher_id?: number;
  grade?: number;
}

export interface UpdateGradeParams {
  id: number;
}

export interface UpdateGradeResponseDto {
  id: number;
  teacher_id: number | null;
  grade: number | null;
  submission_id: number;
  date_given: Date;
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export interface GetGroupAverageGradeRequestDto {
  group_id: number;
  start_date: string;
  end_date: string;
}

export interface GetGroupAverageGradeResponseDto {
  group_id: number;
  start_date: string;
  end_date: string;
  average: number | null;
  count: number;
}

export interface GetStudentGradesInRangeRequestDto {
  student_id: number;
  start_date: string;
  end_date: string;
}

export interface GradeDetailDto {
  id: number;
  teacher_id: number | null;
  grade: number | null;
  submission_id: number;
  date_given: Date;
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  assignment: {
    id: number;
    title: string;
    description: string | null;
    due_date: Date;
    course_id: number;
  };
}

export interface GetStudentGradesInRangeResponseDto {
  student_id: number;
  start_date: string;
  end_date: string;
  grades: GradeDetailDto[];
  average: number | null;
  count: number;
}
