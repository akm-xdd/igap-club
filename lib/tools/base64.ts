export function encodeBase64(text: string): string {
  return btoa(text);
}

export function decodeBase64(encoded: string): string {
  try {
    return atob(encoded);
  } catch {
    throw new Error('Invalid Base64 string');
  }
}