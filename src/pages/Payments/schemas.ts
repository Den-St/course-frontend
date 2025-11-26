import { z } from 'zod';

export const createPaymentSchema = z.object({
  tuition_fee_id: z.number().int().positive('Tuition fee ID is required'),
  amount_paid: z.number().positive('Amount must be greater than 0'),
  payment_date: z.string().optional(),
  payment_method: z.string().optional(),
  receipt_reference: z.string().optional(),
});

export type CreatePaymentFormData = z.infer<typeof createPaymentSchema>;
