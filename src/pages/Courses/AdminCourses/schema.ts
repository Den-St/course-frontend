import { z } from 'zod';

export const createCourseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  description: z.string().optional(),
  mandatory: z.boolean().optional(),
  grade_level: z.number().min(1).max(12).optional().or(z.literal(undefined)),
  teacher_id: z.number().positive().optional().or(z.literal(undefined)),
});

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
