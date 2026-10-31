# Antigravity Assessment Platform - Frontend

Modern, bilingual (English & Hindi) Next.js App Router frontend for the AI-integrated Assessment and Diagnostic Platform.

---

## Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router) with strict TypeScript
- **Styling**: Tailwind CSS with custom design tokens (`brand`, `calm`) and Google fonts (`Inter`, `Noto Sans Devanagari`)
- **State Management**: TanStack React Query v5 for server state & caching
- **Forms**: `react-hook-form` with `zod` schema validation
- **Internationalization (i18n)**: `next-intl` with locale-prefixed routes (`/en`, `/hi`) and synchronized cookie support (`NEXT_LOCALE`)
- **API Client**: Single typed fetch wrapper (`src/lib/api/client.ts`) with types generated directly from backend OpenAPI specs (`openapi-typescript`), credentials support (`httpOnly` cookies), and single-flight token refresh on 401
- **Testing**: Vitest with `@testing-library/react` and `jsdom`

---

## Directory Structure

```
frontend/
├── scripts/
│   └── generate-api-types.cjs        # OpenAPI -> TypeScript type generator
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx    # Sign In with return redirect
│   │   │   │   └── register/page.tsx # Registration with consent & language select
│   │   │   ├── (public)/
│   │   │   │   ├── page.tsx          # Landing page with hero, how-it-works & featured
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx      # Assessment catalog
│   │   │   │   │   └── [slug]/page.tsx # Product details & evaluation format
│   │   │   │   ├── privacy/page.tsx  # Bilingual Privacy policy
│   │   │   │   ├── terms/page.tsx    # Bilingual Terms of Service
│   │   │   │   └── contact/page.tsx  # Support & inquiries
│   │   │   ├── admin/                # Phase 11: Comprehensive Administration Portal
│   │   │   │   ├── layout.tsx        # RequireRole ADMIN guard + AdminLayout
│   │   │   │   ├── page.tsx          # Real-time dashboard analytics with Recharts
│   │   │   │   ├── orders/           # Orders & payments table, detail drawer, CSV export
│   │   │   │   ├── customers/        # Customer accounts, orders/attempts history, deactivate/activate
│   │   │   │   ├── attempts/         # Candidate attempts and readable response inspector
│   │   │   │   ├── assessments/      # Assessment CRUD, version notice, question editor & reordering
│   │   │   │   ├── products/         # Product catalog, rupee input (stored as paise), price change dialog
│   │   │   │   ├── templates/        # Versioned report templates, system/user prompt pills, JSON schema
│   │   │   │   ├── reports/          # Report review workflow (Release, Regenerate, Reject, Diff)
│   │   │   │   ├── audit-logs/       # Immutable audit logs with before/after state diff
│   │   │   │   └── system/           # Telemetry, queue backlog, failed jobs, pool status
│   │   │   ├── assessment/
│   │   │   │   ├── start/[productSlug]/ # Pre-test briefing & resume gate
│   │   │   │   └── attempt/[attemptId]/ # Interactive questionnaire & /done flow
│   │   │   ├── checkout/[attemptId]/ # Razorpay + Free payment flow
│   │   │   ├── reports/
│   │   │   │   └── status/[orderId]/ # Real-time report status tracking & PDF download
│   │   │   ├── account/              # Unified candidate account area
│   │   │   │   ├── layout.tsx        # Shared tabs layout
│   │   │   │   ├── page.tsx          # Profile & preferred language preferences
│   │   │   │   ├── orders/           # Paginated order history & order details
│   │   │   │   └── reports/          # Paginated reports list & PDF download
│   │   │   ├── error.tsx             # Global error boundary
│   │   │   ├── layout.tsx            # Locale root layout with providers
│   │   │   └── not-found.tsx         # Translated 404 handler
│   │   ├── globals.css
│   │   └── layout.tsx                # Base shell layout
│   ├── components/
│   │   ├── layout/                   # Header, Footer, LanguageSwitcher
│   │   └── ui/                       # Reusable UI primitives (Button, Modal, StatusBadge, Pagination, etc.)
│   ├── features/
│   │   ├── auth/                     # AuthContext, hooks, login & register schemas
│   │   ├── products/                 # ProductCard & catalog components
│   │   ├── assessment/               # Full Assessment Engine (Auto-save, Server Timer, Palette)
│   │   ├── checkout/                 # OrderSummaryCard, Razorpay loader & modal orchestrator
│   │   ├── orders/                   # Orders API hooks, types & order mappers
│   │   └── reports/                  # ReportStatusTracker, reports API hooks, download mutations
│   ├── i18n/                         # routing.ts & request.ts for next-intl
│   ├── lib/
│   │   ├── api/client.ts             # Typed API client with auto 401 refresh
│   │   ├── providers/                # QueryProvider
│   │   └── utils/                    # cn, formatMoney, errors
│   ├── messages/                     # en.json & hi.json translation dictionaries
│   ├── middleware.ts                 # Route localization & auth route guards
│   └── types/api.d.ts                # Auto-generated backend OpenAPI schema types
└── tests/                            # 40 Unit & Integration tests (Vitest + Testing Library)
```

---

## Phase 10: Checkout, Orders, Reports & PDF Delivery

