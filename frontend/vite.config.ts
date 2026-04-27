import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env.REACT_APP_API_URL': JSON.stringify(
        env.VITE_API_URL || env.REACT_APP_API_URL || ''
      ),
      'process.env.REACT_APP_BASE_URL': JSON.stringify(
        env.VITE_BASE_URL || env.REACT_APP_BASE_URL || ''
      ),
      'process.env.REACT_APP_SIGNUP': JSON.stringify(
        env.VITE_SIGNUP || env.REACT_APP_SIGNUP || ''
      ),
    },
    server: {
      proxy: {
        // Proxy all /api/v1 requests → backend (eliminates CORS)
        '/api/v1': {
          target: env.VITE_BASE_URL || env.REACT_APP_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', (err) => console.log('[proxy error]', err));
          },
        },
        // Proxy socket.io for WebSockets
        '/socket.io': {
          target: env.VITE_BASE_URL || env.REACT_APP_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          ws: true,
          secure: false,
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/setupTests.ts',
    },
  };
});
