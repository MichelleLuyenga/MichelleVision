/* src/lib/og.ts
   Shared helper that builds the /og/[type]/[slug].png URL for every page type.
   These are static files generated at build time by
   src/pages/og/[type]/[slug].png.ts — pass the result into
   <BaseLayout image={...}> and BaseLayout forwards it to <SocialCard>.
*/

const SITE_URL = 'https://michellevision.com';

export function ogHome(): string {
  return `${SITE_URL}/og/home/index.png`;
}

/** slug must match a post's `entry.id` in the `blog` collection */
export function ogPost(slug: string): string {
  return `${SITE_URL}/og/post/${slug}.png`;
}

/** slug must match one of the `workPaths` entries in the og endpoint's getStaticPaths */
export function ogWork(slug: string): string {
  return `${SITE_URL}/og/work/${slug}.png`;
}

/** slug must be slugify(topicName) — same helper used by the topic page itself */
export function ogTopic(slug: string): string {
  return `${SITE_URL}/og/topic/${slug}.png`;
}
