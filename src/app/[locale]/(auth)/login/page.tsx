'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/routing';
import { loginSchema, LoginInput } from '@/features/auth/auth.schema';
import { useAuth } from '@/features/auth/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { IconBox } from '@/components/ui/IconBox';
import { ApiClientError } from '@/lib/api/client';
import { mapErrorCode } from '@/lib/utils/errors';
import { ShieldAlert, Sparkles, CheckCircle2, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function LoginPage() {
  const tAuth = useTranslations('auth');
  const tErrors = useTranslations('errors');
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitRedirect = searchParams.get('redirect');
  const redirectUrl = explicitRedirect || '/account';
  const reason = searchParams.get('reason');
  const productName = searchParams.get('product');

  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setServerError(null);
    try {
      const loggedUser = await login(values);
      const target = explicitRedirect 
        ? explicitRedirect 
        : loggedUser?.role === 'ADMIN' 
          ? '/admin' 
          : '/account';

      // Full window navigation guarantees cookies are re-read by Next.js SSR middleware
      window.location.href = target;
    } catch (err) {
      if (err instanceof ApiClientError) {
        const errorKey = mapErrorCode(err.code);
        setServerError(tErrors(errorKey as any));
      } else {
        setServerError(tErrors('GENERIC'));
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 bg-surface rounded-lg shadow-card border border-border overflow-hidden">
        {/* Left Column: Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading">
              {tAuth('loginTitle') || 'Welcome Back'}
            </h1>
            <p className="mt-2 text-sm text-body">
              {tAuth('loginSubtitle') || 'Sign in to access your assessments and diagnostic reports.'}
            </p>
          </div>

          {reason === 'purchase_required' && (
            <div
              className="mb-6 rounded-md bg-light-blue p-4 border border-primary/20 flex items-start space-x-3 text-navy shadow-xs"
              role="alert"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-heading">Sign In to Complete Your Purchase</h4>
                <p className="text-xs text-body mt-1 leading-relaxed">
                  {productName ? (
                    <>
                      You are about to purchase <strong className="text-heading font-semibold">{productName}</strong>.{' '}
                    </>
                  ) : null}
                  Please log in or create an account so your assessment progress, answers, and diagnostic reports can be securely saved to your profile.
                </p>
              </div>
            </div>
          )}

          {serverError && (
            <div
              className="mb-6 flex items-start space-x-2.5 rounded-sm bg-danger-light p-3.5 text-sm text-danger border border-danger/20"
              role="alert"
            >
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-danger mt-0.5" />
              <span className="font-medium">{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              label={tAuth('email') || 'Email Address'}
              error={errors.email?.message}
              required
            >
              <Input
                type="email"
                autoComplete="email"
                placeholder={tAuth('emailPlaceholder') || 'name@example.com'}
                error={Boolean(errors.email)}
                {...register('email')}
              />
            </FormField>

            <FormField
              label={tAuth('password') || 'Password'}
              error={errors.password?.message}
              required
            >
              <PasswordInput
                autoComplete="current-password"
                placeholder={tAuth('passwordPlaceholder') || 'Enter your password'}
                error={Boolean(errors.password)}
                {...register('password')}
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isFullWidth
              className="mt-2 h-12 font-semibold shadow-card"
              isLoading={isSubmitting}
            >
              {isSubmitting ? tAuth('submitting') || 'Signing in...' : tAuth('submitLogin') || 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-body">
            {tAuth('noAccount') || "Don't have an account?"}{' '}
            <Link
              href={
                redirectUrl
                  ? `/register?redirect=${encodeURIComponent(redirectUrl)}${reason ? `&reason=${reason}` : ''}${productName ? `&product=${encodeURIComponent(productName)}` : ''}`
                  : '/register'
              }
              className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors"
            >
              {tAuth('submitRegister') || 'Create one now'}
            </Link>
          </div>
        </div>

        {/* Right Column: Branded Highlights Panel */}
        <div className="hidden md:flex md:col-span-5 bg-surface-secondary p-8 lg:p-10 flex-col justify-between border-l border-border">
          <div>
            <div className="flex items-center space-x-2.5 mb-8">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-heading">
                Self<span className="text-primary">Grow</span>
              </span>
            </div>

            <h3 className="text-xl font-bold text-heading leading-snug mb-4">
              Unlock Your Full Cognitive Potential
            </h3>
            <p className="text-sm text-body leading-relaxed mb-6">
              Access your personalized evaluations, track your growth over time, and download verified AI diagnostic reports.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start space-x-3 text-xs text-heading font-medium">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>Evidence-based psychometric frameworks</span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-heading font-medium">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>Instant bilingual AI diagnostic report in PDF</span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-heading font-medium">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>100% confidential and DPDP 2023 compliant</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/80 flex items-center space-x-3 text-xs text-muted">
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Bank-grade 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
