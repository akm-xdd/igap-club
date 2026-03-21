'use client';

import { useState } from 'react';
import { generateUUID, generateBulkUUIDs } from '@/lib/tools/uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';

export default function UUIDGenerator() {
  const [uuid, setUuid] = useState('');
  const [count, setCount] = useState(5);
  const [bulkUuids, setBulkUuids] = useState('');

  const handleGenerate = () => {
    setUuid(generateUUID());
  };

  const handleBulkGenerate = () => {
    const uuids = generateBulkUUIDs(count);
    setBulkUuids(uuids.join('\n'));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Single UUID</h2>
        <div className="flex gap-2">
          <Input value={uuid} readOnly placeholder="Click generate" />
          <Button onClick={handleGenerate}>Generate</Button>
          {uuid && (
            <Button variant="outline" size="icon" onClick={() => copyToClipboard(uuid)}>
              <Copy size={16} />
            </Button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Bulk Generate</h2>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            min={1}
            max={1000}
            className="w-24"
          />
          <Button onClick={handleBulkGenerate}>Generate {count} UUIDs</Button>
        </div>
        {bulkUuids && (
          <div className="relative">
            <Textarea value={bulkUuids} readOnly rows={10} />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(bulkUuids)}
            >
              <Copy size={16} />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}