import { z } from 'zod';

export const createSubmissionFeedbackSchema = z.object({
  submission_id: z.number(),
  teacher_id: z.number(),
  feedback_text: z.string().min(1, 'Feedback text is required'),
});

export const updateSubmissionFeedbackSchema = z.object({
  feedback_text: z.string().min(1, 'Feedback text is required'),
});

export type CreateSubmissionFeedbackFormData = z.infer<typeof createSubmissionFeedbackSchema>;
export type UpdateSubmissionFeedbackFormData = z.infer<typeof updateSubmissionFeedbackSchema>;
