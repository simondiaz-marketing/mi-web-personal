import { z, defineCollection } from 'astro:content';

const trayectoriaCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    badge: z.string(),
    subject: z.string(),
  }),
});

export const collections = {
  'trayectoria': trayectoriaCollection,
};
