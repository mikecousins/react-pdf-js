import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path  from'path';
import { defineConfig } from 'vite';

module.exports = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: '@mikecousins/react-pdf',
      fileName: (format) => `mikecousins-react-pdf.${format}.js`
    },
  },
  rollupOptions: {
    external: ['react', 'react-dom'],
    output: {
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
  },
});
