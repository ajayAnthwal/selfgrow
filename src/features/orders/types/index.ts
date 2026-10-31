export type OrderStatus = 'CREATED' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  userId: string;
  productId: string;
  attemptId: string;
  amountInPaise: number;
  currency: string;
  status: OrderStatus;
  razorpayOrderId?: string | null;
  createdAt: string;
  paidAt?: string | null;
  product?: {
    id: string;
    slug: string;
    name: any;
  };
  attempt?: {
    id: string;
    status: string;
    language: string;
  };
  payments?: Array<{
    id: string;
    razorpayPaymentId: string;
    amountInPaise: number;
    status: string;
    method?: string | null;
    createdAt: string;
  }>;
}

export interface CreateOrderResponse {
  orderId: string;
  status?: OrderStatus;
  razorpayOrderId?: string;
  amountInPaise: number;
  currency: string;
  keyId?: string;
  isFree?: boolean;
  isAlreadyPaid?: boolean;
}

export interface VerifyOrderResponse {
  success: boolean;
  message: string;
  orderId: string;
}

export interface PaginatedOrdersResponse {
  items: OrderItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

