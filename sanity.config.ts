import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "schema";

export default defineConfig({
  name: "youthacks",
  title: "Youthacks",
  projectId: "payz0nck",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
