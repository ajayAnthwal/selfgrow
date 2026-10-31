'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/routing';
import { registerSchema, RegisterInput } from '@/features/auth/auth.schema';
import { useAuth } from '@/features/auth/AuthContext';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { ApiClientError } from '@/lib/api/client';
import { mapErrorCode } from '@/lib/utils/errors';
import { ShieldAlert, Sparkles, CheckCircle2, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function RegisterPage() {
  const tAuth = useTranslations('auth');
  const tErrors = useTranslations('errors');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitRedirect = searchParams.get('redirect');
  const redirectUrl = explicitRedirect || '/account';
  const reason = searchParams.get('reason');
  const productName = searchParams.get('product');

  const { register: registerAuth } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      preferredLanguage: locale === 'hi' ? 'HI' : 'EN',
      acceptedTerms: false,
    },
  });

  const acceptedTerms = watch('acceptedTerms');

  const onSubmit = async (values: RegisterInput) => {
    setServerError(null);
    try {
      const user = await registerAuth(values);
      if (explicitRedirect) {
        router.push(explicitRedirect);
      } else if (user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 bg-surface rounded-lg shadow-card border border-border overflow-hidden">
        {/* Left Column: Register Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading">
              {tAuth('registerTitle') || 'Create Your Account'}
            </h1>
            <p className="mt-2 text-sm text-body">
              {tAuth('registerSubtitle') || 'Begin your self-discovery journey with SelfGrow.'}
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
                <h4 className="text-sm font-bold text-heading">Create Account to Complete Your Purchase</h4>
                <p className="text-xs text-body mt-1 leading-relaxed">
                  {productName ? (
                    <>
                      Register now to complete your order for <strong className="text-heading font-semibold">{productName}</strong>.{' '}
                    </>
                  ) : null}
                  Your evaluation answers, real-time timer progress, and AI reports will be saved under this account.
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
              label={tAuth('name') || 'Full Name'}
              error={errors.name?.message}
              required
            >
              <Input
                type="text"
                autoComplete="name"
                placeholder={tAuth('namePlaceholder') || 'e.g. John Doe'}
                error={Boolean(errors.name)}
                {...register('name')}
              />
            </FormField>

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
              helperText={tAuth('passwordHint') || 'At least 8 characters with 1 number'}
              required
            >
              <PasswordInput
                autoComplete="new-password"
                placeholder={tAuth('passwordPlaceholder') || 'Create a strong password'}
                error={Boolean(errors.password)}
                {...register('password')}
              />
            </FormField>

            <FormField
              label={tAuth('preferredLanguage') || 'Preferred Report Language'}
              error={errors.preferredLanguage?.message}
            >
              <Select
                {...register('preferredLanguage')}
                options={[
                  { value: 'EN', label: tAuth('languageEn') || 'English' },
                  { value: 'HI', label: tAuth('languageHi') || 'हिन्दी (Hindi)' },
                ]}
              />
            </FormField>

            <div className="pt-2">
              <Checkbox
                id="acceptedTerms"
                checked={acceptedTerms}
                onChange={(e) => setValue('acceptedTerms', e.target.checked, { shouldValidate: true })}
                error={Boolean(errors.acceptedTerms)}
                label={
                  <span className="text-xs text-body leading-relaxed">
                    {tAuth('acceptedTerms') || 'I agree to the'}{' '}
                    <Link href="/terms" target="_blank" className="font-semibold text-primary hover:underline">
                      {tAuth('termsLink') || 'Terms of Service'}
                    </Link>{' '}
                    &amp;{' '}
                    <Link href="/privacy" target="_blank" className="font-semibold text-primary hover:underline">
                      {tAuth('privacyLink') || 'Privacy Policy'}
                    </Link>
                  </span>
                }
              />
              {errors.acceptedTerms && (
                <p className="mt-1 text-xs text-danger font-medium" role="alert">
                  {errors.acceptedTerms.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isFullWidth
              className="mt-3 h-12 font-semibold shadow-card"
              isLoading={isSubmitting}
            >
              {isSubmitting ? tAuth('submitting') || 'Creating account...' : tAuth('submitRegister') || 'Get Started'}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center text-sm text-body">
            {tAuth('haveAccount') || 'Already have an account?'}{' '}
            <Link
              href={
                redirectUrl
                  ? `/login?redirect=${encodeURIComponent(redirectUrl)}${reason ? `&reason=${reason}` : ''}${productName ? `&product=${encodeURIComponent(productName)}` : ''}`
                  : '/login'
              }
              className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors"
            >
              {tAuth('submitLogin') || 'Sign In'}
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
              Scientific Diagnostics for Real Life
            </h3>
            <p className="text-sm text-body leading-relaxed mb-6">
              Create your account to take cognitive assessments, receive AI evaluation reports, and take control of your career and personal growth.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start space-x-3 text-xs text-heading font-medium">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>Instant, server auto-saved test progress</span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-heading font-medium">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>Zero spam, DPDP 2023 private data handling</span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-heading font-medium">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>Available anytime across web and mobile</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/80 flex items-center space-x-3 text-xs text-muted">
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Trusted by 10,000+ candidates across India</span>
          </div>
        </div>
      </div>
    </div>
  );
}
