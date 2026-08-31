import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
    },
  ],
});

// import { defineConfig } from '@rslib/core';
// import { pluginReact } from '@rsbuild/plugin-react';

// export default defineConfig({
//   plugins: [pluginReact()],
//   source: {
//     entry: {
//       index: ['./src/**', '!src/__demos__/**', '!src/__tests__/**'],
//     },
//   },
//   lib: [
//     {
//       bundle: false,
//       dts: true,
//       format: 'esm',
//     },
//   ],
//   output: {
//     target: 'web',
//   },
// });
