// Cursor Structure
// Base64
// limit:offset

/**
 *
 * @param limit How many nodes in cursor, defaults to 10
 * @param offset How many nodes to offset the cursor
 * @returns string cursor based on limit and offset
 */
export function getCursorFromLimitAndOffset(
  limit: number = 10,
  offset: number = 0
): string {
  const utf8String = [limit.toString(), offset.toString()].join(":");
  return Buffer.from(utf8String, "utf8").toString("base64");
}

export function getLimitAndOffsetFromCursor(cursor: string): {
  limit: number;
  offset: number;
} {
  const utf8String = Buffer.from(cursor, "base64").toString("utf8");
  const [limitStr, offsetStr] = utf8String.split(":");
  return {
    limit: parseInt(limitStr),
    offset: parseInt(offsetStr),
  };
}

export function setCursors<T>(
  nodes: Array<T>,
  limit: number,
  offset?: number
): Array<{ node: T; cursor: string }> {
  return nodes.map((node, index) => ({
    node,
    cursor: getCursorFromLimitAndOffset(
      limit,
      offset ? offset + index + 1 : index + 1
    ),
  }));
}
