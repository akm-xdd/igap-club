import { WORDLIST } from './wordlist';

// Uniform random integer in [0, exclusiveMax) via rejection sampling against
// crypto.getRandomValues, so results aren't biased toward smaller values the
// way a naive `Math.random() * n` or `randomByte % n` would be.
function secureRandomInt(exclusiveMax: number): number {
  if (exclusiveMax <= 0 || !Number.isInteger(exclusiveMax)) {
    throw new Error('exclusiveMax must be a positive integer');
  }
  const RANGE = 0x100000000; // 2^32
  const limit = Math.floor(RANGE / exclusiveMax) * exclusiveMax;
  const arr = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(arr);
    value = arr[0];
  } while (value >= limit);
  return value % exclusiveMax;
}

function secureRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

function pickFrom<T>(items: T[]): T {
  return items[secureRandomInt(items.length)];
}

function randomStringFromCharset(charset: string, length: number): string {
  let out = '';
  for (let i = 0; i < length; i++) out += charset[secureRandomInt(charset.length)];
  return out;
}

// ---------- Character mode ----------

export const CHARSET_GROUPS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
} as const;

export type CharsetGroup = keyof typeof CHARSET_GROUPS;

const AMBIGUOUS_CHARS = '0OoIl1|';

export interface CharacterModeOptions {
  length: number;
  groups: Record<CharsetGroup, boolean>;
  customCharset?: string;
  excludeAmbiguous?: boolean;
  prefix?: string;
  suffix?: string;
}

export function buildCharset(options: CharacterModeOptions): string {
  let charset = options.customCharset?.trim()
    ? options.customCharset
    : (Object.keys(CHARSET_GROUPS) as CharsetGroup[])
        .filter((g) => options.groups[g])
        .map((g) => CHARSET_GROUPS[g])
        .join('');

  if (options.excludeAmbiguous) {
    charset = [...charset].filter((c) => !AMBIGUOUS_CHARS.includes(c)).join('');
  }

  // De-duplicate while preserving order (matters if a custom charset repeats chars).
  charset = [...new Set(charset)].join('');

  return charset;
}

export function generateCharacterString(options: CharacterModeOptions): string {
  const charset = buildCharset(options);
  if (!charset) throw new Error('Select at least one character type');
  if (options.length < 1) throw new Error('Length must be at least 1');

  const body = randomStringFromCharset(charset, options.length);
  return `${options.prefix ?? ''}${body}${options.suffix ?? ''}`;
}

// ---------- Byte-encoded mode ----------

export type ByteEncoding = 'hex' | 'base64' | 'base64url' | 'base32';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function encodeBase32(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 0x1f];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 0x1f];
  }
  return output;
}

function bytesToBinaryString(bytes: Uint8Array): string {
  const CHUNK_SIZE = 8192;
  let result = '';
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    result += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
  }
  return result;
}

export function encodeBytes(bytes: Uint8Array, encoding: ByteEncoding): string {
  switch (encoding) {
    case 'hex':
      return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
    case 'base64':
      return btoa(bytesToBinaryString(bytes));
    case 'base64url':
      return btoa(bytesToBinaryString(bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    case 'base32':
      return encodeBase32(bytes);
  }
}

export interface ByteModeOptions {
  byteLength: number;
  encoding: ByteEncoding;
  prefix?: string;
  suffix?: string;
}

export function generateByteString(options: ByteModeOptions): string {
  if (options.byteLength < 1) throw new Error('Byte length must be at least 1');
  const bytes = secureRandomBytes(options.byteLength);
  const body = encodeBytes(bytes, options.encoding);
  return `${options.prefix ?? ''}${body}${options.suffix ?? ''}`;
}

// ---------- Passphrase mode ----------

export type PassphraseSeparator = '-' | '_' | '.' | ' ' | '';

export interface PassphraseModeOptions {
  wordCount: number;
  separator: PassphraseSeparator;
  capitalize?: boolean;
  appendNumber?: boolean;
}

export function generatePassphrase(options: PassphraseModeOptions): string {
  if (options.wordCount < 1) throw new Error('Word count must be at least 1');

  const words = Array.from({ length: options.wordCount }, () => pickFrom(WORDLIST)).map((w) =>
    options.capitalize ? w[0].toUpperCase() + w.slice(1) : w
  );

  if (options.appendNumber) {
    words.push(String(secureRandomInt(100)).padStart(2, '0'));
  }

  return words.join(options.separator);
}

// ---------- Pattern mode ----------

const PATTERN_TOKEN_CHARSETS: Record<string, string> = {
  A: CHARSET_GROUPS.uppercase,
  a: CHARSET_GROUPS.lowercase,
  '9': CHARSET_GROUPS.digits,
  '*': CHARSET_GROUPS.uppercase + CHARSET_GROUPS.lowercase + CHARSET_GROUPS.digits,
  X: CHARSET_GROUPS.uppercase + CHARSET_GROUPS.lowercase + CHARSET_GROUPS.digits + CHARSET_GROUPS.symbols,
};

export function generateFromPattern(pattern: string): string {
  if (!pattern) throw new Error('Enter a pattern');

  let output = '';
  for (const char of pattern) {
    const charset = PATTERN_TOKEN_CHARSETS[char];
    output += charset ? charset[secureRandomInt(charset.length)] : char;
  }
  return output;
}

// ---------- Entropy ----------

export interface EntropyEstimate {
  bits: number;
  label: 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
}

export function estimateEntropy(bits: number): EntropyEstimate {
  const rounded = Math.round(bits * 10) / 10;
  if (bits < 40) return { bits: rounded, label: 'Weak' };
  if (bits < 60) return { bits: rounded, label: 'Fair' };
  if (bits < 80) return { bits: rounded, label: 'Strong' };
  return { bits: rounded, label: 'Very Strong' };
}

export function characterModeEntropy(options: CharacterModeOptions): EntropyEstimate {
  const charsetSize = buildCharset(options).length;
  const bits = charsetSize > 1 ? options.length * Math.log2(charsetSize) : 0;
  return estimateEntropy(bits);
}

export function byteModeEntropy(options: ByteModeOptions): EntropyEstimate {
  return estimateEntropy(options.byteLength * 8);
}

export function passphraseModeEntropy(options: PassphraseModeOptions): EntropyEstimate {
  let bits = options.wordCount * Math.log2(WORDLIST.length);
  if (options.appendNumber) bits += Math.log2(100);
  return estimateEntropy(bits);
}

export function patternModeEntropy(pattern: string): EntropyEstimate {
  let bits = 0;
  for (const char of pattern) {
    const charset = PATTERN_TOKEN_CHARSETS[char];
    if (charset) bits += Math.log2(charset.length);
  }
  return estimateEntropy(bits);
}

// ---------- Bulk generation ----------

export const MAX_BULK_SECRETS = 100;

export function generateBulk(count: number, generator: () => string): string[] {
  const safeCount = Math.max(1, Math.min(Math.floor(count) || 0, MAX_BULK_SECRETS));
  return Array.from({ length: safeCount }, generator);
}
