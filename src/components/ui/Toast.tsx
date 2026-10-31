'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'danger' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

export interface ToastOptions {
  message?: string;
  description?: string;
  title?: string;
  type?: ToastType;
  variant?: ToastType;
}

interface ToastContextType {
  toast: (optionsOrMessage: string | ToastOptions, type?: ToastType, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (optionsOrMessage: string | ToastOptions, fallbackType: ToastType = 'info', fallbackTitle?: string) => {
      const id = Math.random().toString(36).substring(2, 9);

      let msg = '';
      let type: ToastType = fallbackType;
      let title: string | undefined = fallbackTitle;

      if (typeof optionsOrMessage === 'object' && optionsOrMessage !== null) {
        msg = optionsOrMessage.message || optionsOrMessage.description || optionsOrMessage.title || '';
        title = optionsOrMessage.message || optionsOrMessage.description ? optionsOrMessage.title : undefined;
        type = optionsOrMessage.variant || optionsOrMessage.type || 'info';
      } else {
        msg = String(optionsOrMessage);
      }

      const newToast: ToastMessage = { id, type, title, message: msg };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => addToast(message, 'success', title),
    [addToast]
  );

  const error = useCallback(
    (message: string, title?: string) => addToast(message, 'error', title),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';

          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex items-start space-x-3 p-4 rounded-md shadow-dropdown border text-sm transition-all',
                isSuccess && 'bg-success-light border-[#CAEEDC] text-heading',
                isError && 'bg-danger-light border-[#FDC4C6] text-heading',
                !isSuccess && !isError && 'bg-surface border-border text-heading shadow-card'
              )}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-success" />}
                {isError && <AlertCircle className="w-5 h-5 text-danger" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex-1 text-left">
                {t.title && <h5 className="font-semibold text-heading text-[14px] mb-0.5">{t.title}</h5>}
                <p className={cn('leading-relaxed', t.title ? 'text-xs text-body' : 'text-sm text-heading font-medium')}>
                  {t.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-muted hover:text-heading p-0.5 rounded-xs transition-colors focus:outline-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
