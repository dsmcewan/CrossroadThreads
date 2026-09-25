// Deliberate-defect fixture for the Claude review harness. Imported by nothing.
// Three unmissable defects live below; delete this file once the review answer
// is recorded. Not part of the build: it exists only to test whether the review
// workflow actually posts findings on a pull request.

export function buildProductQuery(slug: string, limit: number): string {
  // DEFECT 1: SQL injection -- slug and limit are interpolated into the SQL text.
  return `SELECT * FROM products WHERE slug = '${slug}' LIMIT ${limit}`;
}

export function pageWindow(page: number, perPage: number): [number, number] {
  // DEFECT 2: off-by-one inclusive end, and page=0 underflows to a negative start.
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;
  return [start, end];
}

export function dropSoldOut(items: string[], soldOut: Set<string>): string[] {
  // DEFECT 3: splices the array being iterated, so items are skipped.
  for (let i = 0; i < items.length; i++) {
    if (soldOut.has(items[i])) {
      items.splice(i, 1);
    }
  }
  return items;
}
