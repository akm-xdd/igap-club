import { notFound } from 'next/navigation';
import { toolsRegistry } from '@/lib/tools/registry';
import UUIDGenerator from '@/components/tools/uuid-generator';
import Base64Tool from '@/components/tools/base64';
import JWTParser from '@/components/tools/jwt-parser';
import EpochConverter from '@/components/tools/epoch-converter';
import JsonFormatter from '@/components/tools/json-formatter';
import LoremGenerator from '@/components/tools/lorem-generator';

const toolComponents: Record<string, React.ComponentType> = {
  'uuid-generator': UUIDGenerator,
  'base64': Base64Tool,
  'jwt-parser': JWTParser,
  'epoch-converter': EpochConverter,
  'json-formatter': JsonFormatter,
  'lorem-ipsum': LoremGenerator,
};

export function generateStaticParams() {
  return toolsRegistry.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolsRegistry.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const ToolComponent = toolComponents[slug];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">{tool.name}</h1>
        <p className="text-muted-foreground mb-12">{tool.description}</p>
        <ToolComponent />
      </div>
    </div>
  );
}