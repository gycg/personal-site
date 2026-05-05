import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    updatedReason: z.string().optional(),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),
    cover: z.string().optional(),
    ogImage: z.string().optional(),
    canonical: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
