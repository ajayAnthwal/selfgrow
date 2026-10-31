import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-background text-body font-sans p-4">
        <div className="max-w-md w-full text-center bg-surface p-8 sm:p-10 rounded-lg shadow-card border border-border">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-light-blue flex items-center justify-center text-primary font-bold text-xl">
            404
          </div>
          <h1 className="text-2xl font-bold text-heading mb-2">Page Not Found</h1>
          <p className="text-sm text-body mb-6 leading-relaxed">
            The page you are looking for does not exist or may have been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/en"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-sm bg-primary text-white font-semibold hover:bg-primary-hover transition-colors text-sm shadow-xs"
            >
              Go to Homepage
            </Link>
            <Link
              href="/en/account"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-sm bg-surface-secondary text-heading font-semibold hover:bg-border transition-colors text-sm"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

