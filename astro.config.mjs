// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";

import sanity from "@sanity/astro";

import node from "@astrojs/node";

import cloudflare from "@astrojs/cloudflare";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  redirects: {
    "/for-parents": "/parents",
    "/contact-us": "/",
    "/events/coolashack": "/events/cool-as-hack",
  },

  fonts: [
    {
      provider: fontProviders.fontshare(),
      name: "Work Sans",
      cssVariable: "--font-sans",
      weights: ["400 700"],
      styles: ["normal", "italic"],
      subsets: ["latin"],
    },
    {
      provider: fontProviders.google(),
      name: "Instrument Sans",
      cssVariable: "--font-heading",
      weights: ["700"],
      subsets: ["latin"],
    },
    {
      provider: fontProviders.google(),
      name: "Instrument Serif",
      cssVariable: "--font-serif",
      weights: ["400"],
      styles: ["normal", "italic"],
      subsets: ["latin"],
    },
    {
      provider: fontProviders.google(),
      name: "Homemade Apple",
      cssVariable: "--font-cursive",
      weights: ["400"],
      subsets: ["latin"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    svelte(),
    sanity({
      projectId: "77myuhjy",
      dataset: "production",
    }),
  ],

  adapter: node({ mode: "standalone" }),
});