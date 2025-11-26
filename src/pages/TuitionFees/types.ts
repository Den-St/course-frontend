export interface TuitionFee {
  id: number;
  student_id?: number;
  period_start: string;
  period_end: string;
  amount?: number;
  due_date: string;
  description?: string;
}

// POST /tuitionFees/
export interface CreateTuitionFeeRequestDto {
  student_id?: number;
  group_id?: number;
  period_start: string;
  period_end: string;
  amount?: number;
  due_date: string;
  description?: string;
}

export interface CreateTuitionFeeResponseDto {
  tuitionFee: TuitionFee;
}

// POST /tuitionFees/by-group
export interface CreateTuitionFeeByGroupRequestDto {
  group_id: number;
  period_start: string;
  period_end: string;
  amount?: number;
  due_date: string;
  description?: string;
}

export interface CreateTuitionFeeByGroupResponseDto {
  tuitionFees: TuitionFee[];
  count: number;
}

// GET /tuitionFees/student-range
export interface GetTuitionFeesByStudentInRangeRequestDto {
  student_id: number;
  start_date?: string;
  end_date?: string;
}

export interface GetTuitionFeesByStudentInRangeResponseDto {
  tuitionFees: TuitionFee[];
  count: number;
  totalAmount: number;
}

// GET /tuitionFees/group
export interface GetTuitionFeesByGroupRequestDto {
  group_id: number;
  start_date?: string;
  end_date?: string;
}

export interface GetTuitionFeesByGroupResponseDto {
  tuitionFees: TuitionFee[];
  count: number;
  totalAmount: number;
}

// GET /tuitionFees/overdue
export interface GetOverdueTuitionFeesRequestDto {
  group_id?: number;
  student_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface GetOverdueTuitionFeesResponseDto {
  tuitionFees: TuitionFee[];
  count: number;
  totalAmount: number;
}

// GET /tuitionFees/filter
export interface FilterTuitionFeesRequestDto {
  student_id?: number;
  group_id?: number;
  start_date?: string;
  end_date?: string;
  onlyOverdue?: boolean;
}

export interface TuitionFeeItemDto {
  id: number;
  student_id: number;
  period_start: Date;
  period_end: Date;
  amount: number;
  due_date: Date;
  description: string | null;
  payment_id: number | null;
  student?: {
    id: number;
    first_name: string;
    last_name: string;
    patronym: string;
    group_id: number | null;
  };
  payment?: {
    id: number;
    amount: number;
    payment_date: Date;
  } | null;
}

export interface FilterTuitionFeesResponseDto {
  data:{
    tuitionFees: TuitionFeeItemDto[];
    count: number;
    totalAmount: number;
  }
}
