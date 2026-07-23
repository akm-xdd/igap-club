const MACROS: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

const MONTH_NAMES: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};

const WEEKDAY_NAMES: Record<string, number> = {
  SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6,
};

const MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface FieldSpec {
  min: number;
  max: number;
  names?: Record<string, number>;
}

const FIELD_SPECS: Record<string, FieldSpec> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12, names: MONTH_NAMES },
  dayOfWeek: { min: 0, max: 7, names: WEEKDAY_NAMES },
};

function resolveValue(token: string, spec: FieldSpec): number {
  const upper = token.toUpperCase();
  if (spec.names && upper in spec.names) return spec.names[upper];
  const n = Number(token);
  if (!Number.isInteger(n)) throw new Error(`Invalid value "${token}"`);
  return n;
}

function normalize(value: number, spec: FieldSpec): number {
  // Both cron conventions allow 7 for Sunday on the weekday field; treat it as 0.
  if (spec.max === 7 && value === 7) return 0;
  return value;
}

function expandField(field: string, spec: FieldSpec): number[] {
  const set = new Set<number>();

  for (const part of field.split(',')) {
    const [rangePart, stepPart] = part.split('/');
    const step = stepPart === undefined ? 1 : Number(stepPart);
    if (!Number.isInteger(step) || step <= 0) {
      throw new Error(`Invalid step in "${part}"`);
    }

    let start: number;
    let end: number;
    if (rangePart === '*') {
      start = spec.min;
      end = spec.max;
    } else if (rangePart.includes('-')) {
      const [a, b] = rangePart.split('-');
      start = resolveValue(a, spec);
      end = resolveValue(b, spec);
    } else {
      start = resolveValue(rangePart, spec);
      end = stepPart === undefined ? start : spec.max;
    }

    if (start < spec.min || end > spec.max || start > end) {
      throw new Error(`Value out of range in "${part}"`);
    }

    for (let v = start; v <= end; v += step) set.add(normalize(v, spec));
  }

  return [...set].sort((a, b) => a - b);
}

export interface ParsedCron {
  minute: number[];
  hour: number[];
  dayOfMonth: number[];
  month: number[];
  dayOfWeek: number[];
  wildcards: {
    minute: boolean;
    hour: boolean;
    dayOfMonth: boolean;
    month: boolean;
    dayOfWeek: boolean;
  };
}

export function parseCron(expression: string): ParsedCron {
  const trimmed = expression.trim();
  if (!trimmed) throw new Error('Enter a cron expression');

  const normalized = MACROS[trimmed.toLowerCase()] ?? trimmed;
  const fields = normalized.split(/\s+/);

  if (fields.length !== 5) {
    throw new Error(`Expected 5 fields (minute hour day month weekday), got ${fields.length}`);
  }

  const [minuteRaw, hourRaw, domRaw, monthRaw, dowRaw] = fields;

  return {
    minute: expandField(minuteRaw, FIELD_SPECS.minute),
    hour: expandField(hourRaw, FIELD_SPECS.hour),
    dayOfMonth: expandField(domRaw, FIELD_SPECS.dayOfMonth),
    month: expandField(monthRaw, FIELD_SPECS.month),
    dayOfWeek: expandField(dowRaw, FIELD_SPECS.dayOfWeek),
    wildcards: {
      minute: minuteRaw === '*',
      hour: hourRaw === '*',
      dayOfMonth: domRaw === '*',
      month: monthRaw === '*',
      dayOfWeek: dowRaw === '*',
    },
  };
}

function detectStep(values: number[], min: number, max: number): number | null {
  if (values[0] !== min) return null;
  if (values.length < 2) return null;
  const step = values[1] - values[0];
  const expected: number[] = [];
  for (let v = min; v <= max; v += step) expected.push(v);
  if (expected.length !== values.length) return null;
  return values.every((v, i) => v === expected[i]) ? step : null;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function formatList(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function describeTime(parsed: ParsedCron): string {
  const { minute, hour, wildcards } = parsed;

  if (wildcards.minute && wildcards.hour) return 'Every minute';

  const minuteStep = detectStep(minute, 0, 59);
  if (minuteStep && wildcards.hour) {
    return minuteStep === 1 ? 'Every minute' : `Every ${minuteStep} minutes`;
  }

  if (wildcards.hour) {
    return `At minute ${formatList(minute.map(String))} past every hour`;
  }

  const hourStep = detectStep(hour, 0, 23);
  if (wildcards.minute && hourStep) {
    return hourStep === 1 ? 'Every minute' : `Every minute, every ${hourStep} hours`;
  }

  if (wildcards.minute) {
    return `Every minute, during hour${hour.length > 1 ? 's' : ''} ${formatList(hour.map(String))}`;
  }

  if (minute.length === 1 && hour.length === 1) {
    return `At ${pad2(hour[0])}:${pad2(minute[0])}`;
  }

  const times = hour.flatMap((h) => minute.map((m) => `${pad2(h)}:${pad2(m)}`));
  return `At ${formatList(times)}`;
}

function describeDayOfMonth(days: number[]): string {
  return `on day ${formatList(days.map(String))} of the month`;
}

function describeDayOfWeek(days: number[]): string {
  return `only on ${formatList(days.map((d) => WEEKDAY_LABELS[d]))}`;
}

function describeMonth(months: number[]): string {
  return `in ${formatList(months.map((m) => MONTH_LABELS[m - 1]))}`;
}

export function describeCron(parsed: ParsedCron): string {
  const { wildcards, dayOfMonth, dayOfWeek, month } = parsed;
  let sentence = describeTime(parsed);

  const domPart = wildcards.dayOfMonth ? null : describeDayOfMonth(dayOfMonth);
  const dowPart = wildcards.dayOfWeek ? null : describeDayOfWeek(dayOfWeek);

  if (domPart && dowPart) {
    sentence += `, ${domPart}, or ${dowPart}`;
  } else if (domPart) {
    sentence += `, ${domPart}`;
  } else if (dowPart) {
    sentence += `, ${dowPart}`;
  } else {
    sentence += ', every day';
  }

  if (!wildcards.month) {
    sentence += `, ${describeMonth(month)}`;
  }

  return sentence;
}

function matchesDay(date: Date, parsed: ParsedCron): boolean {
  const month = date.getMonth() + 1;
  if (!parsed.month.includes(month)) return false;

  const { wildcards, dayOfMonth, dayOfWeek } = parsed;
  const domMatch = dayOfMonth.includes(date.getDate());
  const dowMatch = dayOfWeek.includes(date.getDay());

  if (!wildcards.dayOfMonth && !wildcards.dayOfWeek) return domMatch || dowMatch;
  if (!wildcards.dayOfMonth) return domMatch;
  if (!wildcards.dayOfWeek) return dowMatch;
  return true;
}

const MAX_DAYS_TO_SCAN = 4 * 366;

export function getNextRuns(parsed: ParsedCron, from: Date, count: number): Date[] {
  const results: Date[] = [];
  const start = new Date(from);
  start.setSeconds(0, 0);
  start.setTime(start.getTime() + 60_000);

  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());

  for (let dayIndex = 0; dayIndex < MAX_DAYS_TO_SCAN && results.length < count; dayIndex++) {
    if (matchesDay(cursor, parsed)) {
      for (const hour of parsed.hour) {
        for (const minute of parsed.minute) {
          const candidate = new Date(cursor);
          candidate.setHours(hour, minute, 0, 0);
          if (candidate.getTime() >= start.getTime()) {
            results.push(candidate);
          }
        }
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return results.sort((a, b) => a.getTime() - b.getTime()).slice(0, count);
}
