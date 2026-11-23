import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.date().optional(),
    // Updated to reflect domain-specific analytics categories
    topics: z.string(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional()
  }),
});

export const collections = {
  'blog': blogCollection,
};
