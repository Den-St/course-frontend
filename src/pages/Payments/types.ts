export interface FilterPaymentsRequestDto {
  student_id?: number;
  group_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface PaymentItemDto {
  id: number;
  tuition_fee_id: number;
  amount_paid: number;
  payment_date: Date;
  payment_method: string | null;
  tuition_fee?: {
    id: number;
    student_id: number;
    period_start: Date;
    period_end: Date;
    amount: number;
    due_date: Date;
    description: string | null;
  };
  student?: {
    id: number;
    first_name: string;
    last_name: string;
    patronym: string;
    group_id: number | null;
  };
}

export interface FilterPaymentsResponseDto {
  data:{
    payments: PaymentItemDto[];
    count: number;
    totalAmount: number;
  }
}

export interface CreatePaymentRequestDto {
  tuition_fee_id: number;
  amount_paid: number;
  payment_date?: string;
  payment_method?: string;
  receipt_reference?: string;
}

export interface CreatePaymentResponseDto {
  id: number;
  tuition_fee_id: number;
  amount_paid: number;
  payment_date: Date;
  payment_method: string | null;
  receipt_reference?: string | null;
}
