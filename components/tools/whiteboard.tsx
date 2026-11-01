'use client';

import dynamic from 'next/dynamic';

// tldraw touches window/localStorage on load, so render it only in the browser.
const WhiteboardCanvas = dynamic(() => import('@/components/tools/whiteboard-canvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-black/40">
      Loading whiteboard…
    </div>
  ),
});

export default function Whiteboard() {
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <WhiteboardCanvas />
    </div>
  );
}
