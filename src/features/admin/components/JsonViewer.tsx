'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface JsonViewerProps {
  data: any;
  title?: string;
  maxHeight?: string;
}

export function JsonViewer({ data, title, maxHeight = 'max-h-96' }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const formatted = React.useMemo(() => {
    try {
      if (typeof data === 'string') {
        return JSON.stringify(JSON.parse(data), null, 2);
      }
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }, [data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-900 text-neutral-100 dark:border-neutral-800">
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-400">
        <span className="font-mono">{title || 'JSON Payload'}</span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-7 px-2 text-xs text-neutral-300 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="mr-1 h-3.5 w-3.5 text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="mr-1 h-3.5 w-3.5" /> Copy
            </>
          )}
        </Button>
      </div>
      <pre
        className={`overflow-auto p-3 text-xs font-mono leading-relaxed text-emerald-400 selection:bg-neutral-800 ${maxHeight}`}
      >
        <code>{formatted}</code>
      </pre>
    </div>
  );
}

