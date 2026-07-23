export const MAX_BULK_UUIDS = 1000;

export function generateUUID(): string {
  return crypto.randomUUID();
}

export function generateBulkUUIDs(count: number): string[] {
  const safeCount = Math.max(1, Math.min(Math.floor(count) || 0, MAX_BULK_UUIDS));
  return Array.from({ length: safeCount }, () => generateUUID());
}
