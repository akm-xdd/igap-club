import Link from "next/link";
import { Button } from "@/components/ui/button";

const excuses = [
  "Works on my machine.",
  "Someone pushed to production on Friday.",
  "The route was refactored and never updated.",
  "A merge conflict won.",
  "The file was never committed.",
  "The cache betrayed us.",
  "DNS probably did something weird.",
  "A developer said 'I'll fix it later'.",
  "This page was lost during a refactor."
];

const devTips = [
  "JWT payloads are base64 encoded, not encrypted.",
  "Never commit secrets to git.",
  "Always validate external input.",
  "Index your database before blaming the ORM.",
  "Rate limit public APIs.",
  "Avoid storing large objects in JWT tokens.",
  "Use idempotency for payment APIs.",
  "Prefer explicit types over implicit assumptions.",
  "Logging is cheaper than debugging production.",
];

export default function NotFound() {
  const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
  const randomTipIndex = Math.floor(Math.random() * devTips.length);
  const randomTip = devTips[randomTipIndex];
  const randomTipNumber = Math.floor(Math.random() * 100) + 1;

  return (
    <div className="container mx-auto px-4 py-24 min-h-[80vh] flex flex-col">
      <div className="max-w-2xl mx-auto text-center space-y-8 flex-1 flex flex-col justify-center">
        <div>
          <h1 className="text-9xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Route not found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
        </div>

        <div className="bg-muted/30 border-2 border-border p-6 rounded-lg text-left">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Possible explanation
          </p>
          <p className="text-foreground italic">"{randomExcuse}"</p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button size="lg">Back to Home</Button>
          </Link>
          <Link href="/tools">
            <Button variant="outline" size="lg">Browse Tools</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-12 border-t pt-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Dev tip #{randomTipNumber}
        </p>
        <p className="text-sm text-muted-foreground">{randomTip}</p>
      </div>
    </div>
  );
}