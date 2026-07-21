export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: March 2026</p>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">No Data Collection</h2>
            <p className="text-foreground/80">
              DevBench Club does not collect, store, or track any personal information. We do not
              use cookies, analytics, or any tracking technologies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Browser-Based Tools</h2>
            <p className="text-foreground/80">
              All tools on this site run entirely in your browser. Data you input into tools 
              (JWT tokens, passwords, text to encode, etc.) never leaves your device. We have 
              no access to this data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
            <p className="text-foreground/80">
              This site is hosted on Vercel. While we don't collect data, Vercel may collect 
              basic server logs (IP addresses, request times) for infrastructure purposes. 
              Refer to Vercel's privacy policy for details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Your Privacy</h2>
            <p className="text-foreground/80">
              We believe in privacy by design. No accounts, no tracking, no newsletters. 
              Just free tools and content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to Privacy Policy</h2>
            <p className="text-foreground/80">
              If we ever change our privacy practices, we will update this page. Currently, 
              we collect nothing and plan to keep it that way.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}