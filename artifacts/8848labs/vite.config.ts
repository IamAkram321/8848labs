import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type UserConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  // Load .env / .env.local from this package's root and merge with process.env.
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  // Default values for local development and cloud builds.
  const port = Number(env.PORT || 5173);
  const basePath = env.BASE_PATH || "/";

  return {
    base: basePath,

    plugins: [
      react(),
      tailwindcss(),
      runtimeErrorOverlay(),

      ...(env.NODE_ENV !== 'production' && env.REPL_ID !== undefined
        ? [
            await import('@replit/vite-plugin-cartographer').then((m) =>
              m.cartographer({
                root: path.resolve(import.meta.dirname, '..'),
              }),
            ),

            await import('@replit/vite-plugin-dev-banner').then((m) =>
              m.devBanner(),
            ),
          ]
        : []),
    ],

    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),

        '@assets': path.resolve(
          import.meta.dirname,
          '..',
          '..',
          'attached_assets',
        ),
      },

      dedupe: ['react', 'react-dom'],
    },

    root: path.resolve(import.meta.dirname),

    build: {
      outDir: path.resolve(import.meta.dirname, 'dist/public'),
      emptyOutDir: true,
    },

    server: {
      port,
      strictPort: true,
      host: '0.0.0.0',
      allowedHosts: true,

      fs: {
        strict: true,
      },

      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },

    preview: {
      port,
      host: '0.0.0.0',
      allowedHosts: true,
    },
  };
});