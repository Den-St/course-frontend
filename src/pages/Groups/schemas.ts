import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  grade_level: z.number().min(1, 'Grade level must be at least 1').max(11, 'Grade level must be at most 11'),
  start_year: z.number().min(2000).max(2100).optional(),
  curator_id: z.number().optional(),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
