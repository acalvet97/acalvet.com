import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    readTime: z.number().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    
    // Add other fields as needed
  })
});

export const collections = {
  'blog': blogCollection
};