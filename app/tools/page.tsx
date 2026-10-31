import type { Metadata } from 'next';
import { toolsRegistry } from '@/lib/tools/registry';
import { ToolsSearch } from '@/components/tools-search';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Developer Tools',
  description:
    'Browser-based developer utilities that run entirely on your machine. Nothing is uploaded or stored.',
  path: '/tools',
});

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Developer Tools</h1>
        <p className="text-muted-foreground mb-12">
          Browser-based utilities. We don&apos;t store any of this data. Pinky promise.
        </p>

        <ToolsSearch tools={toolsRegistry} />
      </div>
    </div>
  );
}