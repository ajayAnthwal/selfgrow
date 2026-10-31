'use client';

import React from 'react';
import { RequireRole } from '@/features/admin/components/RequireRole';
import { AdminLayout } from '@/features/admin/components/AdminLayout';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole role="ADMIN">
      <AdminLayout>{children}</AdminLayout>
    </RequireRole>
  );
}

