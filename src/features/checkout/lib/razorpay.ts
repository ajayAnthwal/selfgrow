'use client';

export interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  order_id: string; // razorpayOrderId
  name?: string;
  description?: string;
  prefill?: RazorpayPrefill;
  theme?: {
    color?: string;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayErrorResponse {
  reason: 'DISMISSED' | 'PAYMENT_FAILED' | 'LOAD_FAILED';
  description?: string;
  code?: string;
  metadata?: any;
}

let scriptLoadingPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);

  // If already loaded on window
  if ((window as any).Razorpay) {
    return Promise.resolve(true);
  }

  // If already in flight, share promise
  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise<boolean>((resolve) => {
    // Check if script tag exists
    const existingScript = document.getElementById('razorpay-checkout-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => {
      scriptLoadingPromise = null;
      resolve(false);
    };

    document.body.appendChild(script);
  });

  return scriptLoadingPromise;
}

export async function openRazorpayCheckout(
  options: RazorpayCheckoutOptions
): Promise<RazorpaySuccessResponse> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !(window as any).Razorpay) {
    throw {
      reason: 'LOAD_FAILED',
      description: 'Failed to load Razorpay payment gateway script. Please check your network connection.',
    } as RazorpayErrorResponse;
  }

  return new Promise<RazorpaySuccessResponse>((resolve, reject) => {
    let resolved = false;

    const razorpayInstance = new (window as any).Razorpay({
      key: options.key,
      amount: options.amount,
      currency: options.currency,
      name: options.name || 'Antigravity Assessment',
      description: options.description || 'Evaluation Diagnostic Report',
      order_id: options.order_id,
      prefill: options.prefill,
      theme: {
        color: options.theme?.color || '#2563eb', // brand-600
      },
      handler: (response: RazorpaySuccessResponse) => {
        resolved = true;
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          if (!resolved) {
            reject({
              reason: 'DISMISSED',
              description: 'Payment was cancelled or modal was dismissed.',
            } as RazorpayErrorResponse);
          }
        },
      },
    });

    razorpayInstance.on('payment.failed', (response: any) => {
      resolved = true;
      reject({
        reason: 'PAYMENT_FAILED',
        description: response.error?.description || 'Payment processing failed. Please try again.',
        code: response.error?.code,
        metadata: response.error?.metadata,
      } as RazorpayErrorResponse);
    });

    razorpayInstance.open();
  });
}

