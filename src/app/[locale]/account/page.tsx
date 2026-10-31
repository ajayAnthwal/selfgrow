'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/features/auth/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api/client';
import { User, Mail, Globe, Shield } from 'lucide-react';

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
    <div className="max-w-2xl space-y-6">
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
  );
}

