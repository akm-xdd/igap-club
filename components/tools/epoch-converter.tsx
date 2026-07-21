'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TimezoneCombobox } from '@/components/tools/timezone-combobox';
import { DateTimePicker } from '@/components/tools/datetime-picker';
import { Copy, X } from 'lucide-react';
import {
  formatEpochInTimeZone,
  formatEpochMs,
  getTimeZoneOffsetLabel,
  listTimezones,
  nowEpoch,
  parseEpoch,
  zonedDateTimeToEpochMs,
  type EpochFormats,
  type EpochUnit,
} from '@/lib/tools/epoch';

function copy(text: string) {
  navigator.clipboard.writeText(text);
}

function EpochToTimestamp() {
  const [epochInput, setEpochInput] = useState('');
  const [unit, setUnit] = useState<EpochUnit>('seconds');
  const [result, setResult] = useState<EpochFormats | null>(null);
  const [error, setError] = useState('');

  const handleConvert = (raw: string, forcedUnit?: EpochUnit) => {
    setEpochInput(raw);
    setError('');
    if (!raw.trim()) {
      setResult(null);
      return;
    }
    try {
      const parsed = parseEpoch(raw, forcedUnit);
      setUnit(parsed.unit);
      setResult(formatEpochMs(parsed.ms));
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : 'Invalid epoch value');
    }
  };

  const handleUnitToggle = (next: EpochUnit) => {
    setUnit(next);
    if (epochInput.trim()) handleConvert(epochInput, next);
  };

  const useNow = () => {
    const { seconds, ms } = nowEpoch();
    const value = unit === 'seconds' ? seconds : ms;
    handleConvert(String(value), unit);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Epoch → Timestamp</h2>

      <div className="flex gap-2">
        <Input
          value={epochInput}
          onChange={(e) => handleConvert(e.target.value)}
          placeholder="e.g. 1735689600"
          className="font-mono"
        />
        <Button variant="outline" onClick={useNow}>Now</Button>
      </div>

      <div className="flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => handleUnitToggle('seconds')}
          className={`rounded-md px-2 py-1 ${unit === 'seconds' ? 'bg-muted font-medium' : 'text-muted-foreground'}`}
        >
          Seconds
        </button>
        <button
          type="button"
          onClick={() => handleUnitToggle('milliseconds')}
          className={`rounded-md px-2 py-1 ${unit === 'milliseconds' ? 'bg-muted font-medium' : 'text-muted-foreground'}`}
        >
          Milliseconds
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="grid gap-2 sm:grid-cols-2">
          {(
            [
              ['Local', result.local],
              ['UTC', result.utc],
              ['ISO 8601', result.iso],
              ['Relative', result.relative],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="truncate text-sm font-mono">{value}</p>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => copy(value)}>
                <Copy size={13} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TimestampToEpoch() {
  const [dateTime, setDateTime] = useState('');
  const [seconds, setSeconds] = useState<number | null>(null);
  const [ms, setMs] = useState<number | null>(null);

  const handleChange = (value: string) => {
    setDateTime(value);
    if (!value) {
      setSeconds(null);
      setMs(null);
      return;
    }
    const local = new Date(value);
    if (Number.isNaN(local.getTime())) {
      setSeconds(null);
      setMs(null);
      return;
    }
    setMs(local.getTime());
    setSeconds(Math.floor(local.getTime() / 1000));
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Timestamp → Epoch</h2>
      <p className="text-sm text-muted-foreground">Uses your browser&apos;s local timezone.</p>

      <DateTimePicker value={dateTime} onChange={handleChange} />

      {seconds !== null && ms !== null && (
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ['Seconds', String(seconds)],
            ['Milliseconds', String(ms)],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="truncate text-sm font-mono">{value}</p>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => copy(value)}>
                <Copy size={13} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const browserTimeZone = typeof Intl !== 'undefined'
  ? Intl.DateTimeFormat().resolvedOptions().timeZone
  : 'UTC';

function TimezoneComparison() {
  const timezones = useMemo(() => listTimezones(), []);
  const [dateTime, setDateTime] = useState('');
  const [baseZone, setBaseZone] = useState(browserTimeZone);
  const [compareZones, setCompareZones] = useState<string[]>([]);

  const baseEpochMs = useMemo(() => {
    if (!dateTime) return null;
    const match = dateTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!match) return null;
    const [, y, mo, d, h, mi] = match;
    return zonedDateTimeToEpochMs(Number(y), Number(mo), Number(d), Number(h), Number(mi), baseZone);
  }, [dateTime, baseZone]);

  const addCompareZone = () => {
    if (compareZones.length >= 3) return;
    const next = timezones.find((tz) => tz !== baseZone && !compareZones.includes(tz)) ?? timezones[0];
    setCompareZones([...compareZones, next]);
  };

  const updateCompareZone = (index: number, tz: string) => {
    setCompareZones(compareZones.map((z, i) => (i === index ? tz : z)));
  };

  const removeCompareZone = (index: number) => {
    setCompareZones(compareZones.filter((_, i) => i !== index));
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Timezone Comparison</h2>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Date &amp; time &nbsp;</label>
          <DateTimePicker value={dateTime} onChange={setDateTime} />
        </div>
        <div className="w-56 space-y-1.5">
          <label className="text-sm font-medium">Base timezone</label>
          <TimezoneCombobox timezones={timezones} value={baseZone} onChange={setBaseZone} />
        </div>
      </div>

      {baseEpochMs !== null && (
        <>
          <Separator />
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="truncate">{baseZone}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {getTimeZoneOffsetLabel(baseEpochMs, baseZone)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-sm">{formatEpochInTimeZone(baseEpochMs, baseZone)}</p>
              </CardContent>
            </Card>

            {compareZones.map((tz, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2 text-base">
                    <div className="min-w-0 flex-1">
                      <TimezoneCombobox
                        timezones={timezones}
                        value={tz}
                        onChange={(next) => updateCompareZone(index, next)}
                      />
                    </div>
                    <span className="shrink-0 text-xs font-normal text-muted-foreground">
                      {getTimeZoneOffsetLabel(baseEpochMs, tz)}
                    </span>
                    <Button variant="ghost" size="icon-sm" onClick={() => removeCompareZone(index)}>
                      <X size={14} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-sm">{formatEpochInTimeZone(baseEpochMs, tz)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {compareZones.length < 3 && (
        <Button variant="outline" onClick={addCompareZone} disabled={!dateTime}>
          Add timezone to compare
        </Button>
      )}
    </section>
  );
}

export default function EpochConverter() {
  return (
    <div className="space-y-10">
      <EpochToTimestamp />
      <Separator />
      <TimestampToEpoch />
      <Separator />
      <TimezoneComparison />
    </div>
  );
}
