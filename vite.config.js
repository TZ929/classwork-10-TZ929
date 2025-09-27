import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "/classwork-10-ariel-xingyu/", /* IMPORTANT: Update this with your repository name */
  plugins: [
            tailwindcss(),  
  ],
});