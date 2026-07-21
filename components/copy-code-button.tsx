'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyCodeButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-md border-2 border-white/20 bg-black/40 text-white/70 opacity-0 transition-opacity hover:text-white group-hover:opacity-100"
      aria-label="Copy code"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}
