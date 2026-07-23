import { toolsRegistry } from '@/lib/tools/registry';
import { ToolsSearch } from '@/components/tools-search';

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