export interface JsonParseError {
  message: string;
  line?: number;
  column?: number;
}

export interface JsonParseResult {
  data?: unknown;
  error?: JsonParseError;
}

export function parseJson(input: string): JsonParseResult {
  if (!input.trim()) {
    return { error: { message: 'Nothing to parse' } };
  }

  try {
    return { data: JSON.parse(input) };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid JSON';
    const posMatch = message.match(/position (\d+)/);
    if (posMatch) {
      const pos = Number(posMatch[1]);
      const upToPos = input.slice(0, pos);
      const line = upToPos.split('\n').length;
      const column = pos - upToPos.lastIndexOf('\n');
      return { error: { message, line, column } };
    }
    return { error: { message } };
  }
}

export type IndentOption = 2 | 4 | 8 | 'tab';

function toStringifySpace(indent: IndentOption): string | number {
  return indent === 'tab' ? '\t' : indent;
}

export function formatJson(input: string, indent: IndentOption): string {
  const result = parseJson(input);
  if (result.error) throw new Error(result.error.message);
  return JSON.stringify(result.data, null, toStringifySpace(indent));
}

export function minifyJson(input: string): string {
  const result = parseJson(input);
  if (result.error) throw new Error(result.error.message);
  return JSON.stringify(result.data);
}
