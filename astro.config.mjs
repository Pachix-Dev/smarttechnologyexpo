// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import robotsTxt from "astro-robots-txt";

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: "https://smarttechnologyexpo.mx/",

  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false
    }
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap({
    i18n: {
      defaultLocale: 'es',
      locales: {
        es: 'es-MX',
        en: 'en-US',
      },
    },
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date(),
  }), robotsTxt({
    policy: [
      {
        userAgent: '*',
        allow: '/',
        crawlDelay: 1,
      },
    ],
    sitemap: [
      'https://smarttechnologyexpo.mx/sitemap-index.xml',
      'https://smarttechnologyexpo.mx/sitemap-0.xml',
    ],
  }), react()]
});