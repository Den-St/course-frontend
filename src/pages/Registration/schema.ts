import { z } from 'zod';

export const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['teacher', 'student', 'parent']),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  patronym: z.string().min(1, 'Patronym is required'),
  specialization: z.string().optional(),
  phone: z.string().optional(),
  hire_date: z.string().optional(),
  birth_date: z.string().optional(),
  parent_id: z.number().optional(),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