### 1. Payment & Checkout Architecture (`src/features/checkout`)
- **Strict Server Authority**: The client never computes, alters, or trusts prices. Amount is always derived directly from the server order response.
- **Free Flow**: For zero-rupee products or already-paid attempts, the gateway is bypassed completely, directing candidates straight to report status tracking.
- **Razorpay Modal Wrapper (`lib/razorpay.ts`)**: Single idempotent script injector for `checkout.js` with an awaitable `openRazorpayCheckout` function.
- **Retry & Recovery**: Dismissing the payment window preserves the active unpaid order to avoid duplicate database rows. If network failure interrupts the verification request, the UI displays a reassuring confirmation state and relies on server polling / webhooks.

### 2. Live Report Tracking & Status Stepper (`src/features/reports`)
- **Refetch Interval with Backoff**: Begins polling every 3 seconds, backs off to 10 seconds, pauses when the browser tab is hidden (`document.visibilityState === 'hidden'`), and halts cleanly upon reaching a terminal state (`RELEASED`, `FAILED`, `REJECTED`) or after 10 minutes.
- **Status Stepper (`ReportStatusTracker`)**: Visual 3-step timeline (`Payment Verified` -> `AI Analysis` -> `Report Ready`) with screen-reader announcements.
- **Secure PDF Delivery**: The download button requests a short-lived HMAC-signed URL via `GET /api/v1/reports/:id/download`, never exposing permanent file storage paths.

### 3. Unified Candidate Account Area (`src/app/[locale]/account`)
- **Profile & Language Sync**: Updates candidate preferred language across user profile and active `NEXT_LOCALE` cookie.
- **Order History**: Paginated orders list with transaction receipts and links to diagnostic reports.
- **Reports Vault**: Comprehensive list of candidate reports with instant status inspection and one-click PDF downloads.

### 4. Content Security Policy (CSP)
Configured strict security headers in `next.config.mjs` permitting only required Razorpay origins:
- `script-src`: `'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com`
- `frame-src`: `'self' https://api.razorpay.com https://checkout.razorpay.com`
- `connect-src`: `'self' https://api.razorpay.com https://lumberjack.razorpay.com http://localhost:5000`

---

## Setup & Getting Started

### 1. Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BACKEND_URL="http://localhost:5000"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate API Types (Optional / On Backend Changes)
When the backend OpenAPI specification updates:
```bash
npm run gen:api
```

### 4. Running Tests
```bash
npm test
```

### 5. Production Build
```bash
npm run build
npm run start
```

---

## Phase 11: Admin Portal & Management Suite

The Administration Portal (`/[locale]/admin`) provides an administrative workspace protected by dual-layer security:
1. **Edge Middleware Guard**: Path-level route protection in `src/middleware.ts` redirecting unauthenticated traffic to login with return URLs.
2. **Client-Side Role Authority Guard (`RequireRole`)**: Explicit validation verifying `user.role === 'ADMIN'`. Non-administrative users are served a translated 403 Forbidden screen.

### Core Modules & Primitives:
- **Dashboard Analytics**: Real-time KPI StatCards with daily revenue trend (AreaChart), daily user registrations (BarChart), and revenue per product (BarChart) via Recharts. 30-second auto-refresh paused when the browser tab is hidden.
- **Orders & Payments**: Server-side paginated DataTable with status filters, customer search, detailed payment ledger modal, and formula-injection-safe CSV exports.
- **Customers**: Candidate management with search, order & attempt history inspection, and safe self-deactivation prevention with confirmation dialogs.
- **Attempt Responses Inspector**: Read-only assessment review displaying questions, chosen option labels, candidate text answers, and elapsed response times grouped by section.
- **Assessments & Question Editor**: Benchmark creator with version impact warning banners, sequential question reordering (with accessible keyboard up/down controls), question bank management, and score assignment.
- **Products & Pricing**: Bilingual product catalog management where rupee values are automatically converted to integer paise (`rupeesToPaise` / `paiseToRupees`) with a confirmation dialog on price changes.
- **Report Templates**: Versioned AI prompt configurations with interactive placeholder pill inserters (`{{candidateName}}`, `{{scoreSummary}}`, etc.) and client-side JSON schema validation.
- **Report Review Workflow**: Status tabs with highlighted pending review & failure counts, rendered section views, revision diff inspector, in-browser structured JSON editor, PDF preview, and confirmation dialogs requiring mandatory reason text for regeneration and rejection.
- **Audit Logs & Telemetry**: Immutable before/after mutation diff inspector with actor tracking, alongside real-time system health telemetry (queue backlogs, failed jobs, pool status).

### Backend Gaps Discovered (Preserved Without Backend Code Changes):
1. **OpenAPI Specification Gap for Admin Sub-routers**:
   - `backend/openapi.json` documents `/api/v1/admin/users`, `/api/v1/admin/orders`, `/api/v1/admin/attempts`, `/api/v1/admin/reports`, `/api/v1/admin/dashboard/summary`, `/api/v1/admin/audit-logs`, and `/api/v1/admin/system/status`.
   - However, the Express sub-routers mounted in `backend/src/app.ts` (`/api/v1/admin/assessments`, `/api/v1/admin/products`, `/api/v1/admin/report-templates`, and `/api/v1/admin/questions`) are missing OpenAPI schema definitions in `openapi.json`. The frontend interacts with these fully functional endpoints via typed client wrappers matching their route schemas.
2. **System Status Response Schema Variance**:
   - The OpenAPI spec for `/api/v1/admin/system/status` indicates `queue.lastSuccessfulReportAt`, whereas the Express controller returns `lastSuccessfulReportTime` at the root object level. The frontend accommodates both property formats defensively.

