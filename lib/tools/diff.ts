interface LcsOp<T> {
  type: 'equal' | 'delete' | 'insert';
  value: T;
}

function computeLcsDiff<T>(a: T[], b: T[], equals: (x: T, y: T) => boolean): LcsOp<T>[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = equals(a[i], b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const ops: LcsOp<T>[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (equals(a[i], b[j])) {
      ops.push({ type: 'equal', value: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'delete', value: a[i] });
      i++;
    } else {
      ops.push({ type: 'insert', value: b[j] });
      j++;
    }
  }
  while (i < n) ops.push({ type: 'delete', value: a[i++] });
  while (j < m) ops.push({ type: 'insert', value: b[j++] });

  return ops;
}

export interface DiffToken {
  text: string;
  type: 'equal' | 'added' | 'removed';
}

function tokenizeWords(line: string): string[] {
  return line.match(/\s+|[^\s]+/g) ?? [];
}

function diffWords(left: string, right: string): { leftTokens: DiffToken[]; rightTokens: DiffToken[] } {
  const ops = computeLcsDiff(tokenizeWords(left), tokenizeWords(right), (x, y) => x === y);
  const leftTokens: DiffToken[] = [];
  const rightTokens: DiffToken[] = [];

  for (const op of ops) {
    if (op.type === 'equal') {
      leftTokens.push({ text: op.value, type: 'equal' });
      rightTokens.push({ text: op.value, type: 'equal' });
    } else if (op.type === 'delete') {
      leftTokens.push({ text: op.value, type: 'removed' });
    } else {
      rightTokens.push({ text: op.value, type: 'added' });
    }
  }

  return { leftTokens, rightTokens };
}

export type DiffRowType = 'equal' | 'delete' | 'insert' | 'modify';

export interface DiffRow {
  type: DiffRowType;
  leftLine: string | null;
  rightLine: string | null;
  leftLineNumber: number | null;
  rightLineNumber: number | null;
  leftTokens?: DiffToken[];
  rightTokens?: DiffToken[];
}

export interface DiffSummary {
  additions: number;
  deletions: number;
  modifications: number;
  unchanged: number;
}

export interface DiffResult {
  rows: DiffRow[];
  summary: DiffSummary;
}

function groupOps(ops: LcsOp<string>[]): DiffRow[] {
  const rows: DiffRow[] = [];
  let leftLineNumber = 1;
  let rightLineNumber = 1;
  let i = 0;

  while (i < ops.length) {
    const op = ops[i];

    if (op.type === 'equal') {
      rows.push({
        type: 'equal',
        leftLine: op.value,
        rightLine: op.value,
        leftLineNumber: leftLineNumber++,
        rightLineNumber: rightLineNumber++,
      });
      i++;
      continue;
    }

    const deletes: string[] = [];
    const inserts: string[] = [];
    while (i < ops.length && ops[i].type !== 'equal') {
      if (ops[i].type === 'delete') deletes.push(ops[i].value);
      else inserts.push(ops[i].value);
      i++;
    }

    const pairCount = Math.min(deletes.length, inserts.length);
    for (let k = 0; k < pairCount; k++) {
      const { leftTokens, rightTokens } = diffWords(deletes[k], inserts[k]);
      rows.push({
        type: 'modify',
        leftLine: deletes[k],
        rightLine: inserts[k],
        leftLineNumber: leftLineNumber++,
        rightLineNumber: rightLineNumber++,
        leftTokens,
        rightTokens,
      });
    }
    for (let k = pairCount; k < deletes.length; k++) {
      rows.push({
        type: 'delete',
        leftLine: deletes[k],
        rightLine: null,
        leftLineNumber: leftLineNumber++,
        rightLineNumber: null,
      });
    }
    for (let k = pairCount; k < inserts.length; k++) {
      rows.push({
        type: 'insert',
        leftLine: null,
        rightLine: inserts[k],
        leftLineNumber: null,
        rightLineNumber: rightLineNumber++,
      });
    }
  }

  return rows;
}

export interface DiffOptions {
  ignoreWhitespace?: boolean;
}

export const MAX_DIFF_LINES = 2000;

export function diffLines(original: string, changed: string, options: DiffOptions = {}): DiffResult {
  const a = original.split('\n');
  const b = changed.split('\n');

  if (a.length > MAX_DIFF_LINES || b.length > MAX_DIFF_LINES) {
    throw new Error(`Each side is limited to ${MAX_DIFF_LINES} lines for this tool`);
  }

  const equals = options.ignoreWhitespace
    ? (x: string, y: string) => x.trim() === y.trim()
    : (x: string, y: string) => x === y;

  const ops = computeLcsDiff(a, b, equals);
  const rows = groupOps(ops);

  const summary = rows.reduce<DiffSummary>(
    (acc, row) => {
      if (row.type === 'equal') acc.unchanged++;
      else if (row.type === 'insert') acc.additions++;
      else if (row.type === 'delete') acc.deletions++;
      else acc.modifications++;
      return acc;
    },
    { additions: 0, deletions: 0, modifications: 0, unchanged: 0 }
  );

  return { rows, summary };
}
