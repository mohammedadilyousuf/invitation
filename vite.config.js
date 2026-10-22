import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// In CI the base path is derived from the repo name, so renaming the repo needs no code change.
// Locally it defaults to '/'. A custom domain or <user>.github.io repo => '/'.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isUserSite = repo?.endsWith('.github.io');

export default defineConfig({
  plugins: [react()],
  // Two entry pages built from the same code: / (Nikah + Walima) and /walima/ (Walima only).
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        walima: fileURLToPath(new URL('./walima/index.html', import.meta.url)),
      },
    },
  },
  base: process.env.BASE_PATH ?? (repo && !isUserSite ? `/${repo}/` : '/'),
});
