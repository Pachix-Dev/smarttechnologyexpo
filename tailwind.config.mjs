
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}','./node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      // Puedes extender las animaciones aquí si quieres personalizadas
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}