import { FeatureRequestForm } from '@/components/feature-request-form';
import { FEATURE_REQUESTS_OPEN, FEATURE_REQUESTS_CLOSED_MESSAGE } from '@/lib/config/feature-request';

export default function RequestFeaturePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto space-y-8">
        <div>
          <h1 className="text-5xl font-bold mb-4">Request a Feature</h1>
          <p className="text-muted-foreground">
            Got an idea for a tool, article, or improvement? Let us know.
          </p>
        </div>

        {FEATURE_REQUESTS_OPEN ? (
          <FeatureRequestForm />
        ) : (
          <div className="rounded-lg border-2 border-black bg-white p-4 shadow-[4px_4px_0_black]">
            <p className="text-sm">{FEATURE_REQUESTS_CLOSED_MESSAGE}</p>
          </div>
        )}
      </div>
    </div>
  );
}
