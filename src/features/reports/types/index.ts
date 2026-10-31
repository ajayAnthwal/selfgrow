export type ReportStatus =
  | 'QUEUED'
  | 'GENERATING'
  | 'GENERATED'
  | 'PENDING_REVIEW'
  | 'RELEASED'
  | 'FAILED'
  | 'REJECTED';

export interface ReportItem {
  id: string;
  orderId: string;
  status: ReportStatus;
  language: 'EN' | 'HI';
  productName?: any;
  productSlug?: string;
  createdAt: string;
  generatedAt?: string | null;
  releasedAt?: string | null;
  content?: any;
}

export interface DownloadReportResponse {
  downloadUrl: string;
  expiresInSeconds: number;
}

export interface PaginatedReportsResponse {
  items: ReportItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

