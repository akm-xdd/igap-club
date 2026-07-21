'use client';

import { useMemo, useState } from 'react';
import { Popover } from 'radix-ui';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface Parsed {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function parseValue(value: string): Parsed | null {
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  return { year: +y, month: +mo, day: +d, hour: +h, minute: +mi };
}

function formatValue(p: Parsed): string {
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

function nowParsed(): Parsed {
  const d = new Date();
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
  };
}

function formatDisplay(p: Parsed): string {
  const date = new Date(p.year, p.month - 1, p.day, p.hour, p.minute);
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

interface CalendarCell {
  year: number;
  month: number;
  day: number;
  current: boolean;
}

function getCalendarDays(year: number, month: number): CalendarCell[] {
  const first = new Date(year, month - 1, 1);
  const start = new Date(year, month - 1, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      current: d.getMonth() + 1 === month,
    };
  });
}

export function DateTimePicker({ value, onChange, placeholder = 'Pick a date & time', className }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = parseValue(value);
  const [viewYear, setViewYear] = useState(parsed?.year ?? new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? new Date().getMonth() + 1);

  const days = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(
    new Date(viewYear, viewMonth - 1, 1)
  );

  const changeMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  };

  const selectDay = (cell: CalendarCell) => {
    onChange(formatValue({
      year: cell.year,
      month: cell.month,
      day: cell.day,
      hour: parsed?.hour ?? 0,
      minute: parsed?.minute ?? 0,
    }));
    setViewYear(cell.year);
    setViewMonth(cell.month);
  };

  const setTime = (hour: number, minute: number) => {
    const base = parsed ?? { ...nowParsed() };
    onChange(formatValue({ year: base.year, month: base.month, day: base.day, hour, minute }));
  };

  const goToNow = () => {
    const p = nowParsed();
    onChange(formatValue(p));
    setViewYear(p.year);
    setViewMonth(p.month);
  };

  const clear = () => onChange('');

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-8 items-center gap-2 rounded-lg border-2 border-black bg-white px-2.5 text-sm text-black shadow-[3px_3px_0_black] outline-none transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_black]',
            className
          )}
        >
          <Calendar size={14} className="shrink-0" />
          <span className={cn(!parsed && 'text-black/50')}>
            {parsed ? formatDisplay(parsed) : placeholder}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 flex overflow-hidden rounded-lg border-2 border-black bg-white text-black shadow-[4px_4px_0_black]"
        >
          <div className="w-64 p-3">
            <div className="mb-2 flex items-center justify-between">
              <button type="button" onClick={() => changeMonth(-1)} className="rounded-md p-1 hover:bg-black/5">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium">{monthLabel}</span>
              <button type="button" onClick={() => changeMonth(1)} className="rounded-md p-1 hover:bg-black/5">
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((wd) => (
                <span key={wd} className="flex h-7 items-center justify-center text-xs text-black/50">
                  {wd}
                </span>
              ))}
              {days.map((cell, i) => {
                const isSelected =
                  parsed && parsed.year === cell.year && parsed.month === cell.month && parsed.day === cell.day;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectDay(cell)}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-md text-sm',
                      !cell.current && 'text-black/30',
                      cell.current && !isSelected && 'hover:bg-black/5',
                      isSelected && 'bg-black text-white font-medium'
                    )}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-2 text-sm">
              <button type="button" onClick={clear} className="text-black/60 hover:text-black">
                Clear
              </button>
              <button type="button" onClick={goToNow} className="font-medium hover:underline">
                Now
              </button>
            </div>
          </div>

          <div className="flex w-24 flex-col border-l-2 border-black">
            <div className="grid grid-cols-2 divide-x-2 divide-black/10 border-b-2 border-black text-center text-xs font-medium">
              <span className="py-1.5">HH</span>
              <span className="py-1.5">MM</span>
            </div>
            <div className="grid grid-cols-2 divide-x-2 divide-black/10">
              <div className="h-48 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {Array.from({ length: 24 }, (_, h) => h).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setTime(h, parsed?.minute ?? 0)}
                    className={cn(
                      'flex w-full items-center justify-center py-1.5 text-sm hover:bg-black/5',
                      parsed?.hour === h && 'bg-black text-white font-medium hover:bg-black'
                    )}
                  >
                    {pad(h)}
                  </button>
                ))}
              </div>
              <div className="h-48 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {Array.from({ length: 60 }, (_, m) => m).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTime(parsed?.hour ?? 0, m)}
                    className={cn(
                      'flex w-full items-center justify-center py-1.5 text-sm hover:bg-black/5',
                      parsed?.minute === m && 'bg-black text-white font-medium hover:bg-black'
                    )}
                  >
                    {pad(m)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
