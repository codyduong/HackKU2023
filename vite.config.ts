import solid from 'solid-start/vite';
import { defineConfig } from 'vite';
import solidStyled from 'vite-plugin-solid-styled';
import Unfonts from 'unplugin-fonts/vite';

export default defineConfig({
  plugins: [
    solid(),
    solidStyled({
      filter: {
        include: 'src/**/*.tsx',
        exclude: 'node_modules/**/*.{ts,js}',
      },
    }),
    // Unfonts({
    //   google: {
    //     families: ['Atkinson Hyperlegible '],
    //   },
    //   fontsource: {
    //     families: ['Atkinson Hyperlegible'],
    //   },
    // }),
  ],
});
