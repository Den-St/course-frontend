import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetMe } from '../../../api/authMe/hooks/useGetMe';
import { useFilterTuitionFeesQuery } from '../api';
import { useCreatePaymentMutation } from '../../Payments/api';
import { createPaymentSchema, type CreatePaymentFormData } from '../../Payments/schemas';

const ParentsTuitionFees = () => {
  const { data: parentData, isLoading: userLoading } = useGetMe();
  const enrolledChildren = parentData?.data?.children || [];

  const [selectedChild, setSelectedChild] = useState<number | undefined>(undefined);
  const [dateWindow, setDateWindow] = useState({
    startingDate: '',
    endingDate: '',
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedFeeForPayment, setSelectedFeeForPayment] = useState<number | null>(null);

  const { 
    data: feesResponse, 
    isLoading: feesLoading, 
    isError: hasFetchError
  } = useFilterTuitionFeesQuery(
    {
      student_id: selectedChild,
      start_date: dateWindow.startingDate || undefined,
      end_date: dateWindow.endingDate || undefined,
    },
    {
      skip: selectedChild === undefined,
    }
  );

  const [createPayment, { isLoading: isCreatingPayment, isSuccess: paymentSuccess }] = useCreatePaymentMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreatePaymentFormData>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      tuition_fee_id: undefined,
      amount_paid: undefined,
      payment_date: '',
      payment_method: '',
      receipt_reference: '',
    },
  });

  useEffect(() => {
    if (paymentSuccess) {
      reset();
      setIsPaymentModalOpen(false);
      setSelectedFeeForPayment(null);
    }
  }, [paymentSuccess, reset]);

  useEffect(() => {
    if (enrolledChildren.length > 0 && selectedChild === undefined) {
      setSelectedChild(enrolledChildren[0].id);
    }
  }, [enrolledChildren, selectedChild]);

  const changeChildSelection = (childValue: string) => {
    setSelectedChild(childValue ? Number(childValue) : undefined);
  };

  const changeDateWindow = (dateField: 'startingDate' | 'endingDate', dateVal: string) => {
    setDateWindow((prev) => ({
      ...prev,
      [dateField]: dateVal,
    }));
  };

  const clearDateFilters = () => {
    setDateWindow({
      startingDate: '',
      endingDate: '',
    });
  };

  const handlePaymentClick = (feeId: number, feeAmount: number) => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedFeeForPayment(feeId);
    setValue('tuition_fee_id', feeId);
    setValue('amount_paid', feeAmount);
    setValue('payment_date', today);
    setIsPaymentModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedFeeForPayment(null);
    reset();
  };

  const onSubmitPayment = async (data: CreatePaymentFormData) => {
    try {
      await createPayment(data).unwrap();
    } catch (err) {
      console.error('Failed to create payment:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount}`;
  };

  const formatDateDisplay = (dateVal: Date | string) => {
    return new Date(dateVal).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdueStatus = (dueDate: Date | string) => {
    return new Date(dueDate) < new Date();
  };

  if (userLoading) {
    return (
      <div className="p-6">
        <div className="text-gray-600">Retrieving account information...</div>
      </div>
    );
  }

  if (enrolledChildren.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tuition Fees Overview</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">No children registered under your account.</p>
        </div>
      </div>
    );
  }

  const feesList = feesResponse?.data?.tuitionFees || [];
  const totalFeeAmount = feesResponse?.data?.totalAmount || 0;
  const hasFees = feesList.length > 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Tuition Fees Overview</h1>

      {/* Filter Section */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Search & Filter Fees</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Select Student
              </label>
              <select
                value={selectedChild || ''}
                onChange={(e) => changeChildSelection(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a student</option>
                {enrolledChildren.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.first_name} {child.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                From Date
              </label>
              <input
                type="date"
                value={dateWindow.startingDate}
                onChange={(e) => changeDateWindow('startingDate', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                To Date
              </label>
              <input
                type="date"
                value={dateWindow.endingDate}
                onChange={(e) => changeDateWindow('endingDate', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {(dateWindow.startingDate || dateWindow.endingDate) && (
            <button
              onClick={clearDateFilters}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Date Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white shadow-md rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Fee Records</h2>
            {feesResponse && (
              <div className="flex gap-6 text-sm">
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">{feesResponse.data.count}</span> records
                </span>
                <span className="text-gray-600">
                  Total: <span className="font-semibold text-gray-900">{formatCurrency(totalFeeAmount)}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {feesLoading && (
            <p className="text-center text-gray-500 py-8">Fetching fee records...</p>
          )}

          {!feesLoading && hasFetchError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Failed to load tuition fees. Please try again.</p>
            </div>
          )}

          {!feesLoading && !hasFetchError && !hasFees && (
            <p className="text-center text-gray-500 py-8">No tuition fees match your search criteria</p>
          )}

          {!feesLoading && !hasFetchError && hasFees && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Fee ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {feesList.map((fee) => (
                    <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-900">
                        #{fee.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {formatDateDisplay(fee.period_start)} - {formatDateDisplay(fee.period_end)}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                        {formatCurrency(fee.amount)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={isOverdueStatus(fee.due_date) && !fee.payment ? 'text-red-600 font-medium' : 'text-gray-700'}>
                          {formatDateDisplay(fee.due_date)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {fee.payment ? (
                          <div className="space-y-1">
                            <span className="inline-block px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              Paid
                            </span>
                            <p className="text-xs text-gray-600">
                              {formatCurrency(fee.payment.amount)} on {formatDateDisplay(fee.payment.payment_date)}
                            </p>
                          </div>
                        ) : (
                          <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                            isOverdueStatus(fee.due_date) 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {isOverdueStatus(fee.due_date) ? 'Overdue' : 'Pending'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {fee.description || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {!fee.payment && (
                          <button
                            onClick={() => handlePaymentClick(fee.id, fee.amount)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-[14] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Make Payment</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitPayment)} className="p-6 space-y-5">
              {/* Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Amount to Pay <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    {...register('amount_paid', { valueAsNumber: true })}
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                    placeholder="0.00"
                    readOnly
                  />
                </div>
                {errors.amount_paid && (
                  <p className="text-sm text-red-600">{errors.amount_paid.message}</p>
                )}
              </div>

              {/* Payment Date */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Payment Date
                </label>
                <input
                  type="date"
                  {...register('payment_date')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 cursor-not-allowed font-medium"
                  readOnly
                />
                {errors.payment_date && (
                  <p className="text-sm text-red-600">{errors.payment_date.message}</p>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Payment Method
                </label>
                <select
                  {...register('payment_method')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select method</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="cash">Cash</option>
                </select>
                {errors.payment_method && (
                  <p className="text-sm text-red-600">{errors.payment_method.message}</p>
                )}
              </div>

              {/* Receipt Reference */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Receipt Reference
                </label>
                <input
                  type="text"
                  {...register('receipt_reference')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Receipt number or reference ID"
                />
                {errors.receipt_reference && (
                  <p className="text-sm text-red-600">{errors.receipt_reference.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreatingPayment}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreatingPayment ? 'Processing...' : 'Submit Payment'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isCreatingPayment}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentsTuitionFees;
