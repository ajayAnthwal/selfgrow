import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import {
  OrderItem,
  CreateOrderResponse,
  VerifyOrderResponse,
  PaginatedOrdersResponse,
} from '../types';

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { attemptId: string }) => {
      const response = await api.post<CreateOrderResponse>('/orders', payload);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useVerifyOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      razorpay_payment_id,
      razorpay_signature,
    }: {
      orderId: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      const response = await api.post<VerifyOrderResponse>(`/orders/${orderId}/verify`, {
        razorpay_payment_id,
        razorpay_signature,
      });
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useOrder(orderId: string, options?: { refetchInterval?: number | false | ((query: any) => number | false) }) {
  return useQuery<OrderItem>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await api.get<{ order: OrderItem }>(`/orders/${orderId}`);
      return response.order;
    },
    enabled: Boolean(orderId),
    refetchInterval: options?.refetchInterval,
  });
}

export function useOrders(params: { page?: number; limit?: number } = {}) {
  const { page = 1, limit = 10 } = params;

  return useQuery<PaginatedOrdersResponse>({
    queryKey: ['orders', { page, limit }],
    queryFn: async () => {
      const response = await api.get<PaginatedOrdersResponse>('/orders', {
        params: { page, limit },
      });
      return response;
    },
  });
}

