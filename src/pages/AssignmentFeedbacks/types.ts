export interface CreateSubmissionFeedbackRequestDto {
  submission_id: number;
  teacher_id: number;
  feedback_text: string;
}

export interface CreateSubmissionFeedbackResponseDto {
  id: number;
  submission_id: number;
  teacher_id: number;
  feedback_text: string;
  feedback_date: Date;
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  submission: {
    id: number;
    assignment_id: number;
    student_id: number;
    content: string | null;
    submitted_at: Date;
  };
}

export interface UpdateSubmissionFeedbackRequestDto {
  feedback_text?: string;
}

export interface UpdateSubmissionFeedbackParams {
  id: number;
}

export interface UpdateSubmissionFeedbackResponseDto {
  id: number;
  submission_id: number;
  teacher_id: number;
  feedback_text: string;
  feedback_date: Date;
}

export interface GetFeedbacksBySubmissionRequestDto {
  submissionId: number;
}

export interface GetSubmissionFeedbackResponseDto {
  id: number;
  submission_id: number;
  teacher_id: number;
  feedback_text: string;
  feedback_date: Date;
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export type GetFeedbacksBySubmissionResponseDto = {data: GetSubmissionFeedbackResponseDto[];}

export interface GetStudentFeedbacksInRangeRequestDto {
  student_id: number;
  start_date: string;
  end_date: string;
  course_id?: number;
}

export type GetStudentFeedbacksInRangeResponseDto = GetSubmissionFeedbackResponseDto[];

export interface DeleteSubmissionFeedbackParams {
  id: number;
}

export interface DeleteSubmissionFeedbackResponseDto {
  message: string;
  deleted_feedback_id: number;
  submission_feedback_given_updated: boolean;
}
