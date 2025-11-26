export interface CreateSubmissionRequestDto {
  assignment_id: number;
  student_id: number;
  content?: string;
  is_late?: boolean;
  feedback_given?: boolean;
}

export interface CreateSubmissionResponseDto {
  id: number;
  assignment_id: number;
  student_id: number;
  content: string | null;
  is_late: boolean;
  feedback_given: boolean;
  submitted_at: Date;
  assignment: {
    id: number;
    title: string;
    due_date: Date;
  };
  student: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface FilterSubmissionRequestDto {
  submission_id?: number;
  assignment_id?: number;
  student_id?: number;
  group_id?: number;
  teacher_id?: number;
  title?: string;
  description?: string;
  is_late?: boolean;
  feedback_given?: boolean;
  submitted_from?: string;
  submitted_to?: string;
}

export interface FilterSubmissionResponseDto {
  id: number;
  assignment_id: number;
  student_id: number;
  content: string | null;
  is_late: boolean;
  feedback_given: boolean;
  submitted_at: Date;
  assignment: {
    id: number;
    title: string;
    description: string | null;
    due_date: Date;
    teacher_id: number;
  };
  student: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    group_id: number | null;
  };
  grade: {
    id: number;
    grade_value: number;
  } | null;
  submissionFeedback: {
    id: number;
    submission_id: number;
    feedback_text: string;
  } | null;
}

export interface EditSubmissionDto {
  submission_id: number;
  content: string;
}

export interface EditSubmissionResponseDto {
  id: number;
  assignment_id: number;
  student_id: number;
  content: string;
  is_late: boolean;
  feedback_given: boolean;
  submitted_at: Date;
}
