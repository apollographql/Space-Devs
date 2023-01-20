
// Cursor Structure
// Base64
// limit:offset

export function getCursorFromLimitAndOffset(limit: number, offset: number = 0): string {
  const utf8String = [limit.toString(), offset.toString()].join(":");
  return Buffer.from(utf8String, 'utf8').toString("base64");
}

export function getLimitAndOffsetFromCursor(cursor: string): {
  limit: number;
  offset: number;
} {
  const utf8String = Buffer.from(cursor, 'base64').toString('utf8');
  const [limitStr, offsetStr] = utf8String.split(":");
  return {
    limit: parseInt(limitStr),
    offset: parseInt(offsetStr),
  }
}