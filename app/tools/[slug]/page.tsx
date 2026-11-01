import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { toolsRegistry } from '@/lib/tools/registry';
import { pageMetadata } from '@/lib/seo';
import UUIDGenerator from '@/components/tools/uuid-generator';
import Base64Tool from '@/components/tools/base64';
import JWTParser from '@/components/tools/jwt-parser';
import EpochConverter from '@/components/tools/epoch-converter';
import JsonFormatter from '@/components/tools/json-formatter';
import LoremGenerator from '@/components/tools/lorem-generator';
import CronParser from '@/components/tools/cron-parser';
import TextDiff from '@/components/tools/text-diff';
import SecretGenerator from '@/components/tools/secret-generator';
import Whiteboard from '@/components/tools/whiteboard';

const toolComponents: Record<string, React.ComponentType> = {
  'uuid-generator': UUIDGenerator,
  'base64': Base64Tool,
  'jwt-parser': JWTParser,
  'epoch-converter': EpochConverter,
  'json-formatter': JsonFormatter,
  'lorem-ipsum': LoremGenerator,
  'cron-parser': CronParser,
  'text-diff': TextDiff,
  'secret-generator': SecretGenerator,
  'whiteboard': Whiteboard,
};

export function generateStaticParams() {
  return toolsRegistry.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolsRegistry.find((t) => t.slug === slug);

  if (!tool) return {};

  return pageMetadata({
    title: tool.name,
    description: tool.description,
    path: `/tools/${tool.slug}`,
  });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolsRegistry.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const ToolComponent = toolComponents[slug];

  if (tool.fullscreen) {
    return (
      <>
        <h1 className="sr-only">{tool.name}</h1>
        <ToolComponent />
      </>
    );
  }

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