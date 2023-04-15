import solid from 'solid-start/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    solid(),
    solidStyled({
      filter: {
        include: 'src/**/*.tsx',
        exclude: 'node_modules/**/*.{ts,js}',
      },
    }),
  ],
});
