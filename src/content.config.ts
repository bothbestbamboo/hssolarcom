import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dateField = z
  .union([z.string(), z.date()])
  .transform((val) => (val instanceof Date ? val.toISOString().slice(0, 10) : val))
  .default('2025-01-01');

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    id: z.number(),
    title: z.string(),
    categoryIds: z.array(z.number()).default([1]),
    // 同时兼容字符串和数字标签，统一转为字符串
    tags: z
      .array(z.union([z.string(), z.number()]))
      .transform((arr) => arr.map(String))
      .default([]),
    isHot: z.boolean().default(false),
    image: z.string().default('/Uploads/images/20241119/673c9f32ace84.jpg'),
    gallery: z.array(z.string()).optional(),
    summary: z.string().optional(),
    specs: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .optional(),
    datasheet: z.string().optional(),
    seoTitle: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    id: z.number(),
    type: z.enum(['news', 'case', 'project', 'solution', 'knowledge']).default('news'),
    title: z.string(),
    date: dateField,
    image: z.string().default('/Uploads/images/20241119/673c9f55de2e1.jpg'),
    summary: z.string().default(''),
    seoTitle: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    bannerImg: z.string().optional(),
    seoTitle: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
  }),
});

export const collections = {
  products,
  news,
  pages,
};