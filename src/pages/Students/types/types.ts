// Search Students
export interface SearchStudentRequestDto {
  group_id?: number;
  first_name?: string;
  last_name?: string;
  patronym?: string;
}

export interface StudentResponseDto {
  id: number;
  student_id: number;
  first_name: string;
  last_name: string;
  patronym: string | null;
  email: string;
  phone: string | null;
  birth_date: Date | null;
  group_id: number | null;
  group_name?: string;
  created_at: Date;
  updated_at: Date;
}

export interface StudentListResponseDto {
  students: StudentResponseDto[];
}

// Update Student
export interface UpdateStudentRequestDto {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  group_id?: number;
}

export interface UpdateStudentResponseDto {
  student_id: number;
  first_name: string;
  last_name: string;
  patronym: string | null;
  email: string;
  phone: string | null;
  birth_date: Date | null;
  group_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateStudentParams {
  id: number;
}

export interface GetStudentsByTeacherEnrollmentsRequestDto {
  teacher_id: number;
}

export interface GetStudentsByTeacherEnrollmentsResponseDto {
  students: StudentResponseDto[];
}
