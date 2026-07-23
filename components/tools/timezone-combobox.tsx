'use client';

import { useMemo, useRef, useState } from 'react';
import { Popover } from 'radix-ui';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimezoneComboboxProps {
  timezones: string[];
  value: string;
  onChange: (timezone: string) => void;
  placeholder?: string;
}

export function TimezoneCombobox({
  timezones,
  value,
  onChange,
  placeholder = 'Select timezone',
}: TimezoneComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return timezones;
    return timezones.filter((tz) => tz.toLowerCase().includes(q));
  }, [timezones, query]);

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setQuery('');
          requestAnimationFrame(() => inputRef.current?.focus());
        }
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex h-8 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-black/20 bg-white px-2.5 text-sm text-black outline-none focus-visible:ring-3 focus-visible:ring-black/20"
        >
          <span className={cn('truncate', !value && 'text-black/50')}>
            {value || placeholder}
          </span>
          <ChevronsUpDown size={14} className="shrink-0 text-black/50" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 w-[--radix-popover-trigger-width] overflow-hidden rounded-lg border-2 border-black bg-white text-black shadow-[4px_4px_0_black]"
        >
          <div className="border-b border-black/20 p-1.5">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search timezone..."
              className="h-7 w-full rounded-md bg-transparent px-1.5 text-sm text-black outline-none placeholder:text-black/50"
            />
          </div>
          <div className="max-h-64 overflow-y-auto bg-white p-1">
            {filtered.length === 0 && (
              <p className="px-2 py-4 text-center text-sm text-black/50">
                No timezone found
              </p>
            )}
            {filtered.map((tz) => (
              <button
                key={tz}
                type="button"
                onClick={() => {
                  onChange(tz);
                  setOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-black hover:bg-black/5"
              >
                <Check
                  size={14}
                  className={cn('shrink-0', tz === value ? 'opacity-100' : 'opacity-0')}
                />
                <span className="truncate">{tz}</span>
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
