export function generateUUID(): string {
  return crypto.randomUUID();
}

export function generateBulkUUIDs(count: number): string[] {
  return Array.from({ length: count }, () => generateUUID());
}