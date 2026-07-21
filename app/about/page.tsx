export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-5xl font-bold mb-4">About DevBench.club</h1>
          <p className="text-xl text-muted-foreground">
            Small tools. No friction.
          </p>
        </div>

        <div className="space-y-6">
          <p className="text-lg">
            DevBench.club is a collection of developer tools, technical articles, and hands-on
            programming guides. Everything here is free, open, and runs directly in your browser.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">What You'll Find Here</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Browser-Based Tools</h3>
              <p className="text-foreground/80">
                Lightweight utilities like JWT decoders, UUID generators, Base64 encoders, 
                and more. Your data never leaves your browser.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Engineering Articles</h3>
              <p className="text-foreground/80">
                Practical writeups about backend systems, architecture decisions, debugging 
                techniques, and real-world development experience.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Hands-On Guides</h3>
              <p className="text-foreground/80">
                Step-by-step courses where we build real systems from scratch. No fluff, 
                just working code and clear explanations.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Why DevBench?</h2>
          <p className="text-foreground/80">
            Because developers deserve straightforward, practical resources without paywalls, 
            tracking, or unnecessary complexity. Just tools that work and knowledge that helps.
          </p>
        </div>
      </div>
    </div>
  );
}