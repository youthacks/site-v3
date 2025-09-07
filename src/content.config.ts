import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const events = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/events" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      partners: z.string().optional(),

      logo: image(),
      banner: image(),
      colors: z.object({
        main: z.enum(["red", "blue", "emerald"]),
        background: z
          .string()
          .regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color")
          .toUpperCase(),
        text: z.enum(["black", "white"]),
      }),

      cta: z.optional(
        z.object({
          label: z.string(),
          href: z.string().url(),
        }),
      ),
    }),
});

const partners = defineCollection({
  loader: file("./src/content/partners.yaml"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      logo: image(),
      url: z.string().url(),
    }),
});

export const collections = { events, partners };
