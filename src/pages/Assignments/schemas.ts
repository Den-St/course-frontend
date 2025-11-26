import { z } from 'zod';

export const createAssignmentSchema = z.object({
  course_id: z.number({
    error: 'Course is required',
  }).int().positive(),
  teacher_id: z.number().int().positive().optional(),
  title: z.string()
    .min(1, 'Title is required')
    .max(150, 'Title must be 150 characters or less'),
  description: z.string().optional(),
  assign_date: z.string().optional(),
  due_date: z.string().min(1, 'Due date is required'),
  max_grade: z.number().min(0).max(999.99).optional(),
});

export const updateAssignmentSchema = z.object({
  course_id: z.number().int().positive().optional(),
  teacher_id: z.number().int().positive().optional(),
  title: z.string()
    .min(1, 'Title is required')
    .max(150, 'Title must be 150 characters or less')
    .optional(),
  description: z.string().optional(),
  assign_date: z.string().optional(),
  due_date: z.string().optional(),
  max_grade: z.number().min(0).max(999.99).optional(),
});

export type CreateAssignmentFormData = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentFormData = z.infer<typeof updateAssignmentSchema>;
