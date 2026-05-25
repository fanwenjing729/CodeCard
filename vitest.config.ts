import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'react-native-resolver',
      resolveId(id) {
        if (id === 'react-native' || id.startsWith('react-native/')) {
          return path.resolve(__dirname, 'test/mocks/react-native.ts');
        }
        return undefined;
      },
    },
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  test: {
    environment: 'jsdom',
  },
});
