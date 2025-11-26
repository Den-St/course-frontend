// Create Assignment
export interface CreateAssignmentRequestDto {
  course_id?: number;
  teacher_id?: number;
  title: string;
  description?: string;
  assign_date?: string;
  due_date: string;
  max_grade?: number;
}

export interface CreateAssignmentResponseDto {
  id: number;
  course_id: number | null;
  teacher_id: number | null;
  title: string;
  description: string | null;
  assign_date: Date;
  due_date: Date;
  max_grade: number;
  course?: {
    id: number;
    name: string;
    description: string | null;
  };
  teacher?: {
    id: number;
    first_name: string;
    last_name: string;
    patronym: string | null;
  };
}

// Update Assignment
export interface UpdateAssignmentRequestDto {
  course_id?: number;
  teacher_id?: number;
  title?: string;
  description?: string;
  assign_date?: string;
  due_date?: string;
  max_grade?: number;
}

export interface UpdateAssignmentParams {
  id: number;
}

export interface UpdateAssignmentResponseDto {
  id: number;
  course_id: number | null;
  teacher_id: number | null;
  title: string;
  description: string | null;
  assign_date: Date;
  due_date: Date;
  max_grade: number;
  course?: {
    id: number;
    name: string;
    description: string | null;
  };
  teacher?: {
    id: number;
    first_name: string;
    last_name: string;
    patronym: string | null;
  };
}

// Get Assignments for Student Group
export interface GetAssignmentsForStudentGroupRequestDto {
  student_id: number;
  start_date?: string;
  end_date?: string;
}

export interface StudentGroupAssignmentsResponseDto {
  id: number;
  course_id: number | null;
  teacher_id: number | null;
  title: string;
  description: string | null;
  assign_date: Date;
  due_date: Date;
  max_grade: number;
  course?: {
    id: number;
    name: string;
    description: string | null;
  };
  teacher?: {
    id: number;
    first_name: string;
    last_name: string;
    patronym: string | null;
  };
}

// Filter Assignments
export interface GetAssignmentsFilterRequestDto {
  teacher_id?: number;
  course_id?: number;
  assignment_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface AssignmentResponseDto {
  id: number;
  course_id: number | null;
  teacher_id: number | null;
  title: string;
  description: string | null;
  assign_date: Date;
  due_date: Date;
  max_grade: number;
  course?: {
    id: number;
    name: string;
    description: string | null;
  };
  teacher?: {
    id: number;
    first_name: string;
    last_name: string;
    patronym: string | null;
  };
}
