'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Tldraw, type TLComponents } from 'tldraw';
import 'tldraw/tldraw.css';

/** The canvas covers the site header, so this is the way back out. */
function BackToTools() {
  return (
    <Link
      href="/tools"
      className="pointer-events-auto m-2 flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-2.5 py-1 text-sm font-medium text-black hover:bg-black hover:text-white"
    >
      <ArrowLeft className="size-4" />
      Back to tools
    </Link>
  );
}

const components: TLComponents = {
  SharePanel: BackToTools,
};

export default function WhiteboardCanvas() {
  return (
    <Tldraw
      persistenceKey="devbench-whiteboard"
      colorScheme="light"
      components={components}
    />
  );
}
