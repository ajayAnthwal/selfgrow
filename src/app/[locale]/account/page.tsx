'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/features/auth/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api/client';
import { User, Mail, Globe, Shield, Sparkles, ArrowRight, FileText, ShoppingBag } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function AccountProfilePage() {
  const tAuth = useTranslations('auth');
  const tAccount = useTranslations('account');
  const { user, refetchUser } = useAuth();
  const { toast } = useToast();

  const [preferredLang, setPreferredLang] = useState<'EN' | 'HI'>(
    user?.preferredLanguage || 'EN'
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await api.patch('/users/me', {
        preferredLanguage: preferredLang,
      });
      // Sync cookie
      document.cookie = `NEXT_LOCALE=${preferredLang.toLowerCase()}; path=/; max-age=31536000; SameSite=Lax`;
      await refetchUser();
      toast(tAccount('profileUpdated'), 'success');
    } catch {
      toast('Failed to update preferences', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Quick Launch Assessment Banner */}
      <Card className="p-6 sm:p-7 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl shadow-md border-0 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center space-x-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-xs font-semibold text-blue-200 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Available Assessments</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Ready to take your Diagnostic Assessment?
            </h2>
            <p className="text-xs text-blue-100 leading-relaxed">
              Explore our psychometric frameworks, complete timed questions, unlock verified AI diagnostic reports, and download instant PDFs.
            </p>
          </div>
          <Link href="/products" className="shrink-0">
            <Button
              variant="primary"
              size="md"
              className="bg-white text-blue-950 hover:bg-blue-50 font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Explore Assessments</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Two Column Grid: Profile + Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-2">
          <Card className="p-6 sm:p-8 border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Profile Information</h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <User className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Full Name</div>
                  <div className="text-sm font-bold text-slate-900">{user?.name}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Email Address</div>
                  <div className="text-sm font-bold text-slate-900">{user?.email}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Shield className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Account Role</div>
                  <div className="text-sm font-bold text-slate-900">{user?.role}</div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-brand-600" />
                <span>{tAuth('preferredLanguage')}</span>
              </h3>

              <div className="max-w-xs space-y-3">
                <Select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value as 'EN' | 'HI')}
                  options={[
                    { value: 'EN', label: tAuth('languageEn') },
                    { value: 'HI', label: tAuth('languageHi') },
                  ]}
                />

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSavePreferences}
                  isLoading={isSaving}
                >
                  {tAccount('savePreferences')}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Fast Dashboard Links */}
        <div className="space-y-4">
          <Card className="p-5 border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Navigation</h3>
            <div className="space-y-2">
              <Link
                href="/account/reports"
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-800">My Reports</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-800">Order Receipts</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

