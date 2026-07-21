export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-5xl font-bold mb-4">Terms of Use</h1>
          <p className="text-muted-foreground">Last updated: March 2026</p>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Acceptance of Terms</h2>
            <p className="text-foreground/80">
              By accessing and using DevBench Club, you accept and agree to be bound by these terms.
              If you do not agree, please do not use this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Use of Tools</h2>
            <p className="text-foreground/80">
              All developer tools on this site run entirely in your browser. We do not collect, 
              store, or transmit any data you input into these tools. Use them at your own discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Content</h2>
            <p className="text-foreground/80">
              Articles, guides, and code examples are provided for educational purposes. While we 
              strive for accuracy, we make no guarantees about the completeness or reliability of 
              the content. Always test and verify before using in production.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
            <p className="text-foreground/80">
              DevBench Club and its contributors are not liable for any damages arising from the use
              or inability to use this site or its tools. Use everything at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to Terms</h2>
            <p className="text-foreground/80">
              We may update these terms at any time. Continued use of the site constitutes 
              acceptance of any changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}