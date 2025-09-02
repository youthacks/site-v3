// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  experimental: {
    fonts: [
      {
        provider: "local",
        name: "Work Sans",
        cssVariable: "--font-sans",
        variants: [
          {
            src: ["./src/assets/fonts/WorkSans/WorkSans-Regular.woff2"],
            weight: "400",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/WorkSans/WorkSans-Italic.woff2"],
            weight: "400",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/WorkSans/WorkSans-Semibold.woff2"],
            weight: "600",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/WorkSans/WorkSans-SemiboldItalic.woff2"],
            weight: "600",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/WorkSans/WorkSans-Bold.woff2"],
            weight: "700",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/WorkSans/WorkSans-BoldItalic.woff2"],
            weight: "700",
            style: "italic",
          },
        ],
      },
      {
        provider: fontProviders.fontshare(),
        name: "Satoshi",
        cssVariable: "--font-satoshi",
        weights: ["700", "900"],
        subsets: ["latin"],
      },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [svelte()],
});