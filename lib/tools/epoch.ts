export type EpochUnit = 'seconds' | 'milliseconds';

export interface EpochParseResult {
  ms: number;
  unit: EpochUnit;
}

/** Guesses whether a raw numeric string is seconds or milliseconds based on digit count. */
export function detectEpochUnit(value: string): EpochUnit {
  const digits = value.trim().replace(/[^0-9]/g, '').length;
  return digits >= 13 ? 'milliseconds' : 'seconds';
}

export function parseEpoch(value: string, unit?: EpochUnit): EpochParseResult {
  const trimmed = value.trim();
  if (!trimmed || !/^-?\d+$/.test(trimmed)) {
    throw new Error('Enter a valid epoch integer');
  }
  const resolvedUnit = unit ?? detectEpochUnit(trimmed);
  const ms = resolvedUnit === 'seconds' ? Number(trimmed) * 1000 : Number(trimmed);
  if (!Number.isFinite(ms)) {
    throw new Error('Epoch value is out of range');
  }
  return { ms, unit: resolvedUnit };
}

export interface EpochFormats {
  local: string;
  utc: string;
  iso: string;
  relative: string;
}

export function formatEpochMs(ms: number): EpochFormats {
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  return {
    local: new Intl.DateTimeFormat(undefined, {
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(date),
    utc: new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'UTC',
    }).format(date),
    iso: date.toISOString(),
    relative: formatRelative(ms),
  };
}

function formatRelative(ms: number): string {
  const diffMs = ms - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(diffSec) >= secondsInUnit || unit === 'second') {
      return rtf.format(Math.round(diffSec / secondsInUnit), unit);
    }
  }
  return rtf.format(0, 'second');
}

/** Returns the current instant as both epoch seconds and milliseconds. */
export function nowEpoch(): { seconds: number; ms: number } {
  const ms = Date.now();
  return { seconds: Math.floor(ms / 1000), ms };
}

/** Returns every IANA timezone name the browser knows about. */
export function listTimezones(): string[] {
  if (typeof Intl.supportedValuesOf === 'function') {
    return Intl.supportedValuesOf('timeZone');
  }
  return ['UTC'];
}

/**
 * Computes the offset (in ms) that must be subtracted from a UTC-interpreted
 * instant to get the true UTC instant for the given timezone's wall-clock reading.
 */
function getTimeZoneOffsetMs(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = dtf.formatToParts(instant);
  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') map[part.type] = part.value;
  }

  const asUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );

  return asUTC - instant.getTime();
}

/** Converts a wall-clock date/time (as typed by a user in `timeZone`) to a UTC epoch in ms. */
export function zonedDateTimeToEpochMs(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): number {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offset = getTimeZoneOffsetMs(new Date(utcGuess), timeZone);
  return utcGuess - offset;
}

/** Formats an epoch (ms) as a wall-clock date/time string in the given timezone. */
export function formatEpochInTimeZone(ms: number, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ms));
}

/** Returns the current UTC offset label (e.g. "UTC+05:30") for a timezone at a given instant. */
export function getTimeZoneOffsetLabel(ms: number, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
  }).formatToParts(new Date(ms));
  const tzPart = parts.find((p) => p.type === 'timeZoneName');
  return tzPart?.value ?? timeZone;
}
