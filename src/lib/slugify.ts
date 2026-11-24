// src/lib/slugify.ts
// Shared so topic pages and their OG image route always agree on the same slug.
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
