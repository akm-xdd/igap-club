import Link from 'next/link';
import { toolsRegistry } from '@/lib/tools/registry';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Developer Tools</h1>
        <p className="text-muted-foreground mb-12">
          Browser-based utilities. We don't store any of this data. Pinky promise.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {toolsRegistry.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card className="hover:border-foreground/20 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle>{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}