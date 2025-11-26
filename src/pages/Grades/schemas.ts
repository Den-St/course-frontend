import { z } from 'zod';

export const createGradeSchema = z.object({
  submission_id: z.number(),
  teacher_id: z.number().optional(),
  grade: z.number().min(0, 'Grade must be at least 0').max(100, 'Grade must be at most 100').optional(),
});

export const updateGradeSchema = z.object({
  teacher_id: z.number().optional(),
  grade: z.number().min(0, 'Grade must be at least 0').max(100, 'Grade must be at most 100').optional(),
});

export type CreateGradeFormData = z.infer<typeof createGradeSchema>;
export type UpdateGradeFormData = z.infer<typeof updateGradeSchema>;
