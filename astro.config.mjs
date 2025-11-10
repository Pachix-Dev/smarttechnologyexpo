// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  site: "http://smarttechnologyexpo.mx/",

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

  integrations: [
    sitemap({
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
    }),
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
          crawlDelay: 1,
        },
      ],
      sitemap: [
        'http://smarttechnologyexpo.mx/sitemap-index.xml',
        'http://smarttechnologyexpo.mx/sitemap-0.xml',
      ],
    })
  ]
});