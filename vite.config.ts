import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react(), tailwindcss(), viteSingleFile()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        '/ask': {
          target: env.VITE_BACKEND_DEV_URL || 'http://localhost:8787',
          changeOrigin: true,
        },
      },
    },
  };
});
