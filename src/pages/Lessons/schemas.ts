import { z } from 'zod';

export const createLessonSchema = z.object({
  course_id: z.number({
    error: 'Course is required',
  }).positive('Course must be selected'),
  teacher_id: z.number().positive().optional(),
  lesson_date: z.string({
    error: 'Lesson date is required',
  }).min(1, 'Lesson date is required'),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  topic: z.string().optional(),
});

export type CreateLessonFormData = z.infer<typeof createLessonSchema>;
