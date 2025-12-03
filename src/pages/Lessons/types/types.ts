export interface GetLessonsForTeacherRequestDto {
  teacher_id: number;
  course_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface LessonDto {
  id: number;
  course: {
    id: number;
    name: string;
    description: string;
  };
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    patronym: string;
  };
  lesson_date: Date;
  start_time: string;
  end_time: string;
  topic: string;
}

export type GetLessonsForTeacherResponseDto = {data: LessonDto[]};

export interface GetLessonsForStudentRequestDto {
  student_id: number;
  start_date?: string;
  end_date?: string;
}

export interface StudentLessonDto {
  id: number;
  course: {
    id: number;
    name: string;
    description: string;
  };
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    patronym: string;
    specialization: string;
    phone: string;
  };
  lesson_date: Date;
  start_time: string;
  end_time: string;
  topic: string;
}

export type GetLessonsForStudentResponseDto = {data: StudentLessonDto[]};

export interface CreateLessonRequestDto {
  course_id: number;
  teacher_id: number;
  lesson_date: string;
  start_time?: string;
  end_time?: string;
  topic?: string;
}

export interface CreateLessonResponseDto {
  id: number;
  course: {
    id: number;
    name: string;
    description: string;
    teacher_id: number;
  };
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    patronym: string;
    specialization: string;
    phone: string;
  };
  lesson_date: Date;
  start_time: string;
  end_time: string;
  topic: string;
}
