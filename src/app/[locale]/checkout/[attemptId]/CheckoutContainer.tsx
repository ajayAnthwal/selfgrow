'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { DetailedAttempt } from '@/features/assessment';
import { useCreateOrder, useVerifyOrder } from '@/features/orders/api';
import { useAuth } from '@/features/auth/AuthContext';
import { OrderSummaryCard } from '@/features/checkout/components/OrderSummaryCard';
import { openRazorpayCheckout } from '@/features/checkout/lib/razorpay';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { formatMoney } from '@/lib/utils/formatMoney';
import { ApiClientError, api } from '@/lib/api/client';
import { mapErrorCode } from '@/lib/utils/errors';
import { ShieldAlert, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { CreateOrderResponse } from '@/features/orders/types';

interface CheckoutContainerProps {
  attempt: DetailedAttempt;
}

export function CheckoutContainer({ attempt }: CheckoutContainerProps) {
  const t = useTranslations('checkout');
  const tErrors = useTranslations('errors');
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const createOrderMutation = useCreateOrder();
  const verifyOrderMutation = useVerifyOrder();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cached order from initial creation to reuse on retry
  const activeOrderRef = useRef<CreateOrderResponse | null>(null);

  // If attempt was not submitted, candidates cannot generate order
  useEffect(() => {
    if (attempt.status !== 'SUBMITTED') {
      router.replace(`/assessment/attempt/${attempt.id}`);
    }
  }, [attempt.status, attempt.id, router]);

  // Handle Checkout Action
  const handleProceedToPayment = async () => {
    if (isProcessing || isConfirming) return;
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // 1. Create or retrieve existing order from backend
      let orderData: CreateOrderResponse;
      if (activeOrderRef.current) {
        orderData = activeOrderRef.current;
      } else {
        orderData = await createOrderMutation.mutateAsync({
          attemptId: attempt.id,
        });
        activeOrderRef.current = orderData;
      }

      // 2. Free product flow OR already paid
      if (orderData.isFree || orderData.amountInPaise === 0 || orderData.status === 'PAID') {
        router.push(`/reports/status/${orderData.orderId}`);
        return;
      }

      // 3. Paid product flow via Razorpay Gateway
      if (!orderData.razorpayOrderId || !orderData.keyId) {
        throw new Error('Payment gateway configuration is missing from server order response.');
      }

      try {
        const paymentResult = await openRazorpayCheckout({
          key: orderData.keyId,
          amount: orderData.amountInPaise,
          currency: orderData.currency || 'INR',
          order_id: orderData.razorpayOrderId,
          name: 'Antigravity Diagnostic Evaluation',
          description: `Attempt ${attempt.id.slice(0, 8)} Report Generation`,
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: '#2563eb', // brand-600
          },
        });

        // 4. Verify payment on backend
        setIsConfirming(true);
        try {
          await verifyOrderMutation.mutateAsync({
            orderId: orderData.orderId,
            razorpay_payment_id: paymentResult.razorpay_payment_id,
            razorpay_signature: paymentResult.razorpay_signature,
          });

          router.push(`/reports/status/${orderData.orderId}`);
        } catch (verifyErr: any) {
          // If verify call encountered a network failure, DO NOT tell the user payment failed!
          // Webhook might already have marked it PAID. Show confirming status and poll order.
          toast(t('confirmingPayment'), 'info');
          router.push(`/reports/status/${orderData.orderId}`);
        }
      } catch (gatewayErr: any) {
        if (gatewayErr?.reason === 'DISMISSED') {
          // User dismissed the checkout modal - stay on page and allow retry
          toast(t('paymentDismissed'), 'info');
        } else if (gatewayErr?.reason === 'PAYMENT_FAILED') {
          setErrorMessage(gatewayErr.description || t('paymentFailed'));
        } else {
          setErrorMessage(gatewayErr?.description || t('paymentFailed'));
        }
      }
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        const key = mapErrorCode(err.code);
        setErrorMessage(tErrors(key as any));
      } else {
        setErrorMessage(err?.message || tErrors('GENERIC'));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-16 bg-slate-50 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {t('subtitle')}
          </p>
        </div>

        {errorMessage && (
          <div
            className="flex items-start space-x-2.5 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200"
            role="alert"
          >
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isConfirming && (
          <div className="flex items-center space-x-3 rounded-xl bg-brand-50 p-4 text-sm text-brand-800 border border-brand-200 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin text-brand-600 flex-shrink-0" />
            <span>{t('confirmingPayment')}</span>
          </div>
        )}

        <OrderSummaryCard
          productName="AI Diagnostic Talent & Competency Evaluation"
          amountInPaise={activeOrderRef.current?.amountInPaise ?? 0}
          language={attempt.language}
          attemptId={attempt.id}
        />

        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleProceedToPayment}
            isLoading={isProcessing || isConfirming}
            disabled={isProcessing || isConfirming}
            className="w-full justify-center text-base py-3.5 shadow-sm"
          >
            {isConfirming ? (
              <span>{t('confirmingPayment')}</span>
            ) : isProcessing ? (
              <span>{t('processingPayment')}</span>
            ) : (
              <span className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>
                  {activeOrderRef.current && activeOrderRef.current.amountInPaise > 0
                    ? t('payButton', {
                        amount: formatMoney(activeOrderRef.current.amountInPaise, locale),
                      })
                    : activeOrderRef.current && activeOrderRef.current.amountInPaise === 0
                    ? t('claimFreeButton')
                    : 'Proceed to Payment & Generate Report'}
                </span>
              </span>
            )}
          </Button>

          {errorMessage && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleProceedToPayment}
              className="w-full justify-center"
            >
              {t('retryButton')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
