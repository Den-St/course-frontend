import { baseApi } from '../../api/baseApi';
import type {
  FilterPaymentsRequestDto,
  FilterPaymentsResponseDto,
  CreatePaymentRequestDto,
  CreatePaymentResponseDto,
} from './types';

const endpointsUrl = {
  createPayment: () => `/payments/`,
  filterPayments: (params: FilterPaymentsRequestDto) => {
    const searchParams = new URLSearchParams();
    if (params.student_id !== undefined) {
      searchParams.append('student_id', params.student_id.toString());
    }
    if (params.group_id !== undefined) {
      searchParams.append('group_id', params.group_id.toString());
    }
    if (params.start_date !== undefined) {
      searchParams.append('start_date', params.start_date);
    }
    if (params.end_date !== undefined) {
      searchParams.append('end_date', params.end_date);
    }
    return `/payments/filter?${searchParams.toString()}`;
  },
} as const;

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    createPayment: create.mutation<
      CreatePaymentResponseDto,
      CreatePaymentRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.createPayment(),
        method: 'POST',
        body,
      }),
    }),
    filterPayments: create.query<
      FilterPaymentsResponseDto,
      FilterPaymentsRequestDto
    >({
      query: (params) => endpointsUrl.filterPayments(params),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreatePaymentMutation,
  useFilterPaymentsQuery,
} = paymentsApi;
