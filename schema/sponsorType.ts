import { defineField, defineType } from "sanity";

export const sponsorType = defineType({
  name: "sponsor",
  title: "Sponsor",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Website URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      description: "Sponsor logo - recommended 2:1 aspect ratio",
      validation: (Rule) => Rule.required().assetRequired(),
    }),
  ],
});
