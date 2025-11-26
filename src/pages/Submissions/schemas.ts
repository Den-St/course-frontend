import { z } from 'zod';

export const createSubmissionSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});

export type CreateSubmissionFormData = z.infer<typeof createSubmissionSchema>;

export const editSubmissionSchema = z.object({
  submission_id: z.number(),
  content: z.string().min(1, 'Content is required'),
});

export type EditSubmissionFormData = z.infer<typeof editSubmissionSchema>;
