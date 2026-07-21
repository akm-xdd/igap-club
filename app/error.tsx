'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const errorMessages = [
  "Something went sideways.",
  "The server had a moment.",
  "Code decided to misbehave.",
  "An unexpected exception occurred.",
  "The application hit a snag.",
  "Things broke in production.",
  "A bug escaped to the wild.",
  "Someone forgot a semicolon.",
  "The code is not speaking to us right now.",
];

const errorExcuses = [
  "Blame it on Mercury retrograde.",
  "The intern pushed directly to main.",
  "It worked in staging, we swear.",
  "A cosmic ray flipped a bit.",
  "Stack Overflow was down.",
  "Too much coffee, not enough testing.",
  "The rubber duck was on vacation.",
];

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [randomMessage] = useState(
    () => errorMessages[Math.floor(Math.random() * errorMessages.length)]
  );
  const [randomExcuse] = useState(
    () => errorExcuses[Math.floor(Math.random() * errorExcuses.length)]
  );

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div>
          <h1 className="text-6xl font-bold mb-4">Oops</h1>
          <h2 className="text-2xl font-semibold mb-2">{randomMessage}</h2>
          <p className="text-muted-foreground">
            An error occurred while processing your request.
          </p>
        </div>

        <div className="bg-muted/30 border-2 border-border p-6 rounded-lg text-left">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Likely reason
          </p>
          <p className="text-foreground italic">&ldquo;{randomExcuse}&rdquo;</p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={reset}>
            Try Again
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}