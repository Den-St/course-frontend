import { z } from 'zod';

export const createTuitionFeeSchema = z.object({
  student_id: z.number().min(1, 'Student ID is required').optional(),
  group_id: z.number().min(1, 'Group ID is required').optional(),
  period_start: z.string().min(1, 'Period start date is required'),
  period_end: z.string().min(1, 'Period end date is required'),
  amount: z.number().min(0, 'Amount must be non-negative').optional(),
  due_date: z.string().min(1, 'Due date is required'),
  description: z.string().optional(),
});

export type CreateTuitionFeeFormData = z.infer<typeof createTuitionFeeSchema>;

export const filterTuitionFeesSchema = z.object({
  student_id: z.number().optional(),
  group_id: z.number().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  onlyOverdue: z.boolean().optional(),
});

export type FilterTuitionFeesFormData = z.infer<typeof filterTuitionFeesSchema>;
