export const MAX_BASE64_INPUT_LENGTH = 5_000_000;

function bytesToBinaryString(bytes: Uint8Array): string {
  const CHUNK_SIZE = 8192;
  let result = '';
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    result += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
  }
  return result;
}

export function encodeBase64(text: string): string {
  if (text.length > MAX_BASE64_INPUT_LENGTH) {
    throw new Error(`Input is too large to encode (limit ${MAX_BASE64_INPUT_LENGTH.toLocaleString()} characters)`);
  }
  // btoa() only supports Latin-1; go through UTF-8 bytes first so non-ASCII text
  // (accents, emoji, etc.) round-trips correctly instead of throwing.
  const bytes = new TextEncoder().encode(text);
  return btoa(bytesToBinaryString(bytes));
}

export function decodeBase64(encoded: string): string {
  if (encoded.length > MAX_BASE64_INPUT_LENGTH) {
    throw new Error(`Input is too large to decode (limit ${MAX_BASE64_INPUT_LENGTH.toLocaleString()} characters)`);
  }
  try {
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error('Invalid Base64 string');
  }
}
