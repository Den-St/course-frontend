import { z } from 'zod';

export const createCourseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  description: z.string().optional(),
  teacher_id: z.number().positive().optional().or(z.literal(undefined)),
});

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
