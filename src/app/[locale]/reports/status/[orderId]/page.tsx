'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { ReportStatusContainer } from './ReportStatusContainer';

export default function ReportStatusPage() {
  const params = useParams();
  const orderId = String(params?.orderId || '');

  if (!orderId) {
    notFound();
  }

  return <ReportStatusContainer orderId={orderId} />;
}

