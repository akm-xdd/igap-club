import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero */}
      <section className="py-24 text-center max-w-3xl mx-auto">
        <div className="mb-4">
          <h1 className="text-6xl font-bold mb-2">DevBench.club</h1>
          <p className="text-lg text-muted-foreground">
            Small tools. No friction.
          </p>
        </div>
        <p className="text-xl text-muted-foreground mb-12">
          Practical developer utilities, technical articles, and
          follow-along engineering guides. No paywalls, no ads, no BS.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/blog">
            <Button size="lg">
              Read Articles
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
          <Link href="/tools">
            <Button variant="outline" size="lg">
              Explore Tools
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-4xl mx-auto grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-xl font-semibold mb-3">Developer Utilities</h3>
          <p className="text-muted-foreground">
            Lightweight tools that run entirely in your browser.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">Engineering Articles</h3>
          <p className="text-muted-foreground">
            Practical guides to backend systems, architecture decisions, and real world techniques.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">Hands-On Guides</h3>
          <p className="text-muted-foreground">
            Follow step-by-step as we build real stuff with no paywalls.
          </p>
        </div>
      </section>

    </div>
  );
}