import { defineCollection, reference, z } from "astro:content";
import { file, glob } from "astro/loaders";

const events = defineCollection({
  loader: glob({ pattern: "**/*.{yaml,md}", base: "./src/content/events" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional(),
        with: z.string().optional(),

        logo: image(),
        artwork: image(),
        colors: z.object({
          main: z.enum(["red", "emerald", "blue", "pink"]),
          background: z
            .string()
            .regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color")
            .toUpperCase(),
          text: z.enum(["black", "white"]),
        }),
      })
      .and(
        z.union([
          z.object({
            concluded: z.literal(false),
            cta: z.optional(
              z.object({
                label: z.string(),
                href: z.string().url(),
              }),
            ),
          }),
          z.object({
            concluded: z.literal(true),
            images: z.array(image()).min(1),
            partners: z.array(reference("partners")).min(1),
          }),
        ]),
      ),
});

const partners = defineCollection({
  loader: file("./src/content/partners.yaml"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      logo: image(),
      url: z.string().url(),
      hidden: z.boolean().default(false),
    }),
});

export const collections = { events, partners };
